# SecurePaste Frontend

A modern, secure paste service frontend built with Next.js 14, providing a beautiful and intuitive interface for creating and managing encrypted pastes.

[← Back to Project Root](../README.md)

## Overview

The frontend provides a modern, responsive interface for creating and managing encrypted pastes. It features a clean design with dark mode support and comprehensive security features.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 🔒 End-to-end encryption support
- 🔐 Password protection for pastes
- 👁️ View limit controls
- ⏱️ Expiration time selection
- 📱 Mobile-first design
- 🌙 Dark mode support

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **State Management:** React Context
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Deployment:** Vercel

## Project Structure

```
frontend/
├── app/                    # App router pages
│   ├── page.tsx           # Home page
│   ├── paste/             # Paste routes
│   │   ├── [id]/         # Dynamic paste routes
│   │   └── create/       # Create paste page
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── api/             # API client
│   ├── hooks/           # Custom hooks
│   └── utils/           # Helper functions
├── public/              # Static assets
└── styles/              # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn package manager

### Installation

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:

   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run tests
yarn test

# Run linter
yarn lint
```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Features in Detail

### Paste Creation

- Rich text editor support
- Syntax highlighting
- File upload support
- Custom expiration times
- Password protection
- View limit configuration

### Paste Viewing

- Secure content display
- Password entry for protected pastes
- View count tracking
- Expiration status
- Copy to clipboard
- Download as file

### Security Features

- End-to-end encryption
- Secure password handling
- CORS protection
- XSS prevention
- CSRF protection

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
