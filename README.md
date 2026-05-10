# SKDA — Static Keystroke Dynamic Authentication

Biometric authentication that learns the rhythm of your typing.
Django REST API + Random Forest classifier, paired with a React + Vite +
Tailwind frontend that captures and visualises your keystroke pattern in
real time.

> Even if someone steals your password, they still have to type it like you.

## Architecture

```
.
├── KeystrokeDynamicAuthentication/   # Django project — settings, urls, JSON API
├── admins/                           # Admin app (model registration only)
├── users/                            # User app — model + Random Forest utility
│   └── utility/FARFRR_Calc.py        # ML pipeline (Random Forest, FAR/FRR/EER)
├── frontend/                         # React + Vite + Tailwind UI (the app)
├── media/data.csv                    # Training dataset
├── manage.py
├── requirements.txt
├── start.sh                          # One-command launcher
└── README.md
```

There is **no Django HTML frontend** any more — Django serves only JSON.
Everything users see lives in `frontend/`.

## Run it

### Quickest — one command

```bash
./start.sh
```

This installs Python and frontend dependencies on first run, applies
migrations, and boots Django (port 8000) + Vite (port 3000) together.
Press `Ctrl-C` to stop both.

Then open **http://localhost:3000**.

### Manual — two terminals

If you'd rather see the logs separately:

```bash
# Terminal 1 — backend
python3 -m pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000
```

```bash
# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

## Prerequisites

- **Python 3.10+** with `pip`
- **Node.js 18+** and `npm` (`brew install node` or download from nodejs.org)

## Admin credentials (development)

```
username: admin
password: admin
```

## Frontend highlights

- **Premium dark UI** — refined violet / cyan / pink palette, slow-drifting
  aurora background, generous typography (Inter at semibold display weight).
- **Live keystroke biometrics** — `useKeystrokeDynamics()` captures hold
  time, flight time, rhythm; rendered as a waveform, bar chart, and
  keyboard heatmap.
- **Command palette** — press <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> anywhere
  inside the authenticated app to navigate or run actions instantly.
- **Framer Motion micro-interactions** — page transitions, hover lifts,
  staggered reveals, parallax on scroll.
- **Recharts dashboards** — FAR / FRR / EER, per-class precision/recall radar.

## API endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/register/` | Create a user with their captured SKDA value |
| POST | `/api/login/` | Authenticate a user |
| POST | `/api/admin-login/` | Authenticate an admin |
| POST | `/api/change-password/` | Verify rhythm + update password |
| POST | `/api/logout/` | Flush the session |
| GET  | `/api/users/` | List registered users (admin) |
| POST | `/api/activate-user/` | Activate a user (admin) |
| POST | `/api/deactivate-user/` | Deactivate a user (admin) |
| GET  | `/api/dataset/` | Browse the keystroke CSV |
| GET  | `/api/classification/` | Run the Random Forest classifier |
| GET  | `/api/dashboard-stats/` | KPIs for the dashboard |

## ML pipeline

`users/utility/FARFRR_Calc.py` trains a Random Forest classifier on
`media/data.csv` and computes False Acceptance Rate, False Rejection Rate,
and Equal Error Rate. The frontend's `/classification` page renders those
metrics live alongside the per-class report.

## License

MIT — provided as-is for research and educational use.
