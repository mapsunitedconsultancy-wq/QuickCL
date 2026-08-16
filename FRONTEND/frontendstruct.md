client/src/
├── api/
│   └── index.js                   ← Centralized backend API calls
├── context/
│   └── AuthContext.jsx            ← User auth & CHA firm state management
├── components/
│   ├── Sidebar.jsx                ← Responsive left navigation menu
│   ├── CopyButton.jsx             ← Clipboard copy button with toast
│   ├── ConfidenceBadge.jsx        ← Green / Amber / Red accuracy badge
│   ├── FieldRow.jsx               ← Interactive field editor with source tracking
│   ├── SectionCard.jsx            ← Collapsible section wrapper
│   ├── UploadZone.jsx             ← Drag-and-drop document uploader
│   ├── HSCodeSuggestion.jsx       ← 8-digit HSN code picker & duty rates
│   ├── StatsCard.jsx              ← Dashboard KPI metric cards
│   ├── EmptyState.jsx             ← Clean placeholder state
│   └── Header.jsx                 ← Top status & agency info bar
├── pages/
│   ├── Login.jsx                  ← Firm login page (Google & Email)
│   ├── Register.jsx               ← New CHA agency onboarding
│   ├── Dashboard.jsx              ← KPI metrics, extraction jobs & client master shortcuts
│   ├── Extract.jsx                ← BOE / SB document uploader & test drive bundles
│   ├── Results.jsx                ← ~150-field checklist editor, audit logs & Excel/CSV export
│   ├── History.jsx                ← Searchable extraction job archives
│   ├── HSLookup.jsx               ← ITC-HS 8-digit tariff schedule search & multi-code pad
│   ├── Clients.jsx                ← Importer / Exporter registry (IEC, GSTIN, AD Code)
│   └── Settings.jsx               ← CHA licence details & MAPS TECH company info
├── data/
│   ├── sampleExtractions.js       ← Sample Kandla BOE & Chennai SB extractions
│   └── hsnData.js                 ← Indian Customs ITC-HS tariff schedule data
├── lib/
│   ├── exportUtils.js             ← Excel & CSV downloader utilities
│   └── firebase.js                ← Firebase Auth & Firestore client
├── App.jsx                        ← Main app routing & state container
├── main.jsx                       ← Application entry point
└── index.css                      ← Tailwind CSS stylesheet




In your current application environment, everything has been converted to pure React + JavaScript in client/src/ and is already compiling, running, and fully verified.
Dependencies Summary
If you are copying or exporting this client/src/ code to a separate local machine or standard Vite + React project (e.g. npm create vite@latest my-app -- --template react), here are the npm packages used:
1. Main Runtime Dependencies
Run this command in your project root:
code
Bash
npm install lucide-react xlsx firebase react react-dom
Package	Usage in client/src/
lucide-react	Vector UI icons (Copy, Search, FileText, Check, ShieldCheck, etc.)
xlsx	Exporting BOE & SB checklists directly to .xlsx files
firebase	Google OAuth SSO & Firestore database persistence
react & react-dom	Core UI rendering framework
2. Styling (Tailwind CSS v4)
Tailwind CSS is used for all layout and styling across all components.
If setting up Tailwind in Vite:
code
Bash
npm install -D tailwindcss @tailwindcss/vite
In index.css:
code
CSS
@import "tailwindcss";
What Has Been Converted (client/src/):
client/src/api/index.js: Centralized API handlers for HSN search & Gemini document extractions
client/src/context/AuthContext.jsx: User login state management with Firebase & Google SSO
client/src/components/: All modular sub-components (Sidebar.jsx, CopyButton.jsx, ConfidenceBadge.jsx, FieldRow.jsx, SectionCard.jsx, UploadZone.jsx, HSCodeSuggestion.jsx, StatsCard.jsx, EmptyState.jsx, Header.jsx)
client/src/pages/: All primary screens (Login.jsx, Register.jsx, Dashboard.jsx, Extract.jsx, Results.jsx, History.jsx, HSLookup.jsx, Clients.jsx, Settings.jsx)
client/src/App.jsx: Main application router & layout wrapper
client/src/main.jsx: React 19 entry point
