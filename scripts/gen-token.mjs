// Uso: npm run gen-token -- [email] [secreto]
import { createHmac } from 'node:crypto';

const email = process.argv[2] ?? 'admin@empresa.com';
const secret = process.argv[3] ?? 'change-me-in-env';
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');

const now = Math.floor(Date.now() / 1000);
const header = b64({ alg: 'HS256', typ: 'JWT' });
const payload = b64({ sub: 'demo-user-001', email, name: 'Usuario Demo', iat: now, exp: now + 10 * 365 * 24 * 3600 });
const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');

console.log(`${header}.${payload}.${signature}`);
