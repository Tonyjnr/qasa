/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { openDB } from "idb";

const DB_NAME = "qasa-user-data";
const STORE_NAME = "uploaded-datasets";

const getDb = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });

export interface UploadedDataset {
  id?: number; // IndexedDB will auto-generate if not provided
  name: string;
  content: any; // The parsed JSON content
  createdAt: string;
}

export const saveDataset = async (
  dataset: Omit<UploadedDataset, "id" | "createdAt">
) => {
  const db = await getDb();
  await db.add(STORE_NAME, {
    ...dataset,
    createdAt: new Date().toISOString(),
  });
};

export const listDatasets = async (): Promise<UploadedDataset[]> => {
  const db = await getDb();
  return db.getAll(STORE_NAME);
};

export const deleteDataset = async (id: number) => {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
};
