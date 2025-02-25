import React, { useEffect, useState } from 'react';
import { dataService } from '../lib/dataService';

interface TeamRanking {
  id: string;
  team_name: string;
  total_points: number;
  current_level: number;
}

export function LeaderboardPage() {
  const [rankings, setRankings] = useState<TeamRanking[]>([]);

  const loadRankings = () => {
    const teams = dataService.getTeams();
    const sortedTeams = [...teams].sort((a, b) => b.total_points - a.total_points);
    setRankings(sortedTeams);
  };

  useEffect(() => {
    loadRankings();
    // Update rankings every 30 seconds
    const interval = setInterval(loadRankings, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Leaderboard
        </h2>
        <div className="space-y-4">
          {rankings.map((team, index) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
            >
              <div className="flex items-center gap-6">
                <span className="text-2xl font-bold text-purple-400">#{index + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold text-white">{team.team_name}</h3>
                  <p className="text-gray-400">Level {team.current_level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-purple-400">{team.total_points} pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
