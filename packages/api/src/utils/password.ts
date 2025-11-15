import bcrypt from 'bcrypt';

const DEFAULT_ROUNDS = 10;
const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS ?? '', 10);
const resolvedRounds = Number.isNaN(saltRounds) ? DEFAULT_ROUNDS : saltRounds;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, resolvedRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

