import React from 'react';

const Scoreboard = ({ player1Score, player2Score, onReset }) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Scoreboard</h2>
      
      <div className="flex justify-between items-center">
        <div className="text-center px-6">
          <div className="text-red-400 text-lg font-medium">Player 1</div>
          <div className="text-4xl font-bold mt-1">{player1Score}</div>
        </div>
        
        <div className="text-xl font-bold mx-4">vs</div>
        
        <div className="text-center px-6">
          <div className="text-blue-400 text-lg font-medium">Player 2</div>
          <div className="text-4xl font-bold mt-1">{player2Score}</div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <div 
          onClick={onReset}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded transition-colors cursor-pointer arcade-button"
        >
          New Game
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;