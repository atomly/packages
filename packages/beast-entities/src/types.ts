// Types
import {
  Connection,
} from 'typeorm';

export interface IDatabase {
  connection: Connection;
  getConnection(connection?: string): Promise<Connection> 
  closeConnection(): Promise<void>
  deleteEntities(): Promise<void>
}
