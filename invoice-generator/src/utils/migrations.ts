// Schema migration system for localStorage data
// Add migrations here when data schema changes

interface Migration {
  version: number;
  migrate: (data: unknown) => unknown;
}

const migrations: Migration[] = [
  // Example: { version: 2, migrate: (data) => { ... } }
];

export const runMigrations = (data: unknown, currentVersion: number): unknown => {
  let result = data;
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      result = migration.migrate(result);
    }
  }
  return result;
};
