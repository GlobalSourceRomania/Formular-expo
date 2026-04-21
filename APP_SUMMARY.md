# Rezumat Aplicație - Formular Expo 2026

## 📋 Vue de ansamblu

**Formular Expo** este o aplicație Next.js 16 pentru capturarea lead-urilor la expozițiile din 2026. Cuprinde un formular public pentru colectarea datelor și un panou admin pentru gestionarea datelor.

**Tech Stack:**
- Frontend: React 19, Next.js 16, Tailwind CSS 4
- Backend: Next.js API Routes
- Database: Neon PostgreSQL (serverless)
- Hosting: Vercel
- Language: TypeScript

---

## 🏗️ Structura Proiectului

```
formular_expo/
├── app/
│   ├── page.tsx              # Formular public - pagina principală
│   ├── admin/page.tsx        # Panou admin pentru gestionare date
│   ├── layout.tsx            # Layout root cu metadate
│   ├── globals.css           # Stiluri globale
│   └── api/
│       ├── submissions/       # POST/GET contacte
│       ├── exhibitions/       # Gestionare expozițîi
│       ├── companies/
│       │   ├── search/       # Căutare companii
│       │   └── upload/       # Import CSV companii
│       ├── export/           # Export CSV contacte
│       └── setup/            # Inițializare baza de date
├── lib/
│   └── db.ts                 # Funcții database și schema
├── public/
│   └── logo.png              # Logo aplicație
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## 📄 Pagini Principale

### 1. **Pagina Formular** (`/`)
- **Componență:** Client-side React
- **Funcționalitate:**
  - Selecție expozitie (3 expozițîi implicite)
  - Căutare/input companie cu auto-complete din CSV
  - Selecție județ (41 județe + București)
  - Date reprezentant: prenume, nume, funcție
  - Contact: email, telefon (formatare +40)
  - Tip contact: Vendor/Client
  - Echipamente interes (multiplu select)
  - Echipament curent (textarea)
  - Informații adiționale
  - Rating relevanță (1-5 stele)
  - Validare și trimitere API
  - Ecran success cu opțiune "Contact nou"

**Design:** Dark theme cu gradient (albastru #00B4EF + verde #8DC63F)

### 2. **Panou Admin** (`/admin`)
- **Componență:** Client-side React
- **Funcționalitate:**
  - **Statistici:** Total contacte, contacte per expozitie
  - **Setup DB:** Creare/inițializare tabele
  - **Import CSV:** Încărcare listă companii
  - **Gestionare Expozițîi:**
    - Adăugare expozitie nouă
    - Ștergere expozitie
    - Afișare și update automat
  - **Tabel Contacte:**
    - Afișare lista completă (data, expozitie, companie, reprezentant, județ, email, tip, rating)
    - Expandare rând pentru detalii complete
    - Export CSV pentru toți contactele
  - Notificări (success/error) cu timeout 4s

**Design:** Dark theme similar cu logo gradient

---

## 🔌 API Routes

### `POST /api/submissions`
Salvare contact nou din formular
- Request: FormData object
- Response: `{ ok: true }` sau error

### `GET /api/submissions`
Obținere toate contactele
- Response: Array de submissions

### `POST /api/exhibitions`
Adăugare expozitie nouă
- Request: `{ name: string }`
- Response: `{ ok: true }` sau error

### `GET /api/exhibitions`
Obținere lista expozițîi
- Response: Array de string-uri

### `DELETE /api/exhibitions`
Ștergere expozitie
- Request: `{ name: string }`
- Response: `{ ok: true }` sau error

### `GET /api/companies/search?q=...`
Căutare companii (partial match)
- Response: Array de string-uri (max 10)

### `POST /api/companies/upload`
Import CSV companii
- Request: FormData cu file
- Response: `{ ok: true, count: number }` sau error
- Format CSV: coloană 1 = nume companie

### `GET /api/export`
Export contacte în CSV
- Response: CSV file download

### `POST /api/setup`
Inițializare baza de date
- Crează tabele: exhibitions, companies, submissions
- Inserează 3 expozițîi implicite

---

## 🗄️ Schema Baza de Date (PostgreSQL)

### Tabelul `exhibitions`
```sql
id SERIAL PRIMARY KEY
name TEXT UNIQUE NOT NULL
active BOOLEAN DEFAULT true
```

### Tabelul `companies`
```sql
id SERIAL PRIMARY KEY
name TEXT UNIQUE NOT NULL
```

### Tabelul `submissions`
```sql
id SERIAL PRIMARY KEY
created_at TIMESTAMPTZ DEFAULT NOW()
exhibition TEXT
company TEXT
county TEXT
first_name TEXT
last_name TEXT
position TEXT
email TEXT
phone TEXT
contact_type TEXT ('vendor' | 'client')
equipment_interest TEXT (comma-separated)
current_equipment TEXT
additional_info TEXT
relevance INTEGER (1-5)
```

---

## 🎨 Design System

**Culori:**
- Dark background: `#080D1A`
- Primary blue: `#00B4EF`
- Green accent: `#8DC63F`
- Subtle white overlays: `white/[0.03]` to `white/[0.1]`

**Componente Tailwind:**
- Rounded corners: `rounded-xl` / `rounded-2xl`
- Cards: `bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 md:p-6`
- Buttons: `px-4 py-2.5 rounded-xl text-sm font-medium transition-colors`
- Inputs: `bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/30`

---

## 🚀 Configurare Mediu

### Variabile de Mediu (`.env.local`)
```
DATABASE_URL=postgresql://user:password@host/db
```

### Expozițîi Implicite (hardcodate)
1. BSDA - Bucuresti 2026
2. Robotics Expo - Brasov 2026
3. Automotiv Expo Sibiu 2026

---

## 📱 Responsive Design

- Mobile-first approach
- Grid layout: `grid-cols-2 md:grid-cols-4` pentru stats
- Tabela contacte: `min-w-[700px]` cu scroll orizontal pe mobile
- Header: `sticky top-0 z-20` cu backdrop blur

---

## 🔐 Securitate

- Content-Type validation pe API routes
- File upload: doar .csv acceptate
- Phone normalization: validare și formatare automată
- CORS: Implicit implicit (same-origin)
- Database: Parametrizate queries (SQL injection prevention)

---

## 📊 Flux Utilizator

### Public (Formular)
1. User completează formular pas cu pas
2. Auto-complete companie din CSV
3. Validare și submit
4. Success page cu opțiune "Contact nou"
5. Contact salvat în DB

### Admin
1. Setup DB (prima rulare)
2. Import CSV companii
3. Manage expozițîi (add/delete)
4. View/expand contacte
5. Export CSV

---

## 🔧 Comenzi Utile

```bash
# Development
npm run dev              # Port 3000

# Production
npm run build
npm start

# Linting
npm run lint

# Deploy direct pe Vercel (Production)
npx vercel --prod
```

---

## 📦 Dependințe Principale

- `@neondatabase/serverless`: ^1.1.0 - Database client
- `next`: 16.2.4 - Framework
- `react`: 19.2.4 - UI library
- `tailwindcss`: ^4 - Styling

---

## ✅ Status

- ✅ Formular complet cu validare
- ✅ Admin panel cu statistici
- ✅ Database connection (Neon PostgreSQL)
- ✅ CSV import/export
- ✅ API routes (submissions, exhibitions, companies)
- ✅ Dark theme design
- ✅ Responsive layout
- ✅ Auto-complete companii

---

## 🔮 Potențiale Îmbunătățiri

- Autentificare admin
- Validare email
- Rate limiting API
- Pagination contacte
- Filters/sort pe admin
- Email notifications
- Multi-language support
- Analytics tracking

---

**Ultima actualizare:** 21 Aprilie 2026
**Versiune:** 0.1.0
**Status:** Live pe Vercel
