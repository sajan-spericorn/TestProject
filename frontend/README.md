# Calculator Frontend

A Next.js calculator UI that connects to the calculator backend API.

## Setup

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` by default. If the backend is also on 3000, change the port:

```bash
npm run dev -- -p 3001
```

## Features

- Clean, modern calculator UI
- All basic operations: add, subtract, multiply, divide
- Real-time calculation via API calls to backend
- Error handling and validation
- Decimal support
- Backspace and clear functions

## How It Works

- Frontend communicates with backend at `http://localhost:3000`
- Each operation sends a POST request to the backend
- Results are displayed in real-time
- Built with Next.js 14 and React 18

## Backend Requirements

Ensure the calculator backend is running on port 3000:

```bash
cd ..
npm start
```

Then in another terminal:

```bash
cd frontend
npm run dev -- -p 3001
```

Visit `http://localhost:3001` in your browser.
