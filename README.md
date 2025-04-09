# Dice Battle

An interactive dice game built with React 19, Vite, and TailwindCSS 4.1 featuring AI-powered commentary using OpenAI.

![Dice Battle Game](https://github.com/user/dice-battle/raw/main/public/preview.png)

## Features

- 🎲 Interactive 3D dice rolling with animations
- 🏆 Player score tracking system
- 🤖 AI-generated commentary for each roll using OpenAI
- 🎮 Arcade-style visual effects and animations
- 🔊 Sound effects for dice rolling and results
- 📱 Responsive design for all screen sizes
- 🛠️ Development tools for API usage monitoring

## Technology Stack

- React 19
- Vite
- TailwindCSS 4.1
- OpenAI API

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dice-battle.git
   cd dice-battle
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Game Rules

1. Click the "Roll" button to roll the dice
2. Player 1 and Player 2 each roll one die
3. The player with the higher number wins the round
4. If both players roll the same number, it's a tie
5. The scoreboard keeps track of each player's wins
6. Click "Reset Scores" to start over

## OpenAI Integration

The game uses the OpenAI API to generate unique commentary for each dice roll. Key features include:

- Response caching to reduce API calls and costs
- Automatic retry mechanism for API errors
- Token usage monitoring
- Debug panel for development (only visible in development mode)
- Configurable AI models (economy, default, premium)

To access the debug panel during development, look for the "Show AI Debug" button in the bottom right corner of the screen.

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

### Project Structure

```
dice-battle/
├── public/            # Static assets
│   └── sounds/        # Game sound effects
├── src/
│   ├── assets/        # Project assets
│   ├── components/    # React components
│   ├── services/      # Service modules
│   └── styles/        # Component-specific styles
└── ...
```

## License

MIT

## Acknowledgements

- OpenAI for the API
- Dice icons and sound effects from [source]
- Inspiration from classic dice games
