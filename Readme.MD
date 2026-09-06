# Anion

A lightweight desktop launcher built with Electron — a browser-style start screen with quick access to your favorite sites, plus a taskbar for managing open app windows.

## Features

- Search bar that resolves input to a URL or falls back to a Google search
- Quick-access shortcuts to common sites (Files, Web, Photos, GitHub, Mail, Calendar)
- Draggable, resizable floating windows for each opened site
- Taskbar with minimize/restore and a live clock
- Start button to toggle the launcher view

## Getting Started

Install dependencies:

\`\`\`
npm install
\`\`\`

Run the app:

\`\`\`
npm start
\`\`\`

## Building

Build for your current platform:

\`\`\`
npm run build
\`\`\`

Build for a specific platform:

\`\`\`
npm run build -- --win
npm run build -- --mac
npm run build -- --linux
\`\`\`

Or build all three at once (macOS only, requires Wine for the Windows target):


npm run build -- --mac --win --linux


Built installers are output to the `dist/` folder.

## Project Structure

\`\`\`
anion/
  main.js           # Electron main process
  renderer/
    index.html      # App UI
    renderer.js     # UI logic
    style.css       # Styles
    png-sources/    # Icon assets
  package.json
\`\`\`

## License

ISC
