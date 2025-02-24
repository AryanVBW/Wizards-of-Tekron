import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertTriangle, Ban, Flag, History, MinusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TeamProfile {
  id: string;
  team_name: string;
  status: 'active' | 'disqualified' | 'spam';
  current_level: number;
  total_points: number;
}

interface TeamSubmission {
  id: string;
  team_id: string;
  level: number;
  submission_type: 'code' | 'qr_verification';
  status: 'success' | 'failed' | 'pending';
  points: number;
  created_at: string;
}

export function AdminPanel() {
  const [teams, setTeams] = useState<TeamProfile[]>([]);
  const [submissions, setSubmissions] = useState<TeamSubmission[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [penaltyPoints, setPenaltyPoints] = useState<number>(0);
  const [penaltyReason, setPenaltyReason] = useState<string>('');

  useEffect(() => {
    loadTeams();
    loadSubmissions();
  }, []);

  async function loadTeams() {
    const { data, error } = await supabase
      .from('team_profiles')
      .select('*')
      .order('team_name');
    
    if (error) {
      toast.error('Failed to load teams');
      return;
    }
    setTeams(data);
  }

  async function loadSubmissions() {
    const { data, error } = await supabase
      .from('team_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      toast.error('Failed to load submissions');
      return;
    }
    setSubmissions(data);
  }

  async function applyPenalty() {
    if (!selectedTeam || !penaltyPoints || !penaltyReason) {
      toast.error('Please fill in all penalty details');
      return;
    }

    const { error: penaltyError } = await supabase
      .from('team_penalties')
      .insert({
        team_id: selectedTeam,
        points_deducted: penaltyPoints,
        reason: penaltyReason,
      });

    if (penaltyError) {
      toast.error('Failed to apply penalty');
      return;
    }

    const { error: updateError } = await supabase
      .from('team_profiles')
      .update({
        total_points: supabase.raw(`total_points - ${penaltyPoints}`),
      })
      .eq('id', selectedTeam);

    if (updateError) {
      toast.error('Failed to update team points');
      return;
    }

    toast.success('Penalty applied successfully');
    loadTeams();
    setPenaltyPoints(0);
    setPenaltyReason('');
  }

  async function updateTeamStatus(teamId: string, status: 'active' | 'disqualified' | 'spam') {
    const { error } = await supabase
      .from('team_profiles')
      .update({ status })
      .eq('id', teamId);

    if (error) {
      toast.error(`Failed to update team status`);
      return;
    }

    toast.success(`Team ${status} successfully`);
    loadTeams();
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-2xl border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">Admin Control Panel</h2>
        <p className="text-purple-200">Manage teams, track submissions, and maintain fair play</p>
      </div>

      {/* Penalty System */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-purple-300">Apply Penalty</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedTeam || ''}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white"
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.team_name}</option>
            ))}
          </select>
          <input
            type="number"
            value={penaltyPoints}
            onChange={(e) => setPenaltyPoints(parseInt(e.target.value))}
            placeholder="Points to Deduct"
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white"
          />
          <input
            type="text"
            value={penaltyReason}
            onChange={(e) => setPenaltyReason(e.target.value)}
            placeholder="Reason"
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white"
          />
        </div>
        <button
          onClick={applyPenalty}
          className="mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold transition-colors duration-200"
        >
          Apply Penalty
        </button>
      </div>

      {/* Teams List */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-purple-300">Teams Overview</h3>
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
              <div>
                <h4 className="font-semibold text-white">{team.team_name}</h4>
                <p className="text-sm text-gray-400">
                  Level {team.current_level} • {team.total_points} Points
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateTeamStatus(team.id, 'spam')}
                  className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition-colors duration-200"
                  title="Mark as Spam"
                >
                  <Flag className="w-5 h-5" />
                </button>
                <button
                  onClick={() => updateTeamStatus(team.id, 'disqualified')}
                  className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                  title="Disqualify Team"
                >
                  <Ban className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Logs */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-purple-300">Recent Submissions</h3>
        <div className="space-y-4">
          {submissions.map((submission) => {
            const team = teams.find(t => t.id === submission.team_id);
            return (
              <div key={submission.id} className="bg-white/5 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{team?.team_name || 'Unknown Team'}</h4>
                    <p className="text-sm text-gray-400">
                      Level {submission.level} • {submission.submission_type} • {submission.points} Points
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    submission.status === 'success' ? 'bg-green-500/20 text-green-400' :
                    submission.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {submission.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(submission.created_at).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}