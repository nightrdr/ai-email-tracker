import { randomUUID } from 'node:crypto';

import { query } from '../../src/db';
import { checkDatabaseHealth } from '../../src/health';
import { resetTestDatabase } from '../utils/test-db';

jest.setTimeout(60_000);

beforeAll(async () => {
  await resetTestDatabase();
});

beforeEach(async () => {
  await resetTestDatabase();
});

describe('Database schema & migrations', () => {
  it('reports healthy status after migrations run', async () => {
    await expect(checkDatabaseHealth()).resolves.toBe(true);
  });

  it('persists related entities across users, email accounts, tracked emails, and tracking events', async () => {
    const userEmail = `integration-${randomUUID()}@example.com`;
    const user = await query<{ id: string; subscription_tier: string }>(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, subscription_tier`,
      [userEmail, 'hash']
    );
    expect(user.rows[0].subscription_tier).toBe('free');

    const emailAccount = await query<{ id: string }>(
      `INSERT INTO email_accounts (user_id, provider, oauth_tokens, email_address)
       VALUES ($1, 'gmail', 'secret', $2) RETURNING id`,
      [user.rows[0].id, userEmail]
    );

    const trackedEmail = await query<{ id: string; tracking_pixel_id: string }>(
      `INSERT INTO tracked_emails (user_id, email_account_id, recipient_email, subject, message_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, tracking_pixel_id`,
      [user.rows[0].id, emailAccount.rows[0].id, 'recipient@example.com', 'Hello', 'message-id']
    );
    expect(trackedEmail.rows[0].tracking_pixel_id).toBeTruthy();

    const trackingEvent = await query<{ event_type: string }>(
      `INSERT INTO tracking_events (tracked_email_id, event_type, ip_address)
       VALUES ($1, 'open', '127.0.0.1') RETURNING event_type`,
      [trackedEmail.rows[0].id]
    );
    expect(trackingEvent.rows[0].event_type).toBe('open');

    await query('DELETE FROM users WHERE id = $1', [user.rows[0].id]);

    const orphanedAccounts = await query('SELECT 1 FROM email_accounts WHERE id = $1', [emailAccount.rows[0].id]);
    expect(orphanedAccounts.rowCount).toBe(0);
    const orphanedEmails = await query('SELECT 1 FROM tracked_emails WHERE id = $1', [trackedEmail.rows[0].id]);
    expect(orphanedEmails.rowCount).toBe(0);
  });

  it('enforces unique email constraint on users', async () => {
    const duplicateEmail = `duplicate-${randomUUID()}@example.com`;
    await query(`INSERT INTO users (email, password_hash) VALUES ($1, $2)`, [duplicateEmail, 'hash']);

    await expect(
      query(`INSERT INTO users (email, password_hash) VALUES ($1, $2)`, [duplicateEmail, 'another-hash'])
    ).rejects.toThrow();
  });
});

