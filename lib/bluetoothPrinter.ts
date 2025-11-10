// Bluetooth Thermal Printer Utility
// Menggunakan Web Bluetooth API + ESC/POS Commands

export class BluetoothThermalPrinter {
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  
  // ESC/POS Commands
  private readonly ESC = '\x1B';
  private readonly GS = '\x1D';
  
  // Initialize commands
  private readonly INIT = this.ESC + '@';
  private readonly LINE_FEED = '\n';
  
  // Alignment
  private readonly ALIGN_LEFT = this.ESC + 'a' + '\x00';
  private readonly ALIGN_CENTER = this.ESC + 'a' + '\x01';
  private readonly ALIGN_RIGHT = this.ESC + 'a' + '\x02';
  
  // Text style
  private readonly BOLD_ON = this.ESC + 'E' + '\x01';
  private readonly BOLD_OFF = this.ESC + 'E' + '\x00';
  private readonly UNDERLINE_ON = this.ESC + '-' + '\x01';
  private readonly UNDERLINE_OFF = this.ESC + '-' + '\x00';
  
  // Text size
  private readonly NORMAL_SIZE = this.GS + '!' + '\x00';
  private readonly DOUBLE_SIZE = this.GS + '!' + '\x11';
  private readonly DOUBLE_WIDTH = this.GS + '!' + '\x10';
  private readonly DOUBLE_HEIGHT = this.GS + '!' + '\x01';
  
  // Paper
  private readonly CUT_PAPER = this.GS + 'V' + '\x41' + '\x00';
  private readonly FEED_PAPER = this.ESC + 'd' + '\x03';
  
  /**
   * Connect to Bluetooth printer
   */
  async connect(): Promise<boolean> {
    try {
      // Request Bluetooth device
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb', // Common thermal printer service
          '49535350-fe01-4d3f-9a00-000000000000', // Another common service
          'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Generic printer service
        ]
      });

      if (!this.device.gatt) {
        throw new Error('GATT not available');
      }

      // Connect to GATT server
      const server = await this.device.gatt.connect();
      
      // Try to find the correct service
      let service;
      try {
        service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      } catch {
        try {
          service = await server.getPrimaryService('49535350-fe01-4d3f-9a00-000000000000');
        } catch {
          service = await server.getPrimaryService('e7810a71-73ae-499d-8c15-faa9aef0c3f2');
        }
      }

      // Get characteristic for writing
      const characteristics = await service.getCharacteristics();
      this.characteristic = characteristics.find((c: BluetoothRemoteGATTCharacteristic) => c.properties.write || c.properties.writeWithoutResponse) || characteristics[0];

      return true;
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      return false;
    }
  }

  /**
   * Check if printer is connected
   */
  isConnected(): boolean {
    return this.device !== null && this.device.gatt?.connected === true;
  }

  /**
   * Disconnect from printer
   */
  disconnect(): void {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.characteristic = null;
  }

  /**
   * Send data to printer
   */
  private async sendData(data: string): Promise<void> {
    if (!this.characteristic) {
      throw new Error('Printer not connected');
    }

    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);
    
    // Split data into chunks (max 20 bytes per write for compatibility)
    const chunkSize = 20;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, Math.min(i + chunkSize, bytes.length));
      await this.characteristic.writeValue(chunk);
      // Small delay between chunks
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  /**
   * Print text
   */
  private text(content: string): string {
    return content + this.LINE_FEED;
  }

  /**
   * Print line separator
   */
  private separator(char: string = '-', length: number = 32): string {
    return char.repeat(length) + this.LINE_FEED;
  }

  /**
   * Format row with left and right alignment
   */
  private row(left: string, right: string, width: number = 32): string {
    const spaces = width - left.length - right.length;
    return left + ' '.repeat(Math.max(0, spaces)) + right + this.LINE_FEED;
  }

  /**
   * Print receipt
   */
  async printReceipt(order: any, items: any[]): Promise<boolean> {
    try {
      if (!this.isConnected()) {
        const connected = await this.connect();
        if (!connected) {
          throw new Error('Failed to connect to printer');
        }
      }

      let receipt = '';
      
      // Initialize printer
      receipt += this.INIT;
      
      // Header - Center aligned
      receipt += this.ALIGN_CENTER;
      receipt += this.BOLD_ON;
      receipt += this.text('Martabak & Terang Bulan');
      receipt += this.text('Tip Top');
      receipt += this.BOLD_OFF;
      receipt += this.LINE_FEED;
      receipt += this.text('Jl. Seroja, Karang Anyar,');
      receipt += this.text('Kec. Tarakan Barat,');
      receipt += this.text('Kota Tarakan');
      receipt += this.text('Telp: 082319777005');
      receipt += this.separator('=', 32);
      
      // Order info - Left aligned
      receipt += this.ALIGN_LEFT;
      receipt += this.text(`Tanggal: ${this.formatDateTime(order.order_time)}`);
      receipt += this.text(`No: ${order.order_no}`);
      receipt += this.separator('-', 32);
      
      // Items
      for (const item of items) {
        const itemTotal = item.qty * item.unit_price;
        
        // Item line: qty x name
        let itemLine = `${item.qty} ${item.products.name}`;
        
        // Add variant in the same line if exists and fits
        if (item.variant_name) {
          itemLine = `${item.qty} ${item.products.name}`;
          receipt += this.text(itemLine);
          receipt += this.text(`  (${item.variant_name})`);
        } else {
          receipt += this.text(itemLine);
        }
        
        // Price line: @unit_price aligned right with total
        receipt += this.row(
          `  @${this.formatCurrency(item.unit_price)}`,
          this.formatCurrency(itemTotal)
        );
        
        // Notes if exists
        if (item.notes) {
          receipt += this.text(`  Catatan: ${item.notes}`);
        }
      }
      
      receipt += this.separator('-', 32);
      
      // Summary - Right aligned values
      receipt += this.ALIGN_LEFT;
      receipt += this.row('Subtotal', this.formatCurrency(order.subtotal));
      
      if (order.discount_amount > 0) {
        receipt += this.row('Diskon', `-${this.formatCurrency(order.discount_amount)}`);
      }
      
      if (order.extra_fee > 0) {
        receipt += this.row('Biaya Tambahan', this.formatCurrency(order.extra_fee));
      }
      
      receipt += this.separator('=', 32);
      
      // Total - Bold and larger
      receipt += this.BOLD_ON;
      receipt += this.row('TOTAL', this.formatCurrency(order.total));
      receipt += this.BOLD_OFF;
      
      receipt += this.separator('=', 32);
      
      // Payment info
      const payMethodLabel = order.pay_method === 'cash' ? 'Tunai' : 
                            order.pay_method === 'qris' ? 'QRIS' : 'E-Wallet';
      
      receipt += this.row(`Bayar (${payMethodLabel})`, this.formatCurrency(order.paid_amount));
      receipt += this.row('Kembalian', this.formatCurrency(order.change_amount));
      
      receipt += this.separator('-', 32);
      
      // Footer - Center aligned
      receipt += this.ALIGN_CENTER;
      receipt += this.LINE_FEED;
      receipt += this.BOLD_ON;
      receipt += this.text('Terima kasih!');
      receipt += this.BOLD_OFF;
      receipt += this.text('Selamat Menikmati');
      receipt += this.LINE_FEED;
      receipt += this.LINE_FEED;
      receipt += this.LINE_FEED;
      
      // Feed and cut paper
      receipt += this.FEED_PAPER;
      receipt += this.CUT_PAPER;
      
      // Send to printer
      await this.sendData(receipt);
      
      return true;
    } catch (error) {
      console.error('Print error:', error);
      return false;
    }
  }

  /**
   * Format currency
   */
  private formatCurrency(amount: number): string {
    // Format: Rp 40.000 (dengan titik pemisah ribuan)
    return `Rp ${amount.toLocaleString('id-ID')}`;
  }

  /**
   * Format date time
   */
  private formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes} WIB`;
  }
}

// Singleton instance
let printerInstance: BluetoothThermalPrinter | null = null;

export function getBluetoothPrinter(): BluetoothThermalPrinter {
  if (!printerInstance) {
    printerInstance = new BluetoothThermalPrinter();
  }
  return printerInstance;
}
