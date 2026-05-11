# Blog Platform

Egyszerű blogplatform, ahol felhasználók bejegyzéseket olvashatnak és kommentelhetnek.

## Tartalomjegyzék
 
- [Technológiai stack](#technológiai-stack)
- [Alkalmazás felépítése](#alkalmazás-felépítése)
- [Telepítés és konfiguráció](#telepítés-és-konfiguráció)
- [API végpontok](#api-végpontok)
- [Adatbázis séma](#adatbázis-séma)
- [Tesztelés](#tesztelés)
- [Docker használat](#docker-használat)

## Technológiai stack
 
### Backend
- **Node.js** 20 LTS - JavaScript futtatókörnyezet
- **Express.js** 4.19 - Web keretrendszer
- **TypeScript** 5.4 - Típusbiztos fejlesztés
- **Drizzle ORM** 0.30 - SQL query builder és ORM
- **better-sqlite3** 9.4 - SQLite adatbázis driver
- **Jest** 29.7 - Tesztelési keretrendszer
- **Supertest** 7.0 - HTTP végpont tesztelés

### Frontend
- **React** 18.2 - UI könyvtár
- **TypeScript** 5.4 - Típusbiztos fejlesztés
- **Vite** 5.2 - Build eszköz
- **React Router** 6.23 - Kliens oldali routing

### DevOps
- **Docker** - Konténerizáció
- **Docker Compose** - Multi-container orchestration

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

- **Node.js** 20.x vagy újabb
- **npm** 10.x vagy újabb
- **Docker** és **Docker Compose** (opcionális, konténerizált futtatáshoz)

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

## Tesztelés
 
### Backend integrációs tesztek
 
A backend **7 automatizált tesztet** tartalmaz, amelyek az API végpontokat ellenőrzik.
 
**Teszt futtatás:**
```bash
cd backend
npm test
```
 
**Teszt esetek:**
 
| # | Teszt neve | Cél |
|---|-----------|-----|
| 1 | GET /api/posts - üres lista | Üres adatbázis esetén helyes válasz |
| 2 | POST /api/posts - helyes adat | Új bejegyzés létrehozása sikeres |
| 3 | POST /api/posts - hiányzó cím | 400-as hiba validációnál |
| 4 | POST /api/posts - hiányzó tartalom | 400-as hiba validációnál |
| 5 | GET /api/posts/:id - létező | Bejegyzés és kommentek visszaadása |
| 6 | GET /api/posts/:id - nem létező | 404-es hiba kezelése |
| 7 | POST /api/posts/:id/comments | Komment hozzáadása sikeres |
 
**Teszt konfiguráció:**
- **Framework:** Jest 29.7
- **HTTP tesztelés:** Supertest 7.0
- **Adatbázis:** In-memory SQLite (`:memory:`)
**Példa teszt:**
```typescript
it('új bejegyzést hoz létre helyes adatokkal', async () => {
  const res = await request(app)
    .post('/api/posts')
    .send({ title: 'Teszt cím', content: 'Teszt tartalom', author: 'Teszt Szerző' });
 
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body.title).toBe('Teszt cím');
});
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

## Docker használat
 
### Dockerfile-ok
 
#### Backend Dockerfile
 
```dockerfile
FROM node:20-alpine
 
WORKDIR /app
 
COPY package*.json ./
RUN npm install
 
COPY . .
RUN npm run build
 
EXPOSE 3001
 
CMD ["npm", "start"]
```
 
**Rétegek:**
1. Node.js 20 Alpine alapképből indul (kis méret)
2. Függőségek telepítése
3. Forráskód másolása és TypeScript fordítás
4. 3001-es port megnyitása
5. Production mód indítása
#### Frontend Dockerfile (Multi-stage build)
 
```dockerfile
FROM node:20-alpine AS build
 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
 
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
 
**Előnyök:**
- **Build stage:** Vite lefordítja a React appot
- **Production stage:** Csak az nginx és a statikus fájlok maradnak (kisebb image)
---
 
### Docker Compose
 
**Teljes konfiguráció:**
 
```yaml
version: '3.8'
 
services:
  backend:
    build: ./backend
    container_name: blog-backend
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - DB_PATH=/data/blog.db
    volumes:
      - db-data:/data
    restart: unless-stopped
 
  frontend:
    build: ./frontend
    container_name: blog-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
 
volumes:
  db-data:
```
 
**Named volume (`db-data`):**
- Az SQLite adatbázis fájlt tárolja
- Konténer újraindítás vagy újraépítés után is megmarad az adat
- Csak a `docker-compose down -v` törli
**Szolgáltatások indítási sorrendje:**
1. Backend indul először
2. Frontend várja a backend elindulását (`depends_on`)
3. Nginx proxy átirányítja az `/api` hívásokat a backendre


### Drizzle ORM
A backend Drizzle ORM-et használ az adatbázis-kezeléshez. A séma a `backend/src/db/schema.ts` fájlban van definiálva, type-safe lekérdezésekkel.

### Backend nem indul el
 
**Probléma:** `better-sqlite3` telepítési hiba Windows-on
 
**Megoldás:** Node.js 20 LTS használata (Node 22 esetén még nincs pre-built bináris)
```bash
nvm install 20
nvm use 20
npm install
```
 
---
 
### Frontend nem tudja elérni a backend-et
 
**Probléma:** CORS hiba vagy connection refused
 
**Megoldás:** Ellenőrizd hogy a backend fut-e a `3001`-es porton
```bash
curl http://localhost:3001/api/health
# Válasz: {"status":"ok"}
```
 
Győződj meg róla, hogy a Vite proxy be van állítva (`vite.config.ts`).
 
---
 
### Dátum "Invalid Date" formátumban jelenik meg
 
**Probléma:** SQLite `YYYY-MM-DD HH:MM:SS` formátum nem kompatibilis JavaScripttel
 
**Megoldás:** `.replace(' ', 'T')` használata ISO formátumhoz
```typescript
new Date(post.createdAt.replace(' ', 'T')).toLocaleString('hu-HU')
```
 
---