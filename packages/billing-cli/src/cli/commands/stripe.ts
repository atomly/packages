// Libraries
import { CommandModule } from 'yargs';

export default {
  command: 'stripe <command>',
  desc: 'Set of Stripe Billing SDK commands.',
  builder: yargs => yargs.commandDir('stripe_cmds'),
  handler: async (): Promise<void> => {},
} as CommandModule;
