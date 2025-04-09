import { useState } from 'react'
import './App.css'
import DiceRoller from './components/DiceRoller'
import Scoreboard from './components/Scoreboard'

function App() {
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)

  const handleRollResult = (result) => {
    if (result === 'player1') {
      setPlayer1Score(player1Score + 1)
    } else if (result === 'player2') {
      setPlayer2Score(player2Score + 1)
    }
    // No score change for ties
  }

  const handleReset = () => {
    setPlayer1Score(0)
    setPlayer2Score(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">Dice Battle</h1>
          <p className="text-xl text-gray-300">Roll the dice and see who wins!</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Scoreboard 
              player1Score={player1Score} 
              player2Score={player2Score}
              onReset={handleReset}
            />
          </div>

          <DiceRoller onRollResult={handleRollResult} />
        </div>
      </div>
    </div>
  )
}

export default App
