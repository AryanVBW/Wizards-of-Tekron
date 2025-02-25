import React, { useEffect, useState } from 'react';
import { dataService } from '../lib/dataService';
import { LevelSystem } from './LevelSystem';
import { Trophy, Star, Clock, Users } from 'lucide-react';

interface TeamStats {
  rank: number;
  totalTeams: number;
  timeSpent: string;
  achievements: string[];
}

export function TeamDashboard() {
  interface TeamProfile {
    id: string;
    team_name: string;
    status: 'active' | 'disqualified' | 'spam';
    current_level: number;
    total_points: number;
  }

  const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStats>({
    rank: 0,
    totalTeams: 20,
    timeSpent: '0h 0m',
    achievements: []
  });
  interface TeamSubmission {
    id: string;
    team_id: string;
    level: number;
    submission_type: 'code' | 'qr_verification';
    status: 'success' | 'failed' | 'pending';
    points: number;
    created_at: string;
  }

  const [submissions, setSubmissions] = useState<TeamSubmission[]>([]);

  useEffect(() => {
    loadTeamProfile();
    loadSubmissions();
  }, []);

  async function loadTeamProfile() {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('No user email found');
        return;
      }

      const user = dataService.getUserByEmail(userEmail);
      if (!user) {
        console.error('No user found for email:', userEmail);
        return;
      }

      // Create team profile if it doesn't exist
      let profile = dataService.getTeamById(user.id);
      if (!profile) {
        profile = dataService.createTeam({
          team_name: user.email.split('@')[0],
          status: 'active',
          current_level: 1,
          total_points: 0
        });
      }

      setTeamProfile(profile);

      // Load team statistics
      const teams = dataService.getTeams();
      const sortedTeams = [...teams].sort((a, b) => b.total_points - a.total_points);
      const rank = sortedTeams.findIndex(team => team.id === profile.id) + 1;

      // Calculate time spent (mock data for now)
      const timeSpent = `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`;

      // Calculate achievements
      const achievements = [];
      if (profile.total_points >= 300) achievements.push('Point Master');
      if (profile.current_level >= 3) achievements.push('Level Expert');
      if (rank <= 3) achievements.push('Top Performer');

      setTeamStats(prev => ({
        ...prev,
        rank,
        totalTeams: teams.length,
        timeSpent,
        achievements
      }));
    } catch (error) {
      console.error('Error loading team profile:', error);
    }
  }

  async function loadSubmissions() {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;

      const user = dataService.getUserByEmail(userEmail);
      if (!user) return;

      const allSubmissions = dataService.getSubmissions();
      const teamSubmissions = allSubmissions.filter(sub => sub.team_id === user.id);
      setSubmissions(teamSubmissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error('Error loading submissions:', error);
      setSubmissions([]);
    }
  }

  if (!teamProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Team Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            {teamProfile.team_name}
          </h2>
          <p className="text-gray-400">Level {teamProfile.current_level} Team</p>
        </div>
        <div className="flex items-center gap-2">
          {teamStats.achievements.map((achievement, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm"
            >
              {achievement}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-gray-300 font-medium">Current Rank</h3>
          </div>
          <p className="text-3xl font-bold text-white">{teamStats.rank}/{teamStats.totalTeams}</p>
        </div>
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-purple-400" />
            <h3 className="text-gray-300 font-medium">Total Points</h3>
          </div>
          <p className="text-3xl font-bold text-white">{teamProfile.total_points}</p>
        </div>
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-gray-300 font-medium">Time Spent</h3>
          </div>
          <p className="text-3xl font-bold text-white">{teamStats.timeSpent}</p>
        </div>
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="text-gray-300 font-medium">Submissions</h3>
          </div>
          <p className="text-3xl font-bold text-white">{submissions.length}</p>
        </div>
      </div>

      {/* Level System */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Level Progress
        </h3>
        <LevelSystem
          currentLevel={teamProfile.current_level}
          totalPoints={teamProfile.total_points}
          onLevelUp={async (level: number) => {
            try {
              const updatedProfile = dataService.updateTeam(teamProfile.id, {
                current_level: level,
                total_points: teamProfile.total_points + 100
              });
              if (updatedProfile) {
                setTeamProfile(updatedProfile);
              }
            } catch (error) {
              console.error('Error updating level:', error);
            }
          }}
        />
      </div>

      {/* Recent Submissions */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Recent Submissions
        </h3>
        <div className="space-y-4">
          {submissions.slice(0, 5).map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div>
                <h4 className="font-medium">Level {submission.level} Submission</h4>
                <p className="text-sm text-gray-400">
                  {new Date(submission.created_at).toLocaleDateString()} at{' '}
                  {new Date(submission.created_at).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    submission.status === 'success'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {submission.status}
                </span>
                <span className="text-purple-400 font-bold">+{submission.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}