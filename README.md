# React TypeScript App with Webpack and Bootstrap

A modern React application built with TypeScript, Webpack, and Bootstrap for styling.

## Project Structure

```
src/
├── index.tsx          # Application entry point
├── index.scss         # Global styles
├── App.tsx            # Main App component
├── App.scss           # App-specific styles
public/
├── index.html         # HTML template
webpack.config.js      # Webpack configuration
tsconfig.json          # TypeScript configuration
.babelrc              # Babel configuration
package.json          # Project dependencies
```

## Installation

```bash
npm install
```

## Available Scripts

- `npm start` - Start development server (port 3000)
- `npm run build` - Build production bundle
- `npm run dev` - Build in development mode with watch

## Development

To start the development server with hot module reloading:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Building

To create an optimized production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Technologies Used

- **React 18** - JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript
- **Webpack 5** - Module bundler
- **Babel** - JavaScript compiler
- **Bootstrap 5** - CSS framework
- **SASS/SCSS** - CSS preprocessor

## Features

- ✅ TypeScript support with strict mode
- ✅ Hot Module Replacement (HMR) for development
- ✅ SCSS/SASS support
- ✅ Bootstrap 5 integration
- ✅ Production-ready build optimization
- ✅ Clean bundle with content hash for caching
