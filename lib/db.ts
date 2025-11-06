import { neon } from '@neondatabase/serverless';
import type { Database } from '@/types/database';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL environment variable. Please check your .env.local file.');
}

// Create Neon SQL client
export const sql = neon(databaseUrl);

// Helper types for better TypeScript support
export type Tables = Database['Tables'];
export type Product = Tables['products']['Row'];
export type ProductVariant = Tables['product_variants']['Row'];
export type Order = Tables['orders']['Row'];
export type OrderItem = Tables['order_items']['Row'];
export type Shift = Tables['shifts']['Row'];

// Helper function to execute queries with proper error handling
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const result = await sql(query, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function for transactions
export async function executeTransaction<T = any>(
  queries: Array<{ query: string; params?: any[] }>
): Promise<T[]> {
  try {
    // Neon serverless doesn't support traditional transactions
    // Execute queries sequentially
    const results: T[] = [];
    for (const { query, params = [] } of queries) {
      const result = await sql(query, params);
      results.push(result as T);
    }
    return results;
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}
