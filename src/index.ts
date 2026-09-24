import { Command } from 'commander';
import { loadTreatments, saveReport } from './fileManager.js';
import { buildReport, printSummary } from './dataProcessor.js';

const program = new Command();

program
  .name('spa-y-bienestar')
  .description('CLI de Spay Bienestar — Procesador de tratamientos')
  .option('-c, --category <category>', 'Filtrar por categoría')
  .parse(process.argv);

const options = program.opts<{ category?: string }>();

async function main(): Promise<void> {
  const treatments = await loadTreatments('data/treatments.json');
  const report = buildReport(treatments, options.category);

  printSummary(report);
  await saveReport('output/report.json', report);
}

main().catch((err: unknown) => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});
