import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface DailyReport {
  date: string;
  order_count: number;
  total_revenue: number;
  avg_order_value: number;
  by_payment: {
    cash: number;
    qris: number;
    ewallet: number;
  };
  top_products: Array<{
    product_name: string;
    qty: number;
    revenue: number;
  }>;
}

export function generateDailyReportPDF(report: DailyReport) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header - Logo & Title
  doc.setFillColor(255, 127, 0); // Orange
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Martabak & Terang Bulan Tip Top', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Laporan Penjualan Harian', pageWidth / 2, 30, { align: 'center' });

  yPos = 50;

  // Date
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const formattedDate = format(new Date(report.date), 'EEEE, dd MMMM yyyy', { locale: id });
  doc.text(`Tanggal: ${formattedDate}`, 14, yPos);
  yPos += 10;

  // Summary Box
  doc.setFillColor(249, 250, 251); // Light gray
  doc.roundedRect(14, yPos, pageWidth - 28, 35, 3, 3, 'F');
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text('RINGKASAN PENJUALAN', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  
  // Total Transaksi
  doc.text('Total Transaksi:', 20, yPos);
  doc.text(`${report.order_count} transaksi`, pageWidth - 20, yPos, { align: 'right' });
  
  yPos += 8;
  // Total Pendapatan
  doc.setTextColor(255, 127, 0); // Orange
  doc.text('Total Pendapatan:', 20, yPos);
  doc.text(formatCurrency(report.total_revenue), pageWidth - 20, yPos, { align: 'right' });
  
  yPos += 8;
  // Rata-rata per Transaksi
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Rata-rata per Transaksi:', 20, yPos);
  doc.text(formatCurrency(report.avg_order_value), pageWidth - 20, yPos, { align: 'right' });

  yPos += 15;

  // Payment Methods
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Metode Pembayaran', 14, yPos);
  yPos += 5;

  const paymentData = [
    ['Tunai (Cash)', formatCurrency(report.by_payment.cash)],
    ['QRIS', formatCurrency(report.by_payment.qris)],
    ['E-Wallet', formatCurrency(report.by_payment.ewallet)],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Metode', 'Total']],
    body: paymentData,
    theme: 'striped',
    headStyles: {
      fillColor: [255, 127, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 'auto', halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Top Products (with variants)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Produk Terlaris', 14, yPos);
  yPos += 5;

  const productsData = (report as any).top_variants && (report as any).top_variants.length > 0
    ? (report as any).top_variants.map((item: any, index: number) => [
        `${index + 1}`,
        `${item.product_name}\n${item.variant_name}`,
        `${item.qty} pcs`,
        formatCurrency(item.revenue),
      ])
    : report.top_products.map((product, index) => [
        `${index + 1}`,
        product.product_name,
        `${product.qty} pcs`,
        formatCurrency(product.revenue),
      ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Produk', 'Terjual', 'Pendapatan']],
    body: productsData,
    theme: 'striped',
    headStyles: {
      fillColor: [255, 127, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 85 },
      2: { cellWidth: 35, halign: 'center' },
      3: { cellWidth: 47, halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      `Dicetak: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  return doc;
}

export function downloadPDF(doc: jsPDF, filename: string) {
  doc.save(filename);
}

export function openPDFInNewTab(doc: jsPDF) {
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
}
