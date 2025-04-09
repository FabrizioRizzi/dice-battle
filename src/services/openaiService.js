import OpenAI from 'openai';

// Initialize OpenAI client
// Note: You'll need to add your API key to your environment variables
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Check for API key presence
if (!apiKey) {
  console.warn('OpenAI API key is missing. AI features will use fallback responses.');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Only use this in development; for production, use a backend proxy
});

// Simple cache for API responses
const phraseCache = new Map();
const CACHE_SIZE_LIMIT = 50; // Limit cache size to avoid memory issues

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // milliseconds

// Model configuration options
const MODEL_OPTIONS = {
  default: 'gpt-3.5-turbo', // Default model
  economy: 'gpt-3.5-turbo-instruct', // More cost-effective
  premium: 'gpt-4', // Higher quality but more expensive
};

// Default settings
const settings = {
  model: MODEL_OPTIONS.default,
  temperature: 0.7,
  maxTokens: 30,
};

// Token usage tracking
const tokenUsage = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
  apiCalls: 0,
  lastReset: Date.now()
};

/**
 * Update OpenAI configuration settings
 * 
 * @param {Object} newSettings - New settings to apply
 * @param {string} newSettings.model - OpenAI model to use
 * @param {number} newSettings.temperature - Temperature parameter (0-1)
 * @param {number} newSettings.maxTokens - Maximum tokens to generate
 * @returns {Object} Current settings after update
 */
export const updateSettings = (newSettings = {}) => {
  if (newSettings.model && MODEL_OPTIONS[newSettings.model]) {
    settings.model = MODEL_OPTIONS[newSettings.model];
  } else if (newSettings.model) {
    settings.model = newSettings.model;
  }
  
  if (typeof newSettings.temperature === 'number') {
    settings.temperature = Math.max(0, Math.min(1, newSettings.temperature));
  }
  
  if (typeof newSettings.maxTokens === 'number') {
    settings.maxTokens = Math.max(1, Math.min(500, newSettings.maxTokens));
  }
  
  return { ...settings };
};

/**
 * Get current OpenAI API settings
 * 
 * @returns {Object} Current settings
 */
export const getSettings = () => {
  return { ...settings };
};

/**
 * Generates a phrase related to dice roll results using OpenAI
 * 
 * @param {number} player1Dice - The value rolled by player 1
 * @param {number} player2Dice - The value rolled by player 2
 * @param {string} winner - The winner of the roll ('Player 1', 'Player 2', or 'Tie')
 * @param {number} retryCount - Current retry attempt (internal use)
 * @returns {Promise<string>} A phrase related to the dice roll result
 */
export const generateDicePhrase = async (player1Dice, player2Dice, winner, retryCount = 0) => {
  // If no API key, return a fallback phrase immediately
  if (!apiKey) {
    return getFallbackPhrase(player1Dice, player2Dice, winner);
  }
  
  // Create a cache key based on the dice values and winner
  const cacheKey = `${player1Dice}-${player2Dice}-${winner}-${settings.model}`;
  
  // Check if we have a cached response
  if (phraseCache.has(cacheKey)) {
    console.log('Using cached phrase for dice roll combination');
    return phraseCache.get(cacheKey);
  }

  try {
    // Create a prompt based on the dice roll results
    let prompt = `Generate a short, fun phrase (maximum 10 words) for a dice game where Player 1 rolled a ${player1Dice}, 
    Player 2 rolled a ${player2Dice}, and ${winner === 'Tie' ? "it's a tie" : `${winner} wins`}.
    The phrase should be entertaining and relate to the dice results in some way.`;

    const response = await openai.chat.completions.create({
      model: settings.model,
      messages: [
        {
          role: "system",
          content: "You are a witty game commentator who creates short, engaging phrases for dice game results."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: settings.maxTokens,
      temperature: settings.temperature,
    });

    // Track token usage
    updateTokenUsage(response.usage);

    const phrase = response.choices[0].message.content.trim();
    
    // Cache the result
    cacheResult(cacheKey, phrase);
    
    return phrase;
  } catch (error) {
    // Determine if we should retry based on the error type
    const isRetryableError = error.status === 429 || // Rate limit
                             error.status >= 500 ||  // Server errors
                             error.code === 'ECONNRESET' || 
                             error.code === 'ETIMEDOUT';
                             
    if (isRetryableError && retryCount < MAX_RETRIES) {
      console.log(`API call failed. Retrying (${retryCount + 1}/${MAX_RETRIES})...`);
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      // Retry with incremented counter
      return generateDicePhrase(player1Dice, player2Dice, winner, retryCount + 1);
    }
    
    console.error('Error generating dice phrase:', error);
    return getFallbackPhrase(player1Dice, player2Dice, winner);
  }
};

/**
 * Cache a response with proper size management
 * 
 * @param {string} key - The cache key
 * @param {string} value - The value to cache
 */
function cacheResult(key, value) {
  // If cache is at capacity, remove oldest entry
  if (phraseCache.size >= CACHE_SIZE_LIMIT) {
    const oldestKey = phraseCache.keys().next().value;
    phraseCache.delete(oldestKey);
  }
  
  // Add new entry
  phraseCache.set(key, value);
}

/**
 * Update token usage statistics
 * 
 * @param {Object} usage - Token usage data from OpenAI API response
 */
function updateTokenUsage(usage) {
  if (!usage) return;
  
  tokenUsage.promptTokens += usage.prompt_tokens || 0;
  tokenUsage.completionTokens += usage.completion_tokens || 0;
  tokenUsage.totalTokens += usage.total_tokens || 0;
  tokenUsage.apiCalls += 1;
}

/**
 * Get current token usage statistics
 * 
 * @returns {Object} Current token usage data
 */
export const getTokenUsage = () => {
  return {
    ...tokenUsage,
    sinceLastReset: Math.floor((Date.now() - tokenUsage.lastReset) / 1000 / 60) + ' minutes'
  };
};

/**
 * Reset token usage statistics
 */
export const resetTokenUsage = () => {
  tokenUsage.promptTokens = 0;
  tokenUsage.completionTokens = 0;
  tokenUsage.totalTokens = 0;
  tokenUsage.apiCalls = 0;
  tokenUsage.lastReset = Date.now();
};

/**
 * Returns a fallback phrase if the API call fails
 * 
 * @param {number} player1Dice - The value rolled by player 1
 * @param {number} player2Dice - The value rolled by player 2
 * @param {string} winner - The winner of the roll
 * @returns {string} A fallback phrase
 */
function getFallbackPhrase(player1Dice, player2Dice, winner) {
  const phrases = [
    'Roll the dice of destiny!',
    `${winner === 'Tie' ? 'Evenly matched!' : `${winner} takes the round!`}`,
    'Fortune favors the bold roller!',
    'The dice have spoken!',
    `${Math.max(player1Dice, player2Dice)} beats ${Math.min(player1Dice, player2Dice)}. Next round!`,
  ];
  
  return phrases[Math.floor(Math.random() * phrases.length)];
}