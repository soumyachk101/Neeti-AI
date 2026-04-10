# Neeti AI - Frontend

This is the standalone frontend for the Neeti AI platform, an AI-powered technical interview intelligence platform.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- NPM or Yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run the development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## 📁 Structure

- `src/` - Application source code
  - `components/` - Reusable UI components
  - `pages/` - Route-level page components
  - `store/` - State management (Zustand)
  - `lib/` - API client and utilities
- `public/` - Static assets
- `index.html` - Entry point

## ⚙️ Configuration

Copy the `.env.example` file (if provided) or create a `.env` file in the root with your credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🛠 Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Zustand**
- **Lucide React** (Icons)
- **LiveKit React** (Video/Audio)
