// Libraries
import { parse } from 'dotenv';
import path from 'path';
import fs from 'fs';

export default async (): Promise<void> => {
  console.log('\nLoading environment configuration...\n');
  const envPath = path.resolve(__dirname, '..', '..', 'newsletter.config.env');
  if (!fs.existsSync(envPath)) {
    console.error('ERROR: Invalid .env file path: ', envPath);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
  const endData = fs.readFileSync(envPath).toString('utf-8');
  const env = parse(endData);
  console.log('Loading the following environmental data: ', JSON.stringify(env, null, 2));
  Object.assign(process.env, env);
  console.log('\nStarting tests:\n');
};
