import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  pgm.createType('subscription_tier', ['free', 'individual', 'pro', 'business']);
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
  pgm.createIndex('users', 'email');
  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE 'plpgsql';
  `);
  pgm.createTrigger('users', 'update_users_updated_at', {
    when: 'BEFORE',
    operation: 'UPDATE',
    level: 'ROW',
    function: 'update_updated_at_column',
  });

  pgm.createType('email_provider', ['gmail', 'outlook']);
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
  pgm.createIndex('email_accounts', 'user_id');
  pgm.createIndex('email_accounts', ['user_id', 'email_address']);

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
      notNull: false,
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
  pgm.createIndex('tracked_emails', 'user_id');
  pgm.createIndex('tracked_emails', 'email_account_id');
  pgm.createIndex('tracked_emails', 'tracking_pixel_id');
  pgm.createIndex('tracked_emails', 'sent_at');
  pgm.createIndex('tracked_emails', ['user_id', 'sent_at']);

  pgm.createType('event_type', ['open', 'click', 'download']);
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
  pgm.createIndex('tracking_events', 'tracked_email_id');
  pgm.createIndex('tracking_events', ['tracked_email_id', 'timestamp']);
  pgm.createIndex('tracking_events', 'timestamp');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('tracking_events', { cascade: true });
  pgm.dropType('event_type');

  pgm.dropTable('tracked_emails', { cascade: true });

  pgm.dropTable('email_accounts', { cascade: true });
  pgm.dropType('email_provider');

  pgm.dropTrigger('users', 'update_users_updated_at', { ifExists: true });
  pgm.dropTable('users', { cascade: true });
  pgm.dropType('subscription_tier');
  pgm.sql('DROP FUNCTION IF EXISTS update_updated_at_column CASCADE');
}

