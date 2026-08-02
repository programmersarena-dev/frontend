# ProgrammersArena Frontend

React frontend for ProgrammersArena, an online contest platform. Built with React, Vite, and Tailwind CSS.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building](#building)

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

### Clone Repository

```bash
git clone https://github.com/mali-ab/programmers-arena.git
cd programmers-arena/frontend
```

### Install Dependencies

```bash
npm install
```

## Configuration

### Environment Setup

Create `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=ProgrammersArena
```

Update `VITE_API_URL` to point to your backend API endpoint.

## Development

### Start Development Server

```bash
npm run dev
```

Opens http://localhost:5173 in development mode with hot module reloading.

### With Docker Compose

```bash
docker-compose up --build
```

Runs frontend at http://localhost:3000 via Nginx.

## Building

### Production Build

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

### Preview Build

```bash
npm run preview
```

Serves the production build locally.

## Project Structure

```
src/
├── components/      # Reusable React components
├── contexts/        # Context providers
├── views/           # Page/view components
├── lang/            # Internationalization
├── ckeditor/        # Rich text editor integration
├── App.jsx          # Root component
├── main.jsx         # Entry point
├── router.jsx       # Route definitions
├── index.css        # Global styles
└── axios.js         # HTTP client
```

## Features

- Real-time contest participation
- Code editor with syntax highlighting
- Submission tracking
- Standings display
- User profile management

## Backend Integration

Frontend communicates with Laravel backend API at the configured `VITE_API_URL`.

For local development, ensure:
- Backend is running on `http://localhost:8000`
- CORS is configured to allow requests from `http://localhost:5173`

## License

MIT
