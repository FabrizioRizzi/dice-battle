import { useState, useEffect } from "react";
import "../styles/DiceRoller.css";
import { generateDicePhrase } from "../services/openaiService";

// Component to render dice dots based on value
const DiceDots = ({ value }) => {
  const renderDots = () => {
    switch (value) {
      case 1:
        return <div className="dot center"></div>;
      case 2:
        return (
          <>
            <div className="dot top-left"></div>
            <div className="dot bottom-right"></div>
          </>
        );
      case 3:
        return (
          <>
            <div className="dot top-left"></div>
            <div className="dot center"></div>
            <div className="dot bottom-right"></div>
          </>
        );
      case 4:
        return (
          <>
            <div className="dot top-left"></div>
            <div className="dot top-right"></div>
            <div className="dot bottom-left"></div>
            <div className="dot bottom-right"></div>
          </>
        );
      case 5:
        return (
          <>
            <div className="dot top-left"></div>
            <div className="dot top-right"></div>
            <div className="dot center"></div>
            <div className="dot bottom-left"></div>
            <div className="dot bottom-right"></div>
          </>
        );
      case 6:
        return (
          <>
            <div className="dot top-left"></div>
            <div className="dot top-right"></div>
            <div className="dot middle-left"></div>
            <div className="dot middle-right"></div>
            <div className="dot bottom-left"></div>
            <div className="dot bottom-right"></div>
          </>
        );
      default:
        return null;
    }
  };

  return <div className="dice-dots">{renderDots()}</div>;
};

const DiceRoller = ({ onRollResult }) => {
  const [player1Dice, setPlayer1Dice] = useState(1);
  const [player2Dice, setPlayer2Dice] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [animatingDice, setAnimatingDice] = useState(false);
  const [tempDice1, setTempDice1] = useState(1);
  const [tempDice2, setTempDice2] = useState(1);
  const [tieAnimation, setTieAnimation] = useState(false);
  const [aiPhrase, setAiPhrase] = useState("");
  const [phraseLoading, setPhraseLoading] = useState(false);

  // Effect to simulate multiple dice values during animation
  useEffect(() => {
    let animationInterval;
    if (animatingDice) {
      animationInterval = setInterval(() => {
        setTempDice1(Math.floor(Math.random() * 6) + 1);
        setTempDice2(Math.floor(Math.random() * 6) + 1);
      }, 100);
    }

    return () => {
      if (animationInterval) clearInterval(animationInterval);
    };
  }, [animatingDice]);

  const rollDice = () => {
    setRolling(true);
    setAnimatingDice(true);
    setWinner(null);
    setTieAnimation(false);
    setAiPhrase("");

    // Sound effect for rolling dice
    const playRollSound = () => {
      try {
        const audio = new Audio("/dice-roll.mp3"); // Add a sound file to your public directory
        audio.volume = 0.5;
        audio.play().catch((e) => console.log("Audio play failed:", e));
      } catch {
        console.log("Audio not supported");
      }
    };

    playRollSound();

    // Dice rolling animation duration
    setTimeout(() => {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;

      setAnimatingDice(false);
      setPlayer1Dice(dice1);
      setPlayer2Dice(dice2);
      // Play landing sound
      try {
        const audio = new Audio("/dice-land.mp3"); // Add a sound file to your public directory
        audio.volume = 0.6;
        audio.play().catch((e) => console.log("Audio play failed:", e));
      } catch {
        console.log("Audio not supported");
      }

      // Determine winner
      setTimeout(() => {
        let resultWinner;
        if (dice1 > dice2) {
          resultWinner = "Player 1";
          setWinner(resultWinner);
          onRollResult("player1");
        } else if (dice2 > dice1) {
          resultWinner = "Player 2";
          setWinner(resultWinner);
          onRollResult("player2");
        } else {
          resultWinner = "Tie";
          setWinner(resultWinner);
          setTieAnimation(true);
          onRollResult("tie");
        }

        // Generate AI phrase based on result
        setPhraseLoading(true);
        generateDicePhrase(dice1, dice2, resultWinner)
          .then((phrase) => {
            setAiPhrase(phrase);
            setPhraseLoading(false);
          })
          .catch((err) => {
            console.error("Failed to generate phrase:", err);
            setPhraseLoading(false);
          });

        setTimeout(() => {
          setRolling(false);
        }, 500);
      }, 600); // Delay winner announcement until bounce completes
    }, 1500);
  };

  // Determine dice container class based on animation state
  const getDiceContainerClass = (player) => {
    let className = `dice-container ${player}`;
    if (animatingDice) className += " rolling";
    return className;
  };

  // Determine dice class based on player and animation state
  const getDiceClass = (player) => {
    return `dice ${player === "player1" ? "player1" : "player2"}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 my-8">
      <div className="flex justify-center items-center gap-16">
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold mb-2">Player 1</div>
          <div className={getDiceContainerClass("player1")}>
            <div className={getDiceClass("player1")}>
              <DiceDots value={animatingDice ? tempDice1 : player1Dice} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-xl font-bold mb-2">Player 2</div>
          <div className={getDiceContainerClass("player2")}>
            <div className={getDiceClass("player2")}>
              <DiceDots value={animatingDice ? tempDice2 : player2Dice} />
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={rollDice}
        disabled={rolling}
        className="cursor-pointer arcade-button bg-purple-600 hover:bg-purple-700 text-white !text-white font-bold text-xl py-3 px-6 rounded-full disabled:opacity-50 transition-colors arcade-button"
      >
        {rolling ? "Rolling..." : "Roll Dice"}
      </div>

      {winner && !rolling && (
        <div
          className={`mt-4 text-2xl font-bold winner-announcement ${
            tieAnimation ? "shake-tie" : ""
          }`}
        >
          {winner === "Tie" ? "It's a tie!" : `${winner} wins!`}
        </div>
      )}

      {/* OpenAI Generated Phrase */}
      {(aiPhrase || phraseLoading) && (
        <div className="mt-4 text-xl text-yellow-300 ai-phrase-container">
          {phraseLoading ? (
            <span className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          ) : (
            <span className="ai-phrase">{aiPhrase}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
