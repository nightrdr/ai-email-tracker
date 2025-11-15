declare module 'node-pg-migrate' {
  type MigrationDirection = 'up' | 'down' | 'redo';

  export type MigrationBuilder = {
    sql: (statement: string) => void;
    func: (expression: string) => string;
    createType: (typeName: string, values: string[]) => void;
    dropType: (typeName: string) => void;
    createTable: (tableName: string, columns: Record<string, unknown>) => void;
    dropTable: (tableName: string, options?: Record<string, unknown>) => void;
    createIndex: (tableName: string, columns: string | string[], options?: Record<string, unknown>) => void;
    createTrigger: (
      tableName: string,
      triggerName: string,
      options: Record<string, unknown>
    ) => void;
    dropTrigger: (tableName: string, triggerName: string, options?: Record<string, unknown>) => void;
  };

  export interface RunnerOptions {
    databaseUrl: string;
    dir: string | string[];
    direction: MigrationDirection;
    migrationsTable?: string;
    schema?: string | string[];
    checkOrder?: boolean;
    createSchema?: boolean;
  }

  export function runner(options: RunnerOptions): Promise<unknown>;
}

