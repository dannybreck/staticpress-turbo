import { Command } from 'commander';
import { run as initCmd } from './commands/init';

const program = new Command();

program
  .name('spt')
  .description('StaticPress Turbo CLI')
  .version('0.0.0');

program
  .command('init')
  .description('Initialise a StaticPress project')
  .option('-s, --stack <preset>',  'astro | next', 'astro')
  .option('-o, --output <folder>', 'destination folder', 'frontend')
  .action((opts) => initCmd(opts.stack, opts.output));

program.parseAsync(process.argv);
