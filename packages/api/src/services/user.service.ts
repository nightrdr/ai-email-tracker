import { ConflictError } from '../errors/app-error';
import { query } from '../db';
import { hashPassword } from '../utils/password';
import { SubscriptionTier, User } from '../types/database';

export interface CreateUserDto {
  email: string;
  password: string;
}

export class UserService {
  async createUser(dto: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('User already exists');
    }

    const passwordHash = await hashPassword(dto.password);
    const result = await query<User>(
      `INSERT INTO users (email, password_hash, subscription_tier)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dto.email, passwordHash, SubscriptionTier.FREE]
    );

    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await query<User>('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ?? null;
  }
}

