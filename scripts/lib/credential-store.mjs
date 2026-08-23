import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { homedir, platform } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const nativeDir = join(moduleDir, '..', 'native');

function run(command, args, input = '') {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    const output = [];
    child.stdout.on('data', (chunk) => output.push(chunk));
    child.stderr.on('data', () => {});
    child.on('error', () => reject(new Error('credential-store-unavailable')));
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error('credential-store-failed'));
        return;
      }
      resolve(Buffer.concat(output).toString('utf8'));
    });
    child.stdin.end(input);
  });
}

async function macosBinary() {
  const source = join(nativeDir, 'macos-keychain.swift');
  const sourceData = await readFile(source);
  const digest = createHash('sha256').update(sourceData).digest('hex');
  const cacheDir = join(homedir(), '.cache', 'quip-setup');
  const binary = join(cacheDir, 'macos-keychain');
  const marker = `${binary}.sha256`;
  await mkdir(cacheDir, { recursive: true, mode: 0o700 });

  let current = '';
  try {
    current = (await readFile(marker, 'utf8')).trim();
    await stat(binary);
  } catch {}

  if (current !== digest) {
    await run('/usr/bin/xcrun', ['swiftc', source, '-framework', 'Security', '-O', '-o', binary]);
    await writeFile(marker, `${digest}\n`, { mode: 0o600 });
  }

  return binary;
}

async function command(action, service, account, secret = '') {
  if (!/^[a-z0-9.-]{3,120}$/i.test(service) || account.length < 1 || account.length > 1024) {
    throw new Error('invalid-credential-identifier');
  }

  if (platform() === 'darwin') {
    return run(await macosBinary(), [action, service, account], secret);
  }

  if (platform() === 'win32') {
    return run('powershell.exe', [
      '-NoLogo',
      '-NoProfile',
      '-NonInteractive',
      '-ExecutionPolicy',
      'Bypass',
      '-File',
      join(nativeDir, 'windows-credential.ps1'),
      '-Action',
      action,
      '-Service',
      service,
      '-Account',
      account,
    ], secret);
  }

  throw new Error('unsupported-credential-store');
}

export async function storeCredential(service, account, secret) {
  const maximum = platform() === 'win32' ? 2_560 : 16_384;
  const size = typeof secret === 'string'
    ? Buffer.byteLength(secret, platform() === 'win32' ? 'utf16le' : 'utf8')
    : 0;
  if (typeof secret !== 'string' || secret.length < 1 || size > maximum) {
    throw new Error('invalid-credential');
  }
  await command('store', service, account, secret);
}

export async function getCredential(service, account) {
  const secret = await command('get', service, account);
  if (!secret) throw new Error('credential-not-found');
  return secret;
}

export async function deleteCredential(service, account) {
  await command('delete', service, account);
}
