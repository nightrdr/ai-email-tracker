# Story 1.3: User Authentication & Registration

**Story ID:** STORY-1.3  
**Epic:** Epic 1 - Foundation & Core Tracking Infrastructure  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 5  
**Estimated Time:** 4-6 hours  
**Status:** Not Started

---

## User Story

**As a** new user  
**I want** to create an account with email and password  
**So that** I can access the email tracking platform

---

## Business Value

Authentication is critical for:
- Securing user data and tracking information
- Enabling personalized experiences per user
- Supporting subscription tiers and billing
- Preventing unauthorized access to tracking data

---

## Acceptance Criteria

### ✅ AC1: User Registration Endpoint
- [x] POST /api/auth/register endpoint created
- [x] Accepts email and password in request body
- [x] Creates user with bcrypt-hashed password
- [x] Returns JWT token and user object (password excluded)

### ✅ AC2: Email Validation
- [x] Email format validated (valid email syntax)
- [x] Email uniqueness checked (no duplicate accounts)
- [x] Clear error messages for invalid email

### ✅ AC3: Password Validation
- [x] Minimum 8 characters enforced
- [x] Requires mix of letters and numbers
- [x] Clear error messages for weak passwords

### ✅ AC4: User Login Endpoint
- [x] POST /api/auth/login endpoint created
- [x] Validates credentials against database
- [x] Returns JWT token on successful login
- [x] Returns 401 for invalid credentials

### ✅ AC5: JWT Token Management
- [x] JWT tokens expire after 7 days
- [x] Token includes user_id claim
- [x] Token includes subscription_tier claim
- [x] Token signed with secure secret

### ✅ AC6: Authentication Middleware
- [x] Middleware function validates JWT on protected routes
- [x] Extracts user info from valid tokens
- [x] Returns 401 for missing/invalid tokens
- [x] Middleware reusable across all protected endpoints

### ✅ AC7: Error Handling
- [x] 400 Bad Request for validation errors
- [x] 401 Unauthorized for auth failures
- [x] 409 Conflict for duplicate email
- [x] 500 Internal Server Error with generic message
- [x] Error details logged server-side only

### ✅ AC8: Security Best Practices
- [x] Passwords never stored in plain text
- [x] Passwords never returned in API responses
- [x] bcrypt salt rounds configured appropriately
- [x] JWT secret stored in environment variable

---

## Requirements Traceability

**PRD Coverage:**
- **Foundational Story:** Enables secure access to all platform features
- **FR43-FR48:** Supports billing and subscription management (user accounts required)
- **NFR3:** GDPR-compliant user data storage
- **NFR7:** Secure authentication with industry-standard practices

**Architecture References:**
- Authentication: JWT-based stateless authentication
- Security: bcrypt password hashing, secure token storage
- API Design: RESTful endpoints for auth operations

**Epic Context:**
This story establishes user authentication required for all personalized features, subscription management, and secure API access across the platform.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Password hashing, JWT generation/verification, validation logic
- **Integration Tests:** Full registration/login flow with database
- **Security Tests:** Password strength, token tampering, SQL injection attempts
- **E2E Tests:** Complete user journey from registration to authenticated API access

**Test Environment:**
- Local: Docker PostgreSQL + API server
- Test users with various subscription tiers
- Mock JWT secrets for testing

**Success Metrics:**
- Registration: < 500ms response time
- Login: < 300ms response time
- Token validation: < 50ms
- Zero password exposure in logs/responses

**Testing Tools:**
- Jest for unit tests
- Supertest for API integration tests
- Manual security testing with curl/Postman

---

## Developer Implementation Checklist

### Phase 1: Install Dependencies (10 min)

- [x] **Step 1.1:** Install authentication packages
  ```bash
  cd packages/api
  pnpm add bcrypt jsonwebtoken
  pnpm add -D @types/bcrypt @types/jsonwebtoken
  ```

- [x] **Step 1.2:** Install validation packages
  ```bash
  pnpm add express-validator
  ```

- [x] **Step 1.3:** Install Express (if not already)
  ```bash
  pnpm add express cors dotenv
  pnpm add -D @types/express @types/cors
  ```

- [x] **Step 1.4:** Configure environment variables
  ```bash
  # packages/api/.env
  JWT_SECRET=your-super-secret-jwt-key-change-in-production
  JWT_EXPIRES_IN=7d
  BCRYPT_ROUNDS=10
  ```

- [ ] **Step 1.5:** Update .env.example
  ```bash
  # Add to root .env.example
  JWT_SECRET=change-this-to-random-string-in-production
  JWT_EXPIRES_IN=7d
  BCRYPT_ROUNDS=10
  ```

### Phase 2: Create Auth Utilities (30 min)

- [x] **Step 2.1:** Create password hashing utility
  ```typescript
  // packages/api/src/utils/password.ts
  import bcrypt from 'bcrypt';
  
  const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10');
  
  export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }
  
  export async function comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  ```

- [x] **Step 2.2:** Create JWT utility
  ```typescript
  // packages/api/src/utils/jwt.ts
  import jwt from 'jsonwebtoken';
  
  const JWT_SECRET = process.env.JWT_SECRET!;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  
  export interface TokenPayload {
    user_id: string;
    email: string;
    subscription_tier: string;
  }
  
  export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }
  
  export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  }
  ```

- [x] **Step 2.3:** Create validation schemas
  ```typescript
  // packages/api/src/validators/auth.ts
  import { body } from 'express-validator';
  
  export const registerValidator = [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage('Password must contain letters and numbers'),
  ];
  
  export const loginValidator = [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ];
  ```

- [x] **Step 2.4:** Create validation middleware
  ```typescript
  // packages/api/src/middleware/validate.ts
  import { Request, Response, NextFunction } from 'express';
  import { validationResult } from 'express-validator';
  
  export function validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }
    
    next();
  }
  ```

### Phase 3: Create Auth Service (45 min)

- [x] **Step 3.1:** Create user service
  ```typescript
  // packages/api/src/services/user.service.ts
  import { query } from '../db';
  import { hashPassword } from '../utils/password';
  import { User, SubscriptionTier } from '@ai-tracker/shared/types/database';
  
  export interface CreateUserDto {
    email: string;
    password: string;
  }
  
  export class UserService {
    async createUser(dto: CreateUserDto): Promise<User> {
      const { email, password } = dto;
      
      // Check if user exists
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Hash password
      const password_hash = await hashPassword(password);
      
      // Insert user
      const result = await query(
        `INSERT INTO users (email, password_hash, subscription_tier)
         VALUES ($1, $2, $3)
         RETURNING id, email, subscription_tier, created_at, updated_at`,
        [email, password_hash, SubscriptionTier.FREE]
      );
      
      return result.rows[0];
    }
    
    async findByEmail(email: string): Promise<User | null> {
      const result = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      return result.rows[0] || null;
    }
    
    async findById(id: string): Promise<User | null> {
      const result = await query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      
      return result.rows[0] || null;
    }
  }
  ```

- [x] **Step 3.2:** Create auth service
  ```typescript
  // packages/api/src/services/auth.service.ts
  import { UserService, CreateUserDto } from './user.service';
  import { comparePassword } from '../utils/password';
  import { generateToken, TokenPayload } from '../utils/jwt';
  import { User } from '@ai-tracker/shared/types/database';
  
  export interface AuthResponse {
    token: string;
    user: Omit<User, 'password_hash'>;
  }
  
  export class AuthService {
    private userService = new UserService();
    
    async register(dto: CreateUserDto): Promise<AuthResponse> {
      const user = await this.userService.createUser(dto);
      
      const token = generateToken({
        user_id: user.id,
        email: user.email,
        subscription_tier: user.subscription_tier,
      });
      
      // Remove password_hash from response
      const { password_hash, ...userWithoutPassword } = user;
      
      return {
        token,
        user: userWithoutPassword,
      };
    }
    
    async login(email: string, password: string): Promise<AuthResponse> {
      const user = await this.userService.findByEmail(email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const isValidPassword = await comparePassword(password, user.password_hash);
      
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }
      
      const token = generateToken({
        user_id: user.id,
        email: user.email,
        subscription_tier: user.subscription_tier,
      });
      
      const { password_hash, ...userWithoutPassword } = user;
      
      return {
        token,
        user: userWithoutPassword,
      };
    }
  }
  ```

### Phase 4: Create Auth Controllers (30 min)

- [x] **Step 4.1:** Create auth controller
  ```typescript
  // packages/api/src/controllers/auth.controller.ts
  import { Request, Response } from 'express';
  import { AuthService } from '../services/auth.service';
  
  const authService = new AuthService();
  
  export async function register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const result = await authService.register({ email, password });
      
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'User already exists') {
        return res.status(409).json({
          error: 'User already exists',
        });
      }
      
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Registration failed',
      });
    }
  }
  
  export async function login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const result = await authService.login(email, password);
      
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({
          error: 'Invalid credentials',
        });
      }
      
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
      });
    }
  }
  ```

### Phase 5: Create Authentication Middleware (30 min)

- [x] **Step 5.1:** Create auth middleware
  ```typescript
  // packages/api/src/middleware/auth.ts
  import { Request, Response, NextFunction } from 'express';
  import { verifyToken, TokenPayload } from '../utils/jwt';
  
  // Extend Express Request type
  declare global {
    namespace Express {
      interface Request {
        user?: TokenPayload;
      }
    }
  }
  
  export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'No token provided',
        });
      }
      
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Verify token
      const payload = verifyToken(token);
      
      // Attach user info to request
      req.user = payload;
      
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expired',
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token',
        });
      }
      
      console.error('Authentication error:', error);
      res.status(401).json({
        error: 'Authentication failed',
      });
    }
  }
  ```

- [ ] **Step 5.2:** Create optional auth middleware
  ```typescript
  // packages/api/src/middleware/auth.ts (add to same file)
  
  export function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // Continue without auth
      }
      
      const token = authHeader.substring(7);
      const payload = verifyToken(token);
      req.user = payload;
      
      next();
    } catch (error) {
      // Continue without auth if token invalid
      next();
    }
  }
  ```

### Phase 6: Create Auth Routes (20 min)

- [x] **Step 6.1:** Create auth routes
  ```typescript
  // packages/api/src/routes/auth.routes.ts
  import { Router } from 'express';
  import { register, login } from '../controllers/auth.controller';
  import { registerValidator, loginValidator } from '../validators/auth';
  import { validate } from '../middleware/validate';
  
  const router = Router();
  
  router.post('/register', registerValidator, validate, register);
  router.post('/login', loginValidator, validate, login);
  
  export default router;
  ```

- [ ] **Step 6.2:** Create test protected route
  ```typescript
  // packages/api/src/routes/test.routes.ts
  import { Router, Request, Response } from 'express';
  import { authenticate } from '../middleware/auth';
  
  const router = Router();
  
  router.get('/protected', authenticate, (req: Request, res: Response) => {
    res.json({
      message: 'Access granted',
      user: req.user,
    });
  });
  
  export default router;
  ```

### Phase 7: Setup Express App (30 min)

- [x] **Step 7.1:** Create Express app
  ```typescript
  // packages/api/src/app.ts
  import express from 'express';
  import cors from 'cors';
  import dotenv from 'dotenv';
  import authRoutes from './routes/auth.routes';
  import testRoutes from './routes/test.routes';
  
  dotenv.config();
  
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/test', testRoutes);
  
  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Internal server error',
    });
  });
  
  export default app;
  ```

- [x] **Step 7.2:** Create server entry point
  ```typescript
  // packages/api/src/index.ts
  import app from './app';
  
  const PORT = process.env.API_PORT || 3001;
  
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
  ```

- [x] **Step 7.3:** Update package.json scripts
  ```json
  // packages/api/package.json
  {
    "scripts": {
      "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
      "build": "tsc",
      "start": "node dist/index.js"
    }
  }
  ```

- [ ] **Step 7.4:** Install ts-node-dev
  ```bash
  cd packages/api
  pnpm add -D ts-node-dev
  ```

### Phase 8: Manual Testing (30 min)

- [ ] **Step 8.1:** Start the API server
  ```bash
  cd packages/api
  pnpm dev
  ```

- [ ] **Step 8.2:** Test registration
  ```bash
  curl -X POST http://localhost:3001/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Test1234"}'
  ```
  Expected: 201 status, token and user returned

- [ ] **Step 8.3:** Test duplicate registration
  ```bash
  curl -X POST http://localhost:3001/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Test1234"}'
  ```
  Expected: 409 status, "User already exists" error

- [ ] **Step 8.4:** Test login
  ```bash
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Test1234"}'
  ```
  Expected: 200 status, token returned

- [ ] **Step 8.5:** Test invalid login
  ```bash
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"WrongPassword"}'
  ```
  Expected: 401 status, "Invalid credentials"

- [ ] **Step 8.6:** Test protected route without token
  ```bash
  curl http://localhost:3001/api/test/protected
  ```
  Expected: 401 status, "No token provided"

- [ ] **Step 8.7:** Test protected route with token
  ```bash
  TOKEN="<paste token from login>"
  curl http://localhost:3001/api/test/protected \
    -H "Authorization: Bearer $TOKEN"
  ```
  Expected: 200 status, user info returned

### Phase 9: Unit and Integration Tests (90 min)

- [ ] **Step 9.1:** Install testing framework (Jest) and configure for API package

- [ ] **Step 9.2:** Write unit tests for password hashing utilities
  - Test bcrypt hash generation
  - Test password comparison (correct and incorrect passwords)
  - Test hash strength validation

- [ ] **Step 9.3:** Write unit tests for JWT utilities
  - Test token generation with valid payload
  - Test token verification with valid token
  - Test token verification with expired token
  - Test token verification with invalid signature

- [ ] **Step 9.4:** Write unit tests for auth service
  - Test user registration with valid data
  - Test registration with duplicate email (should throw error)
  - Test login with valid credentials
  - Test login with invalid credentials (should throw error)
  - Test password is not returned in user object

- [x] **Step 9.5:** Write integration tests for registration endpoint
  - Test POST /api/auth/register with valid data returns 201 and token
  - Test duplicate registration returns 409 error
  - Test invalid email format returns 400 error
  - Test weak password returns 400 error
  - Test missing fields return 400 error

- [x] **Step 9.6:** Write integration tests for login endpoint
  - Test POST /api/auth/login with valid credentials returns 200 and token
  - Test login with wrong password returns 401 error
  - Test login with non-existent user returns 401 error
  - Test login validates email format

- [ ] **Step 9.7:** Write integration tests for authentication middleware
  - Test protected route without token returns 401
  - Test protected route with invalid token returns 401
  - Test protected route with expired token returns 401
  - Test protected route with valid token allows access
  - Test user data attached to request object

- [ ] **Step 9.8:** Write integration tests for end-to-end auth flow
  - Test complete registration → login → access protected route flow
  - Test JWT token contains correct user claims
  - Test token expiration after 7 days
  - Test password stored as hash in database, not plain text

- [ ] **Step 9.9:** Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Generate coverage report
  - Verify all critical paths tested
  - Fix any failing tests

- [x] **Step 9.10:** Add test scripts to package.json
  - Add `test`, `test:watch`, and `test:coverage` scripts
  - Document test execution in README

---

## QA Verification Checklist

### ✅ Registration Endpoint Tests

- [ ] **QA-1.1:** Valid registration
  - POST to /api/auth/register with valid email and password
  - Returns 201 status code
  - Returns JWT token
  - Returns user object without password
  - User created in database

- [ ] **QA-1.2:** Email validation
  - Invalid email format: Returns 400
  - Missing email: Returns 400
  - Empty email: Returns 400

- [ ] **QA-1.3:** Password validation
  - Password < 8 characters: Returns 400
  - Password without letters: Returns 400
  - Password without numbers: Returns 400
  - Missing password: Returns 400

- [ ] **QA-1.4:** Duplicate email
  - Register same email twice: Returns 409
  - Error message: "User already exists"

- [ ] **QA-1.5:** Password security
  - Check database: password_hash stored, NOT plain password
  - password_hash starts with $2b$ (bcrypt)
  - Different passwords produce different hashes

### ✅ Login Endpoint Tests

- [ ] **QA-2.1:** Valid login
  - POST to /api/auth/login with correct credentials
  - Returns 200 status code
  - Returns JWT token
  - Returns user object without password

- [ ] **QA-2.2:** Invalid credentials
  - Wrong password: Returns 401
  - Wrong email: Returns 401
  - Non-existent user: Returns 401
  - Error message: "Invalid credentials" (same for both cases - security)

- [ ] **QA-2.3:** Input validation
  - Invalid email format: Returns 400
  - Missing email: Returns 400
  - Missing password: Returns 400

### ✅ JWT Token Tests

- [ ] **QA-3.1:** Token structure
  - Token is valid JWT format
  - Token contains user_id claim
  - Token contains email claim
  - Token contains subscription_tier claim

- [ ] **QA-3.2:** Token expiration
  - Decode token and check exp claim
  - Expiration is 7 days from issue
  - Expired token rejected by middleware

- [ ] **QA-3.3:** Token verification
  - Valid token accepted by protected routes
  - Invalid token rejected
  - Tampered token rejected
  - Missing token rejected

### ✅ Authentication Middleware Tests

- [ ] **QA-4.1:** Protected route access
  - Without token: Returns 401
  - With invalid token: Returns 401
  - With expired token: Returns 401
  - With valid token: Returns 200

- [ ] **QA-4.2:** Token format handling
  - Token without "Bearer " prefix: Returns 401
  - Token with extra spaces: Handled correctly
  - Token in wrong header: Returns 401

- [ ] **QA-4.3:** User context
  - Protected route has access to req.user
  - req.user contains correct user_id
  - req.user contains correct email
  - req.user contains correct subscription_tier

### ✅ Error Handling Tests

- [ ] **QA-5.1:** Error status codes
  - Validation errors: 400
  - Authentication failures: 401
  - Duplicate email: 409
  - Server errors: 500

- [ ] **QA-5.2:** Error messages
  - Validation errors include details
  - Auth errors don't leak sensitive info
  - Server errors generic for security

- [ ] **QA-5.3:** Error logging
  - Server errors logged to console
  - Sensitive data not logged
  - Error stack traces not exposed to client

### ✅ Security Tests

- [ ] **QA-6.1:** Password hashing
  - Passwords never stored in plain text
  - bcrypt used with appropriate salt rounds
  - Same password hashed twice produces different hashes

- [ ] **QA-6.2:** Password exposure
  - Registration response excludes password_hash
  - Login response excludes password_hash
  - API never returns password in any endpoint

- [ ] **QA-6.3:** JWT security
  - JWT_SECRET not exposed
  - JWT signed correctly
  - JWT verification catches tampering

- [ ] **QA-6.4:** SQL injection protection
  - Parameterized queries used
  - Test with: `'; DROP TABLE users; --`
  - Database not affected

### ✅ Integration Tests

- [ ] **QA-7.1:** Full registration flow
  1. Register new user
  2. Verify user in database
  3. Verify can login with credentials
  4. Verify token works on protected route

- [ ] **QA-7.2:** Full authentication flow
  1. Login with credentials
  2. Use token on protected route
  3. Verify user context available
  4. Verify multiple requests with same token work

- [ ] **QA-7.3:** Session persistence
  1. Login and get token
  2. Restart server
  3. Use same token
  4. Verify still works (token independent of server restart)

### ✅ Database Tests

- [ ] **QA-8.1:** User creation
  - User record created with correct fields
  - subscription_tier defaults to 'free'
  - created_at and updated_at populated
  - id is valid UUID

- [ ] **QA-8.2:** Email uniqueness
  - Unique constraint enforced at database level
  - Duplicate insert fails
  - Case sensitivity handled appropriately

### ✅ Performance Tests

- [ ] **QA-9.1:** Response times
  - Registration completes in < 500ms
  - Login completes in < 300ms
  - Token verification < 50ms

- [ ] **QA-9.2:** Concurrent requests
  - Multiple simultaneous registrations handled
  - Multiple simultaneous logins handled
  - No race conditions

---

## Technical Notes

### Why bcrypt?
- Industry standard for password hashing
- Slow by design (prevents brute force)
- Includes salt automatically
- Future-proof (can increase rounds as hardware improves)

### JWT vs Sessions
- JWT chosen for stateless authentication
- Works across multiple API instances
- No server-side session storage needed
- Easy to validate in middleware

### Security Considerations
- Passwords never logged
- Password hashes never in API responses
- Same error message for wrong email/password (prevents user enumeration)
- JWT secret must be strong and secret

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.1 - Project Setup](./story-1.1-project-setup-monorepo.md) - API package and tooling required
- [Story 1.2 - Database Schema](./story-1.2-database-schema-migrations.md) - Users table must exist

**Blocks (Stories Waiting on This):**
- [Story 1.4 - Tracking Pixel Service](./story-1.4-tracking-pixel-service.md) - Needs user context
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Requires authenticated users
- [Story 2.1 - Chrome Extension OAuth](./story-2.1-chrome-extension-scaffold.md) - Backend auth integration
- All Epic 2-10 stories requiring user authentication

**Related Stories (Helpful Context):**
- [Story 6.2 - User Profile Settings](./story-6.2-user-profile-settings.md) - Extends user management

---

## Definition of Done

- [x] All acceptance criteria met
- [ ] All developer implementation steps completed
- [ ] All QA verification steps pass
- [x] Registration and login endpoints working
- [x] JWT authentication middleware functional
- [ ] Manual testing completed successfully
- [x] No passwords exposed in API responses
- [x] Error handling comprehensive

---

## Rollback Plan

If issues arise:
1. Stop API server
2. Revert code changes via Git
3. Clear test users from database: `DELETE FROM users WHERE email LIKE '%test%'`
4. Restart development

---

## Future Improvements (Post-MVP)

- [ ] Add email verification flow
- [ ] Add password reset functionality
- [ ] Add rate limiting on auth endpoints
- [ ] Add refresh token mechanism
- [ ] Add social OAuth (Google, Microsoft)
- [ ] Add two-factor authentication (2FA)
- [ ] Add session management and revocation
- [ ] Add password strength meter on frontend

