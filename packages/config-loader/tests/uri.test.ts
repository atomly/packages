// Libraries
import 'reflect-metadata'; // Necessary for nested configurations

// Dependencies
import { ParsedUri } from '../src';

describe('testing ParsedUri regex matches', () => {
  test('protocol is parsed correctly', () => {
    const uri = 'mongodb://127.0.0.1:27017/surveyshark-api?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
    const parsedUri = new ParsedUri(uri);
    expect(parsedUri.protocol).toBe('mongodb');
  });
  test('SRV protocol is parsed correctly', () => {
    const uri = 'mongodb+srv://127.0.0.1:27017/surveyshark-api?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
    const parsedUri = new ParsedUri(uri);
    expect(parsedUri.protocol).toBe('mongodb+srv');
  });

  test('slashes are parsed correctly', () => {
    const uri = 'mongodb://127.0.0.1:27017/surveyshark-api?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
    const parsedUri = new ParsedUri(uri);
    expect(parsedUri.slashes).toBe('//');
  });

  test('authority is parsed correctly', () => {
    const uri = 'mongodb://username:password@mongodb0.example.com:27017/?authSource=admin';
    const parsedUri = new ParsedUri(uri);
    expect(parsedUri.authority).toBe('username:password');
  });

  test('host is parsed correctly', () => {
    const uri = 'mongodb://username:password@mongodb0.example.com:27017/?authSource=admin';
    const parsedUri = new ParsedUri(uri);
    expect(parsedUri.host).toBe('mongodb0.example.com');
  });

  test('port is parsed correctly', () => {
    const uri = 'mongodb://username:password@mongodb0.example.com:27017/?authSource=admin';
    const parsedUri = new ParsedUri(uri);
    expect(parsedUri.port).toBe('27017');
  });

  test('path is parsed correctly', () => {
    const uri = 'https://docs.mongodb.com/manual/reference/connection-string/#connections-connection-examples';
    const parsedUri = new ParsedUri(uri);
    console.log('parsedUri: ', parsedUri);
    expect(parsedUri.path).toBe('/manual/reference/connection-string/');
  });

  test('query is parsed correctly', () => {
    const uri = 'mongodb://127.0.0.1:27017/surveyshark-api?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
    const parsedUri = new ParsedUri(uri);
    expect(parsedUri.query).toBe('readPreference=primary&appname=MongoDB%20Compass&ssl=false');
  });

  test('hash is parsed correctly', () => {
    const uri = 'https://docs.mongodb.com/manual/reference/connection-string/#connections-connection-examples';
    const parsedUri = new ParsedUri(uri);
    expect(parsedUri.hash).toBe('connections-connection-examples');
  });
});
