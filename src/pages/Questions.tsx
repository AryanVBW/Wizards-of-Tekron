import React, { useEffect, useState } from 'react';
import { dataService } from '../lib/dataService';
import { LevelSystem } from '../components/LevelSystem';
import { toast } from 'react-hot-toast';
import { Wand2, Sparkles, Star } from 'lucide-react';

interface Question {
  level: number;
  title: string;
  description: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
}

export function QuestionsPage() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);

  useEffect(() => {
    const loadUserProgress = () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;

      const user = dataService.getUserByEmail(userEmail);
      if (!user) return;

      const team = dataService.getTeamById(user.id);
      if (team) {
        setCurrentLevel(team.current_level);
        setTotalPoints(team.total_points);
        
        // Load level-specific questions
        const levelQuestions = dataService.getTeamQuestions(team.id);
        setQuestions(levelQuestions);

        // Load completed questions
        const teamSubmissions = dataService.getTeamSubmissions(team.id);
        const completed = teamSubmissions
          .filter(sub => sub.status === 'success')
          .map(sub => sub.question_id);
        setCompletedQuestions(completed);
      }
    };

    loadUserProgress();
  }, []);

  const handleLevelUp = async (level: number) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    const user = dataService.getUserByEmail(userEmail);
    if (!user) return;

    const team = dataService.getTeamById(user.id);
    if (!team) return;

    const updatedTeam = dataService.updateTeam(team.id, {
      current_level: level,
      total_points: team.total_points + 100
    });

    if (updatedTeam) {
      setCurrentLevel(updatedTeam.current_level);
      setTotalPoints(updatedTeam.total_points);
      toast.success('Level up successful!');
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div 
        className="relative bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 overflow-hidden"
        style={{
          backgroundImage: "url('/hogwarts-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-600 text-transparent bg-clip-text flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-yellow-400" />
            Magical Challenges
          </h2>

          <LevelSystem
            currentLevel={currentLevel}
            totalPoints={totalPoints}
            onLevelUp={handleLevelUp}
          />

          <div className="mt-12 space-y-6">
            {questions.map((question) => (
              <div
                key={question.level}
                className={`p-6 rounded-xl border transform transition-all duration-300 hover:scale-[1.02] ${
                  question.level === currentLevel
                    ? 'bg-purple-900/40 border-purple-500/50 shadow-lg shadow-purple-500/20'
                    : question.level < currentLevel
                    ? 'bg-green-900/40 border-green-500/50'
                    : 'bg-black/40 border-white/10 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <h3 className="text-xl font-semibold text-white">
                    Challenge 1 of 5: {question.title}
                  </h3>
                </div>
                
                <p className="text-gray-300 mb-4">{question.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    +{question.points} points
                  </span>
                  <button
                    onClick={() => window.open(question.url, '_blank')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    Cast Your Spell
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
