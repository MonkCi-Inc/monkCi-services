# Backend API

This is a Next.js backend application that provides API endpoints and services.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/status` - Service status and information

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
```

## Technologies Used

- Next.js 15.3.5
- React 19
- TypeScript
- Tailwind CSS
- ESLint 