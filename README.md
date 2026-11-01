# Safai Sathi - Admin Portal (PS000051)
## DDO Panchmahal Godhra • Citizen-Centric Garbage Collection & Sanitation Monitoring System

### 🌐 Live Portal Links
- **🚀 Live Public Link (Mobile & Desktop)**: [https://trials-turtle-comparisons-york.trycloudflare.com](https://trials-turtle-comparisons-york.trycloudflare.com)
- **🌿 GitHub Pages**: [https://arpitvpandey.github.io/safaai-sathi/](https://arpitvpandey.github.io/safaai-sathi/)
- **🖥️ Localhost (Development / Local)**: [http://localhost:3000](http://localhost:3000)

Welcome to the **Safai Sathi Admin Portal**. This web platform is built strictly according to **PRD 3 of 3 (Admin Website Panel)** and **DESIGN.md (Safai Sathi Design System v1.0)**.

---

## 🌟 1. Project In-Depth Knowledge (પ્રોજેક્ટ વિગતવાર માહિતી)

### 🎯 Purpose & Hierarchy
The portal serves 4 tiers of administrative sanitation authorities in Panchmahal District (Godhra, Gujarat):
1. **Ward Inspector (`inspector`)**:
   - Manages day-to-day vans and citizen complaints for assigned wards (e.g. Ward 1, Ward 2).
   - Resolves complaints with mandatory photo proof verification.
2. **Chief Officer (`chief_officer`)**:
   - Oversees all **Urban Wards** (Godhra Nagarpalika).
   - Automatically receives **Level 1 Escalations** (> 24 hours unresolved).
3. **Taluka Development Officer (`tdo`)**:
   - Oversees all **Rural Gram Panchayat Wards** in the Taluka.
   - Automatically receives **Level 1 Escalations** (> 24 hours unresolved).
4. **District Development Officer (`ddo`)**:
   - Highest authority (IAS level). Sees all wards across the entire district.
   - Automatically receives **Level 2 Escalations** (> 48 hours unresolved).

---

## 🗄️ 2. Database Schema (Firestore Shared Contract 0.2)

All collections, fields, and enums follow the shared contract across the Citizen App, Driver App, and Admin Panel:

| Collection | Key Fields | Description |
|---|---|---|
| `wards` | `id, name, nameGu, code, type (urban/rural), center {lat, lng}, radiusM, routeId, inspectorId, escalationTo` | Wards definitions with geographic center and escalation chain |
| `vans` | `id, plateNo, routeId, status (idle/on_shift/offline), lastLocation {lat, lng, updatedAt, speedKmph}, batteryPct` | Garbage collection vans with live telemetry |
| `vanSecrets` | `id, driverPinHash` | Admin-managed 4-digit hashed PIN (only Cloud Functions read) |
| `routes` | `id, name, wardIds[], scheduledStartTime` | Sequence of wards visited daily |
| `trips` | `id, vanId, routeId, date, startedAt, wardsDone[{wardId, doneAt}], gpsTrail[{lat, lng, t}]` | Daily trip history and route completion tracking |
| `complaints` | `id, ticketId (PMH-YYYYMMDD-NNNN), category, photoUrl, location, wardId, status, escalationLevel (0/1/2), resolvedPhotoUrl, mergedInto` | Citizen sanitation grievances |
| `notices` | `id, targetType (all/ward/van), targetId, message, createdAt, createdBy` | Push notifications dispatched via FCM |
| `staff` | `id, authUid, name, role (inspector/chief_officer/tdo/ddo), wardIds[], phone, email` | Official staff directory and security scopes |
| `ratings` | `id, wardId, date, stars (1-5), deviceId` | Public sanitation satisfaction scores |

---

## 🎨 3. Design System & Tokens (DESIGN.md)

1. **Colors**:
   - Primary Action (`color.primary`): `#111A14` (Ink - Full-width pill buttons)
   - Brand Green (`color.brand`): `#1B7A3F`, Soft: `#E4F1DF`, Mid: `#6DB36F`
   - Accent Orange (`color.accent`): `#F0873A`, Strong: `#B34A0B` (Pins, selections)
   - Background: Light `#F3F6F2` / Dark `#0E1612` (Instant dark mode toggle)
2. **Signature ContourCard (CL-12)**:
   - Dynamic topographic contour curves drawn with mathematical sine-wave algorithms on `#6DB36F` with dark ink text (passing strict WCAG AA contrast ratio of 7.05:1).
3. **Mascot Binny (CL-15)**:
   - Friendly dustbin mascot with leaf sprout in SVG with 4 poses (`wave`, `wait`, `celebrate`, `sleep`).
4. **Status Chips (CL-09)**:
   - Always formatted with **Icon + Label + Color** (never a plain dot).

---

## 🚀 4. How to Run the Website Locally

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

Open `http://localhost:3000` in your web browser.

---

## 🔑 5. API Requirements & How to Connect Firebase

The website runs in **High-Fidelity Simulated Mode** out-of-the-box. It contains real Godhra coordinates, live simulated moving GPS vans, and realistic grievance complaints.

### APIs Required for Live Production:
When you are ready to connect a live Google Firebase backend:
1. **Firebase Project**: Create a project in [Firebase Console](https://console.firebase.google.com/) (recommended region `asia-south1` Mumbai).
2. **Services to Enable**:
   - **Firebase Authentication** (Email/Password)
   - **Cloud Firestore** (Database)
   - **Firebase Storage** (For complaint resolution photos)
   - **Firebase Cloud Messaging (FCM)** (For notices)
3. **Credentials Needed**:
   - `apiKey`
   - `projectId`
   - `authDomain`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Where to enter the Firebase Keys:
- **Option A (Interactive UI)**: Click the **Key icon** in the top navigation bar of the admin portal, enter your Firebase credentials, and click **Connect & Save**.
- **Option B (`.env` file)**: Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=safaai-sathi-godhra
VITE_FIREBASE_AUTH_DOMAIN=safaai-sathi-godhra.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=safaai-sathi-godhra.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🛠️ 6. How to Make Future Changes (Updatable Architecture)

The codebase is organized modularly so you can easily update any part in the future:

- **Wards, Routes or Vans data**: Edit `src/services/seedData.ts`.
- **Translations (English & Gujarati)**: Edit `src/locales/en.ts` and `src/locales/gu.ts`.
- **System SLA Timers (24h/48h Escalations)**: Edit `src/constants/index.ts`.
- **Colors & Theme Tokens**: Edit `tailwind.config.js` and `src/constants/index.ts`.
- **Screens & Dashboards**:
  - `src/screens/A2_Overview.tsx` (KPIs & Trend chart)
  - `src/screens/A3_LiveMap.tsx` (Fleet GPS tracking & Leaflet markers)
  - `src/screens/A4_Complaints.tsx` (Grievance table, filters, proof upload)
  - `src/screens/A5_Wards.tsx` (Ward ratings & completion metrics)
  - `src/screens/A6_VansRoutes.tsx` (Van registration & Driver PINs)
  - `src/screens/A7_Notices.tsx` (Broadcast announcements)
  - `src/screens/A8_Reports.tsx` (Heatmap & CSV download)
  - `src/screens/A9_Staff.tsx` (Authority directory)
