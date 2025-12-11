/* eslint-disable @typescript-eslint/no-explicit-any */
import { openDB } from "idb";

export const initDB = async () => {
  return openDB("qasa-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("uploads")) {
        db.createObjectStore("uploads", { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

export const saveUpload = async (fileData: any) => {
  const db = await initDB();
  return db.put("uploads", fileData);
};

export const getUploads = async () => {
  const db = await initDB();
  return db.getAll("uploads");
};
