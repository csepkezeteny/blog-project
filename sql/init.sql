-- Blog Platform - Adatbázis inicializáló script
-- SQLite kompatibilis

CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    content     TEXT    NOT NULL,
    author      TEXT    NOT NULL DEFAULT 'Névtelen',
    created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author      TEXT    NOT NULL DEFAULT 'Névtelen',
    content     TEXT    NOT NULL,
    created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
);
