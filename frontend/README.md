# SKDA — Keystroke Dynamic Authentication (Frontend)

A god-tier React + Vite + Tailwind interface for the SKDA Django backend.
Cyberpunk visual language, real-time keystroke biometrics, ML telemetry.

## Stack

- **React 18 + Vite 5** — fast dev/build
- **Tailwind CSS 3** — custom `cyber-*` palette + neon utilities
- **Framer Motion** — micro-interactions & page transitions
- **Recharts** — live ML metric visualisations
- **Lucide React** — consistent icon system
- **Axios** — Django API client (proxies `/api` → `http://localhost:8000`)

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing / hero |
| `/login` | User login |
| `/admin-login` | Admin login (also reachable via toggle on `/login`) |
| `/register` | Two-step registration with live keystroke capture |
| `/dashboard` | Authenticated user home |
| `/change-password` | Biometric password change |
| `/dataset` | Browse the keystroke dataset |
| `/classification` | Live RF classification report (FAR/FRR/EER) |
| `/admin` | Admin operations console |
| `/admin/users` | Activate / deactivate users |
| `/admin/reports` | ML metrics for admin |

## Run

```bash
# In one shell — Django backend
cd ..
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000

# In another shell — React frontend
cd frontend
npm install
npm run dev
# → open http://localhost:3000
```

The Vite dev server proxies all `/api/*` requests to Django on port 8000,
and the `CorsMiddleware` on Django allows requests back from
`http://localhost:3000`.

## Build for production

```bash
npm run build
# Output → dist/
```

The compiled files in `dist/` can be served behind any static host or
copied into Django's `STATICFILES_DIRS`.

## Design system

Defined in `tailwind.config.js` and `src/index.css`. Reusable primitives:

- `<GlassCard />` — frosted panel
- `<NeonButton />` — primary / secondary / accent / success / danger / ghost
- `<CyberInput />` — glowing input with password toggle
- `<StatsCard />` — KPI tile
- `<KeystrokeVisualizer />`, `<KeystrokeWaveform />`, `<TypingHeatmap />`
  — biometric capture visualisations driven by `useKeystrokeDynamics()`
- `<ParticleBackground />` — ambient canvas net

## Admin credentials (dev)

```
username: admin
password: admin
```
