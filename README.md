# TP Weather App 🌦️

A premium, modern weather application built with Next.js, React, and Tailwind CSS. It features a sleek glassmorphism UI with real-time weather tracking, 5-day forecasts, and dynamic dark mode styling.

## Features

- **Real-Time Weather Data**: Get up-to-date current weather conditions.
- **5-Day Forecast**: Plan ahead with detailed 5-day weather forecasts.
- **Location-Based Search**: Seamlessly search for weather in any city worldwide.
- **Responsive Design**: Beautiful and adaptive UI that looks great on mobile, tablet, and desktop.
- **Dark Mode Support**: Elegant dark theme integrated perfectly for night time use.
- **Glassmorphism UI**: High-end aesthetic with frosted glass effects and smooth micro-animations.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API**: [OpenWeatherMap API](https://openweathermap.org/api)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SihamNafie24/TP-Weather--App.git
   cd TP-Weather--App
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Copy the example `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your OpenWeatherMap API key:
   ```env
   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open-source and available under the MIT License.
