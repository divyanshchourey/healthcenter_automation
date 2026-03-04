# Health Admin Dashboard (React + Vite + TypeScript + Tailwind)

Minimal healthcare admin dashboard with login (mobile + OTP), theme toggle, responsive sidebar, SVG charts, and patient/appointment management using a mock API. Built with React 18, Vite, TypeScript, and Tailwind CSS. No heavy UI/chart libraries.

## Tech Stack
- React 18 + TypeScript (Vite)
- Tailwind CSS (custom tokens + dark mode via class)
- Client routing: `react-router-dom`
- No external chart libs; charts are simple SVG

## Features
- Login with mobile + OTP (mock OTP: `123456`), optional “Remember me”
- Forgot password flow with security questions (mock)
- Dashboard widgets: stats, appointment trend line chart, test distribution pie chart, recent activity table
- Patients module: list, details, create/edit
- Appointments module: list, details, create/edit
- Dark/light theme toggle
- Responsive layout with collapsible sidebar on mobile
- Mock API services and TypeScript interfaces

## Getting Started

 Install dependencies
```
cd "health-admin-dashboard"
npm install
```
 Build for production
```
npm run build
npm run preview
```

## Usage

- Login screen: enter any valid 10-digit mobile (e.g. 9876543210). Use OTP `123456`.
- After login, use the sidebar to navigate:
  - Dashboard `/`
  - Patients `/patients`, Add `/patients/new`, Details `/patients/:id`, Edit `/patients/:id/edit`
  - Appointments `/appointments`, Add `/appointments/new`, Details `/appointments/:id`, Edit `/appointments/:id/edit`
- Theme toggle is in the header.

## Project Structure
```
src/
  components/
    AppointmentChart.tsx          # SVG line chart
    LoginForm.tsx                 # Mobile + OTP + forgot flow
    QuickActions.tsx
    RecentActivityTable.tsx
    StatsGrid.tsx
    TestDistributionChart.tsx     # SVG pie chart
  layouts/
    DashboardLayout.tsx           # Header + sidebar + content
  pages/
    Dashboard.tsx
    patients/
      PatientDetails.tsx
      PatientForm.tsx
      PatientsList.tsx
    appointments/
      AppointmentDetails.tsx
      AppointmentForm.tsx
      AppointmentsList.tsx
  services/
    mockApi.ts                    # Mock endpoints + delay
  types.ts                        # TypeScript interfaces
  main.tsx                        # Router + theme + auth bootstrap
  index.css                       # Tailwind directives + CSS variables
```

## Configuration
- Tailwind config: `tailwind.config.js` (dark mode via `class`, content paths, colors, fonts)
- Fonts: Inter via Google Fonts in `index.html`
- TypeScript configs: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

## Mock Data & Auth
- OTP is always `123456`.
- “Remember me” persists `auth_user` in `localStorage`.
- Mock data for stats, activity, patients, and appointments is generated in `services/mockApi.ts`.

## Notes
- This project intentionally avoids heavy UI libraries and charting packages to keep it lightweight.
- Replace mock services with real APIs by swapping functions in `services/mockApi.ts`.

## License
MIT
