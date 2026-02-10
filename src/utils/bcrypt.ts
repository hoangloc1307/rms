import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;
export async function hashString(plain: string) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
}

export async function verifyString(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
