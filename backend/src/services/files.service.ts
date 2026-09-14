import fs from 'fs/promises';
import path from 'path';

/**
 * Root of the hardcoded JSON data set. Resolved relative to this file so it works
 * identically from `src/` under tsx and from `dist/` after a build (the build step
 * copies `src/data` to `dist/data`).
 */
export const DATA_DIR = path.resolve(__dirname, '../data');

export const filesService = {
  getFile: async (filePath: string): Promise<string> => {
    return fs.readFile(filePath, 'utf8');
  },

  /** Reads and parses a JSON file from the data directory. */
  readJsonData: async <T>(fileName: string): Promise<T> => {
    const raw = await fs.readFile(path.join(DATA_DIR, fileName), 'utf8');
    return JSON.parse(raw) as T;
  },

  /** Lists every `.json` file in the data directory. */
  listJsonDataFiles: async (): Promise<string[]> => {
    const entries = await fs.readdir(DATA_DIR);
    return entries.filter((entry) => entry.endsWith('.json'));
  },
};
