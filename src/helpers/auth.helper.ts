import argon2 from 'argon2';
import crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

export function generatePassword(length = 12) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

export function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function verifyResetTokenHash(token: string, hash: string): boolean {
  return crypto.createHash('sha256').update(token).digest('hex') === hash;
}
