#!/usr/bin/env node

const fs = require('fs');

const filename = process.argv[2];
if (!filename) {
  throw new Error('Usage: configure-node-conf.js <node.conf>');
}

const required = (name) => {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`${name} must be set`);
  }
  return value;
};

const database = [
  required('TSWOW_DB_HOST'),
  process.env.TSWOW_DB_PORT || '3306',
  process.env.TSWOW_DB_USER || 'root',
  required('TSWOW_DB_PASSWORD'),
].join(';');

const settings = new Map([
  ['Default.Client', JSON.stringify(process.env.TSWOW_CLIENT_PATH || '/client')],
  ['AutoStart.Client', '0'],
  ['Database.HostedPort', '0'],
  ['Database.WorldSource', JSON.stringify(database)],
  ['Database.WorldDest', JSON.stringify(database)],
  ['Database.Auth', JSON.stringify(database)],
  ['Database.Characters', JSON.stringify(database)],
]);

let content = fs.readFileSync(filename, 'utf8');
for (const [key, value] of settings) {
  const expression = new RegExp(`^${key.replaceAll('.', '\\.') }\\s*=.*$`, 'm');
  const line = `${key} = ${value}`;
  content = expression.test(content)
    ? content.replace(expression, line)
    : `${content.trimEnd()}\n${line}\n`;
}

fs.writeFileSync(filename, content);
