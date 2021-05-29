// Libraries
import { CommandModule } from 'yargs';

// Relatives
import plans from './plans';
import products from './products';

const commands = [plans, products];

export default {
  command: 'stripe <command>',
  desc: 'Set of Stripe Billing SDK commands.',
  builder: yargs => yargs.command(commands as unknown as CommandModule),
  handler: async (): Promise<void> => {},
} as CommandModule;
