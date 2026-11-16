/** M04-I2 | KODE DITULIS, BELUM DIUJI. SQL for isolated synthetic SQLite only. */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS workspace_current (
 id INTEGER PRIMARY KEY CHECK(id=1),
 revision INTEGER NOT NULL CHECK(revision>=0),
 payload TEXT NOT NULL CHECK(json_valid(payload))
) STRICT;
CREATE TABLE IF NOT EXISTS workspace_versions (
 revision INTEGER PRIMARY KEY CHECK(revision>=0),
 payload TEXT NOT NULL CHECK(json_valid(payload)),
 recorded_at TEXT NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS workspace_events (
 revision INTEGER PRIMARY KEY REFERENCES workspace_versions(revision),
 actor_id TEXT NOT NULL,
 actor_role TEXT NOT NULL,
 facility_id TEXT NOT NULL,
 action TEXT NOT NULL,
 outcome TEXT NOT NULL,
 recorded_at TEXT NOT NULL,
 correction_id TEXT
) STRICT;
CREATE TABLE IF NOT EXISTS workspace_commands (
 request_id TEXT PRIMARY KEY,
 actor_id TEXT NOT NULL,
 command_json TEXT NOT NULL CHECK(json_valid(command_json)),
 revision INTEGER NOT NULL UNIQUE REFERENCES workspace_events(revision),
 response_json TEXT NOT NULL CHECK(json_valid(response_json))
) STRICT;
CREATE INDEX IF NOT EXISTS events_facility_revision
 ON workspace_events(facility_id, revision);
CREATE TRIGGER IF NOT EXISTS versions_no_update BEFORE UPDATE ON workspace_versions
 BEGIN SELECT RAISE(ABORT,'append-only'); END;
CREATE TRIGGER IF NOT EXISTS versions_no_delete BEFORE DELETE ON workspace_versions
 BEGIN SELECT RAISE(ABORT,'append-only'); END;
CREATE TRIGGER IF NOT EXISTS events_no_update BEFORE UPDATE ON workspace_events
 BEGIN SELECT RAISE(ABORT,'append-only'); END;
CREATE TRIGGER IF NOT EXISTS events_no_delete BEFORE DELETE ON workspace_events
 BEGIN SELECT RAISE(ABORT,'append-only'); END;
CREATE TRIGGER IF NOT EXISTS commands_no_update BEFORE UPDATE ON workspace_commands
 BEGIN SELECT RAISE(ABORT,'append-only'); END;
CREATE TRIGGER IF NOT EXISTS commands_no_delete BEFORE DELETE ON workspace_commands
 BEGIN SELECT RAISE(ABORT,'append-only'); END;
`;
