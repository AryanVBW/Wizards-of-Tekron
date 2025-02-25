import React, { useState } from 'react';
import { dataService } from '../lib/dataService';
import { Wand2, KeyRound, ExternalLink, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LevelSystemProps {
  currentLevel: number;
  totalPoints: number;
  onLevelUp: (level: number) => Promise<void>;
}

const TOTAL_LEVELS = 5;

export function LevelSystem({ currentLevel, totalPoints, onLevelUp }: LevelSystemProps) {
  const [isSubmittingKey, setIsSubmittingKey] = useState(false);
  const [levelUpKey, setLevelUpKey] = useState('');

  const levelTitles = [
    "The Sorcerer's Algorithm",           // Level 1
    "Chamber of Binary Secrets",          // Level 2
    "Prisoner of Recursion",              // Level 3
    "Goblet of Code",                     // Level 4
    "Order of the Programmers",           // Level 5
  ];

  const handleKeySubmission = async () => {
    setIsSubmittingKey(true);
    try {
      const levelKeys = dataService.getLevelKeys();
      const validKey = levelKeys.find(key => 
        key.level === currentLevel && 
        key.key === levelUpKey.trim() && 
        key.is_valid
      );

      if (validKey) {
        // Get current user's email from localStorage
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) throw new Error('User not logged in');

        const user = dataService.getUserByEmail(userEmail);
        if (!user) throw new Error('User not found');

        dataService.createSubmission({
          team_id: user.id,
          level: currentLevel,
          submission_type: 'code',
          status: 'success',
          points: 100
        });

        const nextLevel = currentLevel + 1;
        await onLevelUp(nextLevel);
        toast.success('Level completed! Welcome to the next challenge!');
        setLevelUpKey('');
      } else {
        toast.error('Invalid key! Try again, young wizard.');
      }
    } catch (error) {
      toast.error('Something went wrong! The magic failed temporarily.');
    } finally {
      setIsSubmittingKey(false);
    }
  };

  const redirectToQuestion = () => {
    const questionUrls = {
      1: 'https://www.hackerrank.com/challenges/lumos-maxima',
      2: 'https://www.hackerrank.com/challenges/alohomora-binary',
      3: 'https://www.hackerrank.com/challenges/expecto-recursion',
      4: 'https://www.hackerrank.com/challenges/goblet-code',
      5: 'https://www.hackerrank.com/challenges/order-programmers',



    };

    const url = questionUrls[currentLevel as keyof typeof questionUrls] || 'https://www.hackerrank.com/contests/wizards-of-tekron';
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Level Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl border border-purple-500/20 p-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=2078')] bg-cover bg-center opacity-5" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Wand2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Level {currentLevel}: {levelTitles[currentLevel - 1]}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">
              {totalPoints} Points
            </span>
            <span className="text-sm">
              Challenge {currentLevel} of 25
            </span>
          </div>
        </div>
      </div>

      {/* Level Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Question Section */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-300">Current Challenge</h3>
            <p className="text-gray-300">
              Young wizard, your next trial awaits at Level {currentLevel}! Click below to access your unique coding challenge.
              Remember, each spell (solution) must be cast with precision and care. Once you've mastered the challenge,
              you'll receive a Level Up Key to proceed to the next magical level.
            </p>
            <div className="flex flex-col gap-4 mt-6">
              <button
                onClick={redirectToQuestion}
                className="w-full group relative px-6 py-3 rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Solve the Question
                </span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Key Submission Section */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-300">Level Up Key</h3>
            <p className="text-gray-300">
              Once you've completed your challenge, enter the Level Up Key you received to proceed to the next chamber.
            </p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={levelUpKey}
                onChange={(e) => setLevelUpKey(e.target.value)}
                placeholder="Enter your Level Up Key"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 transition-all duration-200"
              />
            </div>
            <button
              onClick={handleKeySubmission}
              disabled={isSubmittingKey || !levelUpKey}
              className="w-full group relative px-6 py-3 rounded-xl overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                Submit Key
                <ArrowRight className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}