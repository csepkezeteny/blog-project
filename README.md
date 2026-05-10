# Blog Platform

Egyszerű blogplatform, ahol felhasználók bejegyzéseket olvashatnak és kommentelhetnek.

## Technológiai stack

- **Backend**: Node.js, Express, TypeScript, Drizzle ORM, SQLite
- **Frontend**: React, TypeScript, Vite
- **Konténerizáció**: Docker, Docker Compose

## Alkalmazás felépítése

```
blog-project/
├── backend/              # Node.js + Express backend
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts     # Drizzle ORM séma
│   │   │   └── index.ts      # Adatbázis kapcsolat
│   │   ├── routes/
│   │   │   └── posts.ts      # API végpontok
│   │   ├── __tests__/
│   │   │   └── posts.test.ts # Integrációs tesztek
│   │   ├── app.ts            # Express app
│   │   └── index.ts          # Belépési pont
│   ├── Dockerfile
│   └── package.json
├── frontend/             # React + TypeScript frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts     # API kliens
│   │   ├── pages/
│   │   │   ├── PostList.tsx  # Bejegyzések listája
│   │   │   └── PostDetail.tsx # Bejegyzés részletei
│   │   ├── App.tsx           # Routing
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
├── sql/
│   └── init.sql          # Adatbázis inicializáló script
├── docker-compose.yml
└── README.md
```

## Konfigurálás és telepítés

### Előfeltételek
- Node.js 20+
- npm 10+
- Docker és Docker Compose (opcionális)

### Fejlesztői indítás

**Backend:**
```bash
cd backend
npm install
npm run dev
# Fut: http://localhost:3001
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Fut: http://localhost:5173
```

### Docker Compose

Az egész alkalmazás egyetlen paranccsal indítható:

```bash
docker-compose up --build
```

- Frontend: http://localhost:80
- Backend API: http://localhost:3001

### Tesztek futtatása

```bash
cd backend
npm test
```

## API végpontok

### GET /api/posts
Visszaadja az összes bejegyzést.

**Válasz:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Első bejegyzés",
    "content": "Tartalom...",
    "author": "Szerző",
    "created_at": "2024-01-01T10:00:00"
  }
]
```

### GET /api/posts/:id
Visszaad egy bejegyzést a kommentjeivel együtt.

**Paraméterek:** `id` - a bejegyzés azonosítója

**Válasz:** `200 OK`
```json
{
  "id": 1,
  "title": "Bejegyzés",
  "content": "Tartalom...",
  "author": "Szerző",
  "created_at": "2024-01-01T10:00:00",
  "comments": [
    {
      "id": 1,
      "post_id": 1,
      "author": "Kommentelő",
      "content": "Komment szövege",
      "created_at": "2024-01-01T11:00:00"
    }
  ]
}
```

**Hibák:**
- `400 Bad Request` – érvénytelen azonosító
- `404 Not Found` – bejegyzés nem található

### POST /api/posts
Új bejegyzés létrehozása.

**Kérés törzse:**
```json
{
  "title": "Cím (kötelező)",
  "content": "Tartalom (kötelező)",
  "author": "Szerző neve (opcionális)"
}
```

**Válasz:** `201 Created`

**Hibák:**
- `400 Bad Request` – hiányzó cím vagy tartalom

### POST /api/posts/:id/comments
Komment hozzáadása egy bejegyzéshez.

**Kérés törzse:**
```json
{
  "content": "Komment szövege (kötelező)",
  "author": "Kommentelő neve (opcionális)"
}
```

**Válasz:** `201 Created`

**Hibák:**
- `400 Bad Request` – hiányzó tartalom
- `404 Not Found` – bejegyzés nem található

## Adatbázis

SQLite adatbázis, Drizzle ORM-mel kezelve.

### Táblák

**posts**
| Oszlop | Típus | Leírás |
|--------|-------|--------|
| id | INTEGER PK | Automatikus azonosító |
| title | TEXT NOT NULL | Bejegyzés címe |
| content | TEXT NOT NULL | Bejegyzés tartalma |
| author | TEXT | Szerző neve |
| created_at | TEXT | Létrehozás időpontja |

**comments**
| Oszlop | Típus | Leírás |
|--------|-------|--------|
| id | INTEGER PK | Automatikus azonosító |
| post_id | INTEGER FK | Kapcsolódó bejegyzés |
| author | TEXT | Kommentelő neve |
| content | TEXT NOT NULL | Komment szövege |
| created_at | TEXT | Létrehozás időpontja |

## Kiegészítő funkciók

### Docker konténerizáció
Az alkalmazás Docker konténerekben fut. A `docker-compose.yml` definiálja a `backend` és `frontend` szolgáltatásokat, valamint az adatbázis adatainak perzisztens tárolását (`db-data` volume).

### Drizzle ORM
A backend Drizzle ORM-et használ az adatbázis-kezeléshez. A séma a `backend/src/db/schema.ts` fájlban van definiálva, type-safe lekérdezésekkel.
