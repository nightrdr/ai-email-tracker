# Story 1.2: Database Schema & Migrations

**Story ID:** STORY-1.2  
**Epic:** Epic 1 - Foundation & Core Tracking Infrastructure  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 5  
**Estimated Time:** 4-6 hours  
**Status:** Not Started

---

## User Story

**As a** developer  
**I want** the PostgreSQL database schema designed and migration system configured  
**So that** I can persist user data, tracking events, and application state reliably

---

## Business Value

The database is the foundation for all data persistence in the application. Proper schema design and migration management ensures:
- Data integrity and consistency
- Scalability for tracking millions of events
- Safe schema evolution as features are added
- Easy rollback if deployments fail

---

## Acceptance Criteria

### ✅ AC1: Database Provisioning
- [ ] PostgreSQL database provisioned for local development (Docker)
- [ ] Connection string configuration documented
- [ ] Database accessible from API package

### ✅ AC2: Migration Tool Configured
- [ ] Migration tool installed (node-pg-migrate, Prisma, or TypeORM)
- [ ] Migration commands configured in package.json
- [ ] Migrations tracked in version control

### ✅ AC3: Users Table
- [ ] Users table created with fields: id (UUID, PK), email (unique), password_hash, created_at, updated_at, subscription_tier
- [ ] Appropriate indexes on email field
- [ ] Timestamp fields auto-managed

### ✅ AC4: EmailAccounts Table
- [ ] EmailAccounts table created with fields: id (UUID, PK), user_id (FK to Users), provider (enum: gmail/outlook), oauth_tokens (encrypted text), email_address
- [ ] Foreign key constraint to Users table
- [ ] Index on user_id for fast lookups

### ✅ AC5: TrackedEmails Table
- [ ] TrackedEmails table created with fields: id (UUID, PK), user_id (FK), email_account_id (FK), recipient_email, subject, message_id, tracking_pixel_id (unique), sent_at
- [ ] Foreign key constraints properly configured
- [ ] Indexes on user_id, tracking_pixel_id, sent_at

### ✅ AC6: TrackingEvents Table
- [ ] TrackingEvents table created with fields: id (UUID, PK), tracked_email_id (FK), event_type (enum: open/click/download), timestamp, ip_address, user_agent, location
- [ ] Foreign key to TrackedEmails
- [ ] Index on tracked_email_id for fast event lookups
- [ ] Composite index on (tracked_email_id, timestamp) for timeline queries

### ✅ AC7: Database Indexes
- [ ] All foreign keys have indexes
- [ ] Frequently queried fields indexed appropriately
- [ ] Composite indexes for common query patterns

### ✅ AC8: Migration Execution
- [ ] Initial migration runs successfully on clean database
- [ ] Migration can be rolled back (down migration)
- [ ] Migration idempotent (safe to run multiple times)

---

## Requirements Traceability

**PRD Coverage:**
- **Foundational Story:** Enables data persistence for all tracking features (FR1-FR54)
- **NFR3:** GDPR-compliant data storage with retention policies
- **NFR6:** Handles 1M+ tracking events per month through proper indexing

**Architecture References:**
- Data Models: Users, EmailAccounts, TrackedEmails, TrackingEvents
- Database: PostgreSQL for relational data integrity
- Migration Strategy: Version-controlled schema changes

**Epic Context:**
This story establishes the database foundation required for all tracking, campaign, and user management features across the platform.

---

## Testing Strategy

**Test Approach:**
- **Schema Testing:** Verify all tables, indexes, and constraints created correctly
- **Migration Testing:** Test migration up/down, idempotency
- **Data Integrity Testing:** Test foreign key relationships and cascades

**Test Environment:**
- Local: Docker PostgreSQL container
- CI: Ephemeral test database per workflow run

**Success Metrics:**
- Migration runs without errors
- All constraints and indexes created
- Rollback works cleanly

**Testing Tools:**
- PostgreSQL client (psql) for manual verification
- Migration tool's built-in test commands
- SQL scripts for constraint testing

---

## Developer Implementation Checklist

### Phase 1: Database Setup with Docker (30 min)

- [ ] **Step 1.1:** Create docker-compose.yml in project root
  ```yaml
  version: '3.8'
  
  services:
    postgres:
      image: postgres:15-alpine
      container_name: ai-tracker-postgres
      environment:
        POSTGRES_USER: aitracker
        POSTGRES_PASSWORD: devpassword
        POSTGRES_DB: ai_tracker_dev
      ports:
        - '5432:5432'
      volumes:
        - postgres_data:/var/lib/postgresql/data
      healthcheck:
        test: ['CMD-SHELL', 'pg_isready -U aitracker']
        interval: 10s
        timeout: 5s
        retries: 5
  
  volumes:
    postgres_data:
  ```

- [ ] **Step 1.2:** Add Docker commands to root package.json
  ```json
  {
    "scripts": {
      "db:start": "docker-compose up -d postgres",
      "db:stop": "docker-compose down",
      "db:logs": "docker-compose logs -f postgres"
    }
  }
  ```

- [ ] **Step 1.3:** Start PostgreSQL
  ```bash
  pnpm db:start
  ```

- [ ] **Step 1.4:** Verify PostgreSQL is running
  ```bash
  docker ps | grep ai-tracker-postgres
  pnpm db:logs
  ```

- [ ] **Step 1.5:** Test connection
  ```bash
  # Using psql (install if needed)
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "SELECT version();"
  ```

### Phase 2: Install and Configure Migration Tool (30 min)

- [ ] **Step 2.1:** Install node-pg-migrate in API package
  ```bash
  cd packages/api
  pnpm add pg
  pnpm add -D node-pg-migrate @types/pg
  ```

- [ ] **Step 2.2:** Create migration configuration
  ```bash
  # packages/api/.migrate.json
  ```
  ```json
  {
    "migrations-table": "pgmigrations",
    "dir": "migrations",
    "schema": "public",
    "check-order": true,
    "migration-file-language": "ts"
  }
  ```

- [ ] **Step 2.3:** Create migrations directory
  ```bash
  mkdir packages/api/migrations
  ```

- [ ] **Step 2.4:** Add migration scripts to API package.json
  ```json
  {
    "scripts": {
      "migrate:create": "node-pg-migrate create -m",
      "migrate:up": "node-pg-migrate up",
      "migrate:down": "node-pg-migrate down",
      "migrate:redo": "node-pg-migrate redo"
    }
  }
  ```

- [ ] **Step 2.5:** Configure DATABASE_URL
  ```bash
  # packages/api/.env
  DATABASE_URL=postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev
  ```

- [ ] **Step 2.6:** Update .env.example
  ```bash
  # Root .env.example
  DATABASE_URL=postgresql://username:password@localhost:5432/ai_tracker_dev
  ```

### Phase 3: Create Initial Migration (60 min)

- [ ] **Step 3.1:** Create initial migration
  ```bash
  cd packages/api
  pnpm migrate:create initial-schema
  ```

- [ ] **Step 3.2:** Implement migration - Users table
  ```typescript
  // packages/api/migrations/XXXXXX_initial-schema.ts
  import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
  
  export const shorthands: ColumnDefinitions | undefined = undefined;
  
  export async function up(pgm: MigrationBuilder): Promise<void> {
    // Enable UUID extension
    pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create enum for subscription tiers
    pgm.createType('subscription_tier', ['free', 'individual', 'pro', 'business']);
    
    // Create Users table
    pgm.createTable('users', {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('uuid_generate_v4()'),
      },
      email: {
        type: 'varchar(255)',
        notNull: true,
        unique: true,
      },
      password_hash: {
        type: 'text',
        notNull: true,
      },
      subscription_tier: {
        type: 'subscription_tier',
        notNull: true,
        default: 'free',
      },
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
      updated_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
    });
    
    // Create index on email for faster lookups
    pgm.createIndex('users', 'email');
    
    // Create trigger to auto-update updated_at
    pgm.sql(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
      
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
  }
  
  export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('users', { cascade: true });
    pgm.dropType('subscription_tier');
    pgm.sql('DROP FUNCTION IF EXISTS update_updated_at_column CASCADE');
  }
  ```

- [ ] **Step 3.3:** Add EmailAccounts table to migration
  ```typescript
  // In same migration file, add to up() function:
  
  // Create enum for email providers
  pgm.createType('email_provider', ['gmail', 'outlook']);
  
  // Create EmailAccounts table
  pgm.createTable('email_accounts', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    provider: {
      type: 'email_provider',
      notNull: true,
    },
    oauth_tokens: {
      type: 'text',
      notNull: true,
      comment: 'Encrypted OAuth tokens',
    },
    email_address: {
      type: 'varchar(255)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  
  // Create indexes
  pgm.createIndex('email_accounts', 'user_id');
  pgm.createIndex('email_accounts', ['user_id', 'email_address']);
  
  // Add to down() function:
  pgm.dropTable('email_accounts', { cascade: true });
  pgm.dropType('email_provider');
  ```

- [ ] **Step 3.4:** Add TrackedEmails table to migration
  ```typescript
  // In same migration file, add to up() function:
  
  // Create TrackedEmails table
  pgm.createTable('tracked_emails', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    email_account_id: {
      type: 'uuid',
      notNull: true,
      references: 'email_accounts',
      onDelete: 'CASCADE',
    },
    recipient_email: {
      type: 'varchar(255)',
      notNull: true,
    },
    subject: {
      type: 'text',
      notNull: true,
    },
    message_id: {
      type: 'varchar(255)',
      comment: 'Email Message-ID header',
    },
    tracking_pixel_id: {
      type: 'uuid',
      notNull: true,
      unique: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    sent_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  
  // Create indexes
  pgm.createIndex('tracked_emails', 'user_id');
  pgm.createIndex('tracked_emails', 'tracking_pixel_id');
  pgm.createIndex('tracked_emails', 'sent_at');
  pgm.createIndex('tracked_emails', ['user_id', 'sent_at']);
  
  // Add to down() function:
  pgm.dropTable('tracked_emails', { cascade: true });
  ```

- [ ] **Step 3.5:** Add TrackingEvents table to migration
  ```typescript
  // In same migration file, add to up() function:
  
  // Create enum for event types
  pgm.createType('event_type', ['open', 'click', 'download']);
  
  // Create TrackingEvents table
  pgm.createTable('tracking_events', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    tracked_email_id: {
      type: 'uuid',
      notNull: true,
      references: 'tracked_emails',
      onDelete: 'CASCADE',
    },
    event_type: {
      type: 'event_type',
      notNull: true,
    },
    timestamp: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    ip_address: {
      type: 'inet',
    },
    user_agent: {
      type: 'text',
    },
    location: {
      type: 'varchar(255)',
      comment: 'City-level location from GeoIP',
    },
  });
  
  // Create indexes
  pgm.createIndex('tracking_events', 'tracked_email_id');
  pgm.createIndex('tracking_events', ['tracked_email_id', 'timestamp']);
  pgm.createIndex('tracking_events', 'timestamp');
  
  // Add to down() function:
  pgm.dropTable('tracking_events', { cascade: true });
  pgm.dropType('event_type');
  ```

### Phase 4: Run and Verify Migration (30 min)

- [ ] **Step 4.1:** Run migration
  ```bash
  cd packages/api
  pnpm migrate:up
  ```

- [ ] **Step 4.2:** Verify tables created
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev \
    -c "\dt"
  ```
  Expected output:
  ```
  users
  email_accounts
  tracked_emails
  tracking_events
  pgmigrations
  ```

- [ ] **Step 4.3:** Verify table schemas
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev \
    -c "\d users"
  ```
  Verify all columns present

- [ ] **Step 4.4:** Verify indexes
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev \
    -c "\di"
  ```

- [ ] **Step 4.5:** Test rollback
  ```bash
  pnpm migrate:down
  ```
  Verify tables dropped

- [ ] **Step 4.6:** Re-run migration
  ```bash
  pnpm migrate:up
  ```
  Verify migration idempotent

### Phase 5: Create Database Client (30 min)

- [ ] **Step 5.1:** Create database connection module
  ```typescript
  // packages/api/src/db/index.ts
  import { Pool } from 'pg';
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
  
  export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
  };
  
  export const getClient = () => {
    return pool.connect();
  };
  
  export default pool;
  ```

- [ ] **Step 5.2:** Create database types
  ```typescript
  // packages/shared/src/types/database.ts
  export enum SubscriptionTier {
    FREE = 'free',
    INDIVIDUAL = 'individual',
    PRO = 'pro',
    BUSINESS = 'business',
  }
  
  export enum EmailProvider {
    GMAIL = 'gmail',
    OUTLOOK = 'outlook',
  }
  
  export enum EventType {
    OPEN = 'open',
    CLICK = 'click',
    DOWNLOAD = 'download',
  }
  
  export interface User {
    id: string;
    email: string;
    password_hash: string;
    subscription_tier: SubscriptionTier;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface EmailAccount {
    id: string;
    user_id: string;
    provider: EmailProvider;
    oauth_tokens: string; // encrypted
    email_address: string;
    created_at: Date;
  }
  
  export interface TrackedEmail {
    id: string;
    user_id: string;
    email_account_id: string;
    recipient_email: string;
    subject: string;
    message_id: string | null;
    tracking_pixel_id: string;
    sent_at: Date;
  }
  
  export interface TrackingEvent {
    id: string;
    tracked_email_id: string;
    event_type: EventType;
    timestamp: Date;
    ip_address: string | null;
    user_agent: string | null;
    location: string | null;
  }
  ```

- [ ] **Step 5.3:** Create simple health check query
  ```typescript
  // packages/api/src/health.ts
  import { query } from './db';
  
  export async function checkDatabaseHealth(): Promise<boolean> {
    try {
      const result = await query('SELECT NOW()');
      return result.rows.length > 0;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
  ```

- [ ] **Step 5.4:** Test database connection
  ```typescript
  // packages/api/src/index.ts (or test file)
  import { checkDatabaseHealth } from './health';
  
  async function testConnection() {
    const healthy = await checkDatabaseHealth();
    console.log('Database healthy:', healthy);
  }
  
  testConnection();
  ```

### Phase 6: Documentation (15 min)

- [ ] **Step 6.1:** Document database setup in README
  ```markdown
  ## Database Setup
  
  ### Start PostgreSQL
  ```bash
  pnpm db:start
  ```
  
  ### Run Migrations
  ```bash
  cd packages/api
  pnpm migrate:up
  ```
  
  ### Rollback Last Migration
  ```bash
  pnpm migrate:down
  ```
  
  ### Create New Migration
  ```bash
  pnpm migrate:create migration-name
  ```
  
  ### Database Access
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev
  ```
  ```

- [ ] **Step 6.2:** Create database schema diagram (ASCII or link to tool)
  ```
  users
    |
    |-- email_accounts
    |     |
    |     |-- tracked_emails
    |           |
    |           |-- tracking_events
  ```

- [ ] **Step 6.3:** Document migration workflow
  - When to create migrations
  - How to write reversible migrations
  - Testing migration up/down
  - Production deployment process

---

## QA Verification Checklist

### ✅ Database Setup Verification

- [ ] **QA-1.1:** Start PostgreSQL with Docker
  ```bash
  pnpm db:start
  ```
  - Container starts without errors
  - Health check passes
  - Logs show "database system is ready to accept connections"

- [ ] **QA-1.2:** Verify PostgreSQL connection
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "SELECT version();"
  ```
  - Connection succeeds
  - PostgreSQL version displayed

- [ ] **QA-1.3:** Verify database created
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "\l"
  ```
  - Database `ai_tracker_dev` listed

### ✅ Migration Tool Verification

- [ ] **QA-2.1:** Verify migration commands exist
  ```bash
  cd packages/api
  pnpm migrate:up --help
  ```
  - Command runs without error
  - Help text displayed

- [ ] **QA-2.2:** Verify migration configuration
  - `.migrate.json` file exists in packages/api
  - Configuration is valid JSON
  - Points to correct migrations directory

### ✅ Schema Creation Verification

- [ ] **QA-3.1:** Run migration
  ```bash
  cd packages/api
  pnpm migrate:up
  ```
  - Migration completes successfully
  - No errors in output
  - Success message displayed

- [ ] **QA-3.2:** Verify all tables created
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "\dt"
  ```
  Expected tables:
  ```
  ✓ users
  ✓ email_accounts
  ✓ tracked_emails
  ✓ tracking_events
  ✓ pgmigrations
  ```

- [ ] **QA-3.3:** Verify Users table schema
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "\d users"
  ```
  Verify columns:
  ```
  ✓ id (uuid, primary key)
  ✓ email (varchar(255), unique, not null)
  ✓ password_hash (text, not null)
  ✓ subscription_tier (subscription_tier enum, not null, default 'free')
  ✓ created_at (timestamp, not null, default current_timestamp)
  ✓ updated_at (timestamp, not null, default current_timestamp)
  ```

- [ ] **QA-3.4:** Verify EmailAccounts table schema
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "\d email_accounts"
  ```
  Verify columns and foreign key to users

- [ ] **QA-3.5:** Verify TrackedEmails table schema
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "\d tracked_emails"
  ```
  Verify columns and foreign keys

- [ ] **QA-3.6:** Verify TrackingEvents table schema
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "\d tracking_events"
  ```
  Verify columns and foreign key

### ✅ Index Verification

- [ ] **QA-4.1:** List all indexes
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "\di"
  ```
  Verify indexes exist on:
  ```
  ✓ users.email
  ✓ email_accounts.user_id
  ✓ tracked_emails.user_id
  ✓ tracked_emails.tracking_pixel_id (unique)
  ✓ tracked_emails.sent_at
  ✓ tracking_events.tracked_email_id
  ✓ tracking_events.timestamp
  ```

- [ ] **QA-4.2:** Verify composite indexes
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "
    SELECT indexname, indexdef 
    FROM pg_indexes 
    WHERE schemaname = 'public' 
    ORDER BY indexname;
  "
  ```
  - Composite index on (tracked_email_id, timestamp) exists in tracking_events

### ✅ Data Integrity Verification

- [ ] **QA-5.1:** Test inserting a user
  ```sql
  INSERT INTO users (email, password_hash) 
  VALUES ('test@example.com', 'hash123');
  ```
  - Insert succeeds
  - created_at and updated_at populated automatically
  - id generated as UUID

- [ ] **QA-5.2:** Test email uniqueness constraint
  ```sql
  INSERT INTO users (email, password_hash) 
  VALUES ('test@example.com', 'hash456');
  ```
  - Insert fails with unique constraint violation
  - Error message clear

- [ ] **QA-5.3:** Test foreign key constraint
  ```sql
  INSERT INTO email_accounts (user_id, provider, oauth_tokens, email_address) 
  VALUES ('00000000-0000-0000-0000-000000000000', 'gmail', 'encrypted', 'test@gmail.com');
  ```
  - Insert fails with foreign key violation
  - Non-existent user_id rejected

- [ ] **QA-5.4:** Test cascade delete
  ```sql
  -- Insert user
  INSERT INTO users (id, email, password_hash) 
  VALUES ('11111111-1111-1111-1111-111111111111', 'delete@test.com', 'hash');
  
  -- Insert email account
  INSERT INTO email_accounts (user_id, provider, oauth_tokens, email_address) 
  VALUES ('11111111-1111-1111-1111-111111111111', 'gmail', 'encrypted', 'delete@gmail.com');
  
  -- Delete user
  DELETE FROM users WHERE id = '11111111-1111-1111-1111-111111111111';
  
  -- Check email_accounts
  SELECT * FROM email_accounts WHERE user_id = '11111111-1111-1111-1111-111111111111';
  ```
  - Email account deleted automatically (cascade)
  - No orphaned records

- [ ] **QA-5.5:** Test updated_at trigger
  ```sql
  -- Insert user
  INSERT INTO users (id, email, password_hash) 
  VALUES ('22222222-2222-2222-2222-222222222222', 'update@test.com', 'hash');
  
  -- Wait a second
  SELECT pg_sleep(1);
  
  -- Update user
  UPDATE users 
  SET subscription_tier = 'pro' 
  WHERE id = '22222222-2222-2222-2222-222222222222';
  
  -- Check timestamps
  SELECT created_at, updated_at, updated_at > created_at as updated_changed
  FROM users 
  WHERE id = '22222222-2222-2222-2222-222222222222';
  ```
  - updated_at is later than created_at
  - Trigger working correctly

- [ ] **QA-5.6:** Clean up test data
  ```sql
  DELETE FROM users WHERE email LIKE '%test.com';
  ```

### ✅ Migration Rollback Verification

- [ ] **QA-6.1:** Test down migration
  ```bash
  cd packages/api
  pnpm migrate:down
  ```
  - Migration rolls back successfully
  - Tables dropped

- [ ] **QA-6.2:** Verify tables dropped
  ```bash
  psql postgresql://aitracker:devpassword@localhost:5432/ai_tracker_dev -c "\dt"
  ```
  - Users, email_accounts, tracked_emails, tracking_events tables gone
  - Only pgmigrations table remains

- [ ] **QA-6.3:** Re-run migration
  ```bash
  pnpm migrate:up
  ```
  - Migration runs successfully again
  - All tables recreated
  - Migration is idempotent

### ✅ Database Client Verification

- [ ] **QA-7.1:** Test database connection module
  ```typescript
  // Create test file
  import { query } from './db';
  
  query('SELECT NOW()').then(result => {
    console.log('Connection test:', result.rows[0]);
  });
  ```
  - Connection succeeds
  - Query returns result
  - No errors

- [ ] **QA-7.2:** Test health check function
  ```typescript
  import { checkDatabaseHealth } from './health';
  
  checkDatabaseHealth().then(healthy => {
    console.log('Database healthy:', healthy);
  });
  ```
  - Returns true
  - No errors

- [ ] **QA-7.3:** Test with invalid connection
  - Stop PostgreSQL
  - Run health check
  - Should return false or handle error gracefully

### ✅ Type Definitions Verification

- [ ] **QA-8.1:** Verify types file exists
  - `packages/shared/src/types/database.ts` exists
  - Contains all enum definitions
  - Contains all interface definitions

- [ ] **QA-8.2:** Test type imports
  ```typescript
  import { User, EventType } from '@ai-tracker/shared/types/database';
  
  const user: User = {
    id: '123',
    email: 'test@test.com',
    password_hash: 'hash',
    subscription_tier: SubscriptionTier.FREE,
    created_at: new Date(),
    updated_at: new Date(),
  };
  ```
  - Imports work correctly
  - Types match database schema

### ✅ Documentation Verification

- [ ] **QA-9.1:** Verify README updated
  - Database setup section exists
  - Commands documented
  - Connection string format shown

- [ ] **QA-9.2:** Follow setup instructions
  - Start from stopped database
  - Follow README step-by-step
  - All commands work as documented

- [ ] **QA-9.3:** Verify .env.example updated
  - DATABASE_URL variable documented
  - Example format correct

### ✅ Performance Verification

- [ ] **QA-10.1:** Test query performance
  ```sql
  -- Insert 1000 test emails
  INSERT INTO users (email, password_hash) VALUES ('perf@test.com', 'hash');
  
  -- Get user id
  -- Insert many tracked_emails and tracking_events
  
  -- Test indexed query
  EXPLAIN ANALYZE 
  SELECT * FROM tracked_emails WHERE user_id = 'xxx';
  
  -- Test non-indexed query
  EXPLAIN ANALYZE 
  SELECT * FROM tracked_emails WHERE subject LIKE '%test%';
  ```
  - Indexed queries use index scan
  - Non-indexed queries use seq scan (expected)

---

## Technical Notes

### Why PostgreSQL?
- ACID compliance ensures data integrity
- Excellent JSON support for flexible fields
- Robust indexing for query performance
- Well-supported in Node.js ecosystem

### Migration Strategy
- All schema changes via migrations (never manual ALTER)
- Migrations are reversible (up/down)
- Migrations tracked in pgmigrations table
- Idempotent migrations safe to re-run

### Index Strategy
- Foreign keys always indexed
- Frequently queried fields indexed
- Composite indexes for common query patterns
- Balance between read performance and write overhead

### Security Considerations
- OAuth tokens encrypted before storage
- Password hashes only (never plain passwords)
- Parameterized queries prevent SQL injection
- Connection string in environment variable

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.1 - Project Setup](./story-1.1-project-setup-monorepo.md) - Monorepo and API package must exist

**Blocks (Stories Waiting on This):**
- [Story 1.3 - User Authentication](./story-1.3-user-authentication-registration.md) - Requires Users table
- [Story 1.4 - Tracking Pixel Service](./story-1.4-tracking-pixel-service.md) - Requires TrackedEmails and TrackingEvents tables
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Requires all tables
- All Epic 2-10 stories requiring data persistence

**Related Stories (Helpful Context):**
- None - This is a foundational database story

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All developer implementation steps completed
- [ ] All QA verification steps pass
- [ ] Migration runs successfully on clean database
- [ ] Migration can be rolled back
- [ ] Database client module works
- [ ] Types defined and importable
- [ ] Documentation complete
- [ ] Test data cleaned up

---

## Rollback Plan

If issues arise:
1. Run `pnpm migrate:down` to rollback schema
2. Stop PostgreSQL: `pnpm db:stop`
3. Remove Docker volume: `docker volume rm ai-email-tracker_postgres_data`
4. Restart and re-run migrations

---

## Future Improvements (Post-MVP)

- [ ] Add database seeding for development
- [ ] Add database backup/restore scripts
- [ ] Implement connection pooling optimization
- [ ] Add query performance monitoring
- [ ] Create database E2E tests
- [ ] Add read replicas for scaling
- [ ] Implement partitioning for tracking_events table (if high volume)

