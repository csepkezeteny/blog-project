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

-- Minta adatok
INSERT INTO posts (title, content, author) VALUES
    ('Üdvözlünk a Blog Platformon!',
     'Ez az első bejegyzés. A blog platformon bejegyzéseket olvashatsz és kommentelhetsz.',
     'Admin'),
    ('Node.js és Express alapok',
     'A Node.js egy szerver oldali JavaScript futtatókörnyezet. Az Express.js egy minimális, rugalmas Node.js webes keretrendszer.',
     'Fejlesztő');

INSERT INTO comments (post_id, content, author) VALUES
    (1, 'Szuper platform, gratulálok!', 'Látogató'),
    (1, 'Várom az újabb bejegyzéseket!', 'Olvasó');
