
import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

interface QuoteItem {
  text: string;
  author: string;
}

// Collection of inspirational quotes
const quotes: QuoteItem[] = [
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
  { text: "The present is theirs; the future, for which I really worked, is mine.", author: "Nikola Tesla" },
  { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
  { text: "An intellectual says a simple thing in a hard way. An artist says a hard thing in a simple way.", author: "Charles Bukowski" },
  { text: "The unexamined life is not worth living.", author: "Sokrates" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Reality is merely an illusion, albeit a very persistent one.", author: "Albert Einstein" },
  { text: "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.", author: "Nikola Tesla" },
  { text: "Failure is an option here. If things are not failing, you are not innovating enough.", author: "Elon Musk" },
  { text: "We are here to drink beer and kick ass.", author: "Charles Bukowski" },
  { text: "I cannot teach anybody anything, I can only make them think.", author: "Sokrates" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein" },
  { text: "Let the future tell the truth, and evaluate each one according to his work and accomplishments.", author: "Nikola Tesla" },
  { text: "I think it is possible for ordinary people to choose to be extraordinary.", author: "Elon Musk" },
  { text: "What matters most is how well you walk through the fire.", author: "Charles Bukowski" },
  { text: "The secret of change is to focus all of your energy, not on fighting the old, but on building the new.", author: "Sokrates" },
  { text: "The people who are crazy enough to think they can change the world are the ones who do.", author: "Steve Jobs" },
  { text: "Logic will get you from A to Z; imagination will get you everywhere.", author: "Albert Einstein" }
];

const QuoteRotator: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<QuoteItem>(quotes[Math.floor(Math.random() * quotes.length)]);
  
  useEffect(() => {
    // Change quote every 30 seconds
    const interval = setInterval(() => {
      let newQuote: QuoteItem;
      do {
        newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      } while (newQuote.text === currentQuote.text); // Ensure we get a different quote
      
      setCurrentQuote(newQuote);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentQuote]);
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-800/20 to-indigo-800/20 rounded-lg mb-4 backdrop-blur-sm border border-purple-500/20">
      <div className="relative flex items-center text-center">
        <Quote className="text-purple-400 absolute -left-6 -top-6 opacity-50 w-5 h-5 rotate-180" />
        <p className="text-white font-medium italic text-lg sm:text-xl px-8 py-2">
          {currentQuote.text}
        </p>
        <Quote className="text-purple-400 absolute -right-6 -bottom-6 opacity-50 w-5 h-5" />
      </div>
      <p className="text-purple-300 text-sm mt-2">— {currentQuote.author}</p>
    </div>
  );
};

export default QuoteRotator;
