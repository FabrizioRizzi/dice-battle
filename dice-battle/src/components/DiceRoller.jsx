import { useState } from 'react';

const DiceRoller = ({ onRollResult }) => {
  const [player1Dice, setPlayer1Dice] = useState(1);
  const [player2Dice, setPlayer2Dice] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState(null);

  const rollDice = () => {
    setRolling(true);
    // Simulate dice rolling animation
    setTimeout(() => {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      
      setPlayer1Dice(dice1);
      setPlayer2Dice(dice2);
      
      // Determine winner
      if (dice1 > dice2) {
        setWinner('Player 1');
        onRollResult('player1');
      } else if (dice2 > dice1) {
        setWinner('Player 2');
        onRollResult('player2');
      } else {
        setWinner('Tie');
        onRollResult('tie');
      }
      
      setRolling(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-8 my-8">
      <div className="flex justify-center items-center gap-16">
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold mb-2">Player 1</div>
          <div className={`w-24 h-24 bg-red-500 rounded-xl flex items-center justify-center text-white text-4xl font-bold ${rolling ? 'animate-bounce' : ''}`}>
            {player1Dice}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold mb-2">Player 2</div>
          <div className={`w-24 h-24 bg-blue-500 rounded-xl flex items-center justify-center text-white text-4xl font-bold ${rolling ? 'animate-bounce' : ''}`}>
            {player2Dice}
          </div>
        </div>
      </div>
      
      <button 
        onClick={rollDice}
        disabled={rolling}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl py-3 px-6 rounded-full disabled:opacity-50 transition-colors"
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>
      
      {winner && !rolling && (
        <div className="mt-4 text-2xl font-bold">
          {winner === 'Tie' ? "It's a tie!" : `${winner} wins!`}
        </div>
      )}
    </div>
  );
};

export default DiceRoller;