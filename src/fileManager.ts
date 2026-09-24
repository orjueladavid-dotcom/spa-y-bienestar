import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Treatment, Report } from './types.js';

export async function loadTreatments(filePath: string): Promise<Treatment[]> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content) as Treatment[];
    return data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`❌ Error: No se encontró el archivo "${filePath}"`);
      process.exit(1);
    }
    throw error;
  }
}

export async function saveReport(filePath: string, report: Report): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`📄 Reporte guardado en: ${filePath}`);
}
