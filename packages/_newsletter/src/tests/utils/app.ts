// Libraries
import request from 'supertest';

// Dependencies
import { app as expressApp } from '../../app';

export const app = request(expressApp);
