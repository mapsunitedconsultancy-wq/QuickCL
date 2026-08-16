pdf-to-cl/
├── client/                          <-- REACT FRONTEND
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── FieldRow.jsx          Copy btn + confidence badge
│   │   │   ├── SectionCard.jsx        Collapsible section wrapper
│   │   │   ├── UploadZone.jsx         Drag-drop file upload
│   │   │   ├── ConfidenceBadge.jsx    Green/Orange/Red indicator
│   │   │   ├── HSCodeSuggestion.jsx   HS code picker with duty rates
│   │   │   └── CopyButton.jsx        Clipboard copy with toast
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Extract.jsx            Upload screen
│   │   │   ├── Results.jsx            Results with copy buttons
│   │   │   ├── HSLookup.jsx           HS Code search
│   │   │   ├── History.jsx            Past extractions
│   │   │   ├── Clients.jsx            Client master
│   │   │   ├── Settings.jsx           Firm settings
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── api/
│   │   │   └── index.js               Axios instance + all API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx         Auth state management
│   │   ├── App.jsx                     Router + layout
│   │   ├── main.jsx                    Entry point
│   │   └── index.css                   Tailwind import
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
├── server/                          <-- EXPRESS BACKEND
│   ├── routes/
│   │   ├── extract.js                 POST upload + extract
│   │   ├── extractions.js             GET/PATCH extractions
│   │   ├── hs.js                      HS code search + suggest
│   │   ├── clients.js                 Client CRUD
│   │   ├── auth.js                    Register + Login
│   │   └── exchangeRate.js            RBI rate fetcher
│   ├── middleware/
│   │   ├── auth.js                    JWT verification
│   │   └── upload.js                  Multer config
│   ├── lib/
│   │   ├── supabase.js                Supabase client init
│   │   ├── ocr.js                     Google Vision wrapper
│   │   ├── gemini.js                  Gemini AI wrapper
│   │   └── extractionPrompt.js        AI system prompt
│   ├── server.js                      Main entry point
│   ├── package.json
│   └── .env
│
└── README.md