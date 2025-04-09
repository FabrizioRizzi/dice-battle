# Changelog

All notable changes to the Dice Battle project will be documented in this file.

## [0.4.0] - 2025-04-09

### Added
- Enhanced OpenAI API implementation with several improvements:
  - API key validation and improved error handling
  - Response caching system to reduce API calls and costs
  - Automatic retry mechanism for transient API errors
  - Token usage monitoring and statistics
  - Debug UI panel for development with usage metrics
  - Model configuration options (economy, default, premium)
  - Temperature and token limit adjustments via UI

### Changed
- Refactored openaiService.js for better maintainability
- Updated App component to include the new debug panel

## [0.3.0] - 2025-04-09

### Added
- Integrated OpenAI API to generate phrases related to dice roll results
- New service to handle OpenAI API interactions
- Loading animation for phrase generation
- Visual effects for AI-generated phrases
- Environment variable configuration for API key security

## [0.2.0] - 2025-04-09

### Added
- Advanced dice rolling animations with 3D effects
- Dice face representation using dots instead of numbers
- Bounce animation when dice land after rolling
- Special "shake" animation for tie results
- Sound effects framework for dice rolling and landing
- CSS animations for winner announcements
- Custom styling for dice with gradient colors

### Changed
- Enhanced DiceRoller component with animated state transitions
- Improved visual feedback during dice rolls
- Better timing for result announcements
- Updated dice appearance with 3D perspective

## [0.1.0] - 2025-04-09

### Added
- Initial project setup with React 19 and Vite
- TailwindCSS 4.1 configuration
- Basic project structure with placeholder components
- Project documentation files (PRD, checklist, outline)
- DiceRoller component with dice rolling logic
- Scoreboard component for tracking player scores
- App structure with game mechanics implementation
- Basic arcade-style CSS animations

### Changed
- Modified src/index.css to include Tailwind directives
- Updated App.jsx to integrate all components
- Enhanced App.css with arcade-style animations

### Setup completed
- ✅ Create a new React 19 project using Vite
- ✅ Install and configure TailwindCSS 4.1
- ✅ Create app structure with main components
- ✅ Implement dice roll logic using Math.random()
- ✅ Create UI for dice rolling and score display
- ✅ Implement winner determination