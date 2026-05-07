import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface ReceiptDB extends DBSchema {
  receipts: {
    key: string;
    value: string; // Data URL
  };
}

let dbPromise: Promise<IDBPDatabase<ReceiptDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ReceiptDB>('adjust_receipts_db', 1, {
      upgrade(db) {
        db.createObjectStore('receipts');
      },
    });
  }
  return dbPromise;
}

export async function saveReceipt(key: string, dataUrl: string): Promise<void> {
  const db = await getDB();
  await db.put('receipts', dataUrl, key);
}

export async function getReceipt(key: string): Promise<string | undefined> {
  const db = await getDB();
  return db.get('receipts', key);
}

export async function deleteReceipt(key: string): Promise<void> {
  const db = await getDB();
  await db.delete('receipts', key);
}

export async function clearReceiptDB(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase('adjust_receipts_db');
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}
