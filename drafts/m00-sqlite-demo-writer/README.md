M00-G7 | SQLite transactional DEMO writer, CODE ONLY, UNTESTED.

writer.py can create an isolated in-memory SQLite store if invoked in a future permitted testing session. It rejects file-backed/attached DB connections, unknown roles, production IDs, real source data and official approvals. append_demo_review uses BEGIN IMMEDIATE, compares revision and head, appends synthetic event + command idempotency + stream head within one transaction and rolls back on failures. SQL triggers prevent ordinary event update/delete in the DEMO connection. This does not provide official authentication, tamper-proof logging, secure storage, source validity, real Flask integration or production writes.

25 QA written in tests/test_writer.py, 0 executed. No SQLite connection opened or SQL executed in this chat. See docs/M00_G7_SQLITE_INMEMORY_TRANSACTION_2026_2030.md.
