# Business Performance & Revenue Analytics (CRM & Operations Platform)

A modern, full-featured enterprise analytics and CRM web application built with **React 19**, **TypeScript**, **Vite 8**, **Tailwind CSS v4**, and **Three.js**. The platform provides multi-department performance monitoring, dynamic pipeline analytics, revenue target tracking, and employee-level drilldowns using realistic, mathematically consistent business datasets.

---

## 🌟 Key Features

### 1. Multi-Department Analytics Engine
Dynamic, contextual filtering across business units without hardcoding or misleading zero-values:
- **All Departments**: Unified macro view combining sales pipeline velocity, operational fulfillment, and financial cash realization.
- **Sales Department**: Leads pipeline (New, Contacted, Qualified, Won/Lost), Quote-to-Deal conversions, deal values, and sales representative quota attainment.
- **Operations Department**: Order lifecycle stages (Pending, In Progress, Review, Completed, Shipped), fulfillment progress bars, stage completion rates, and delay alerts.
- **Finance Department**: Invoiced revenue vs. cash collections, Accounts Receivable aging, payment collection efficiency, and payment method breakdowns (UPI, NEFT/RTGS, Net Banking, Credit Card).

### 2. Multi-Dimensional Drilldown & Filtering
- **Employee-Specific Filtering**: View individual performance metrics for sales reps, operations managers, and finance officers (or company-wide aggregations).
- **Date Presets & Ranges**: Quick toggles for Today, Yesterday, This Week, Last Week, This Month, Last Month, This Quarter, and Custom Date Ranges with period-over-period delta comparisons.
- **Real-Time Search & Status Filtering**: Instant client-side filtering on all tables and activity feeds.

### 3. Revenue Target & Achievement Tracking
- Monthly and quarterly revenue goals with real-time percentage achievement calculation.
- Dynamic variance analysis showing deficit/surplus against targets.
- Local storage persistence for custom target configurations and user preferences.

### 4. Interactive 3D WebGL Hero Scene
- Built with **Three.js** using modern `THREE.Timer` architecture for smooth, frame-rate independent animations.
- Ambient holographic glass pillars, interactive particle fields, and real-time mouse parallax effects.
- Honors `prefers-reduced-motion` accessibility standards.

### 5. Enterprise Design System
- Dark-blue landing page with neon cyan and electric blue accents (`#071426`, `#0B1730`).
- Sleek, modern interior dashboard with light-slate surfaces, high-contrast typography, and deep navy navigation.
- Fully responsive across desktop, tablet, and mobile devices.

---

## 🧭 Application Routes

### Public Pages
| Route | Description |
|---|---|
| `/` | Landing page featuring 3D WebGL hero, live KPI badges, feature highlights, and interactive preview |
| `/features` | Deep dive into analytics features, department capabilities, and data reconciliation |
| `/about` | Company mission, executive team, engineering philosophy, and security standards |
| `/contact` | Contact form, enterprise sales inquiry, support channels, and office locations |
| `/login` | Authentication portal with demo credential quick-fill options |
| `/signup` | User onboarding and team registration flow |

### Dashboard Application (`/app/*`)
| Route | Description |
|---|---|
| `/app/dashboard` | Main executive overview with KPIs, revenue trends, targets, and departmental highlights |
| `/app/leads` | CRM leads pipeline with status tags, lead scoring, and assignee filtering |
| `/app/quotations` | Commercial quotations list with validity periods, discount rates, and status |
| `/app/deals` | Deal pipeline with probability percentages, expected close dates, and values |
| `/app/orders` | Operations order fulfillment tracking with multi-stage progress bars |
| `/app/sales-activity` | Sales rep activity logs (calls, meetings, demos, follow-ups) |
| `/app/operations` | Operations workload, capacity utilization, bottleneck detection, and delivery metrics |
| `/app/activity` | Unified audit trail of system events across Sales, Ops, and Finance |
| `/app/settings` | Configurable revenue targets, currency settings, notifications, and profile preferences |

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vite.dev/) with native ESM configuration
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom dark/light blue design tokens
- **Data Visualization**: [Recharts 3](https://recharts.org/) (Line, Bar, Area, and Pie charts)
- **3D Graphics**: [Three.js](https://threejs.org/) (WebGL rendering with `THREE.Timer`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Date Utilities**: [date-fns v4](https://date-fns.org/)
- **State Management**: React Context (`AppContext`) with `localStorage` persistence

---

## 📊 Interconnected Data Model

The application uses a mathematically consistent, relational dummy data model where records reference real parent-child business dependencies:

```
[Lead]
  └── [Quotation]
        └── [Deal]
              └── [Order] (Operations fulfillment)
                    └── [Invoice] (Finance billing)
                          └── [Payment] (Collections & Reconciliation)
```

- Every record contains real timestamps, assignees, department identifiers, and financial values in Indian Rupees (INR / ₹).
- Calculations dynamically compute conversion rates, progress percentages, and payment reconciliation without static hardcoded numbers.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Installation
Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

> **Note on Dependencies**: `package.json` pins `esbuild: "^0.27.0"` to ensure full compatibility between `vite@^8.3.0` and `tsx@^4.21.0` during clean installations.

### Development Server
Run the local development server:

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### Production Build
Create an optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Type Checking & Linting
Validate TypeScript types across the codebase:

```bash
npm run lint
```

---

## 📁 Project Structure

```
├── public/                 # Static public assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Buttons, badges, date filters, modals
│   │   ├── landing/        # ThreeDAnalyticsScene, landing navbar, footer
│   │   └── layout/         # DashboardLayout, Sidebar, TopHeader
│   ├── context/            # AppContext (global state, filters, user sessions)
│   ├── data/               # Realistic dummy datasets (leads, deals, orders, etc.)
│   ├── pages/              # Application views
│   │   ├── dashboard/      # Overview, Leads, Deals, Orders, Operations, Settings
│   │   ├── AboutPage.tsx   # Public About page
│   │   ├── ContactPage.tsx # Public Contact page
│   │   ├── FeaturesPage.tsx# Public Features page
│   │   ├── LandingPage.tsx # Public Landing page
│   │   ├── LoginPage.tsx   # Login page
│   │   └── SignupPage.tsx  # Sign Up page
│   ├── types/              # TypeScript interfaces (Kpi, Leads, Orders, Invoices)
│   ├── utils/              # Calculation helpers, formatting, date processors
│   ├── App.tsx             # Root router configuration
│   ├── index.css           # Global Tailwind CSS entry
│   └── main.tsx            # React application entry point
├── package.json            # Project manifest & dependency specifications
├── package-lock.json       # Deterministic lockfile
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build and development configuration
└── README.md               # Project documentation
```

---

## 🚢 Deployment (Vercel / Netlify / Render)

This project is pre-configured for zero-configuration deployment on Vercel:

1. Connect your repository to **Vercel** or your preferred hosting platform.
2. Ensure the build configuration is set to:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Single Page Application (SPA) routing is supported out-of-the-box.

---

## 📄 License
This project is proprietary and built for enterprise analytics monitoring. All rights reserved.
