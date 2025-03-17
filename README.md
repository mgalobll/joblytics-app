# Joblytics - Job Application Tracking System

A comprehensive web application for managing and tracking job applications, networking connections, and daily goals.

## Features

- **User Authentication**: Secure login and registration using Supabase Auth
- **Daily Agenda**: Set and track daily goals related to job applications and networking
- **Job Applications Board**: Centralized tracking of job applications with status updates
- **Networking Board**: Manage and prioritize professional connections
- **Real-time Updates**: Synchronized updates between boards and daily goals

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Forms**: React Hook Form
- **UI Components**: HeadlessUI

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── lib/                 # Utility functions and helpers
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## Color Scheme

- Light Grey: #F5F5F5
- Medium Grey: #D1D1D1
- Dark Grey: #333333
- Primary Blue: #4A90E2

## Typography

The application uses the Inter font family for a modern, clean look.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
