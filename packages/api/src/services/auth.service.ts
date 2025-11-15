import { AuthError } from '../errors/app-error';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { User } from '../types/database';
import { CreateUserDto, UserService } from './user.service';

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password_hash'>;
}

export class AuthService {
  private readonly userService = new UserService();

  private sanitizeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash: _passwordHash, ...rest } = user;
    return rest;
  }

  async register(dto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.userService.createUser(dto);
    const token = generateToken({
      user_id: user.id,
      email: user.email,
      subscription_tier: user.subscription_tier,
    });

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      throw new AuthError('Invalid credentials');
    }

    const token = generateToken({
      user_id: user.id,
      email: user.email,
      subscription_tier: user.subscription_tier,
    });

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }
}

