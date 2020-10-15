// Libraries
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.test') })

export default async (): Promise<void> => {
  console.log('\nStarting tests...\n');
};
