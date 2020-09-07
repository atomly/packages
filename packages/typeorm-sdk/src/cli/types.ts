// Types
import { ConnectionOptions } from 'typeorm';

export enum ECommands {
  MODELS = 'models',
  GENERATE = 'generate',
  RUN = 'run',
}

export interface IOptions {
  config: string
  connection: string
  name?: string
  output?: string
  typeorm_cli?: string
}

export interface ICommands {
  options: IOptions
  connection: ConnectionOptions
  execute(command: ECommands): Promise<void>
}
