import React, { useEffect, useState } from 'react';
import { dataService } from '../lib/dataService';
import { 
  AlertTriangle, Ban, Flag, History, MinusCircle, 
  Wand2, Trophy, Star, Shield, Sparkles, Crown,
  ArrowUp, Gift, Key
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'team_leader';
  created_at: string;
}

interface TeamProfile {
  id: string;
  name: string;
  leader_email: string;
  status?: 'active' | 'disqualified' | 'spam';
  current_level: number;
  total_points: number;
  created_at: string;
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

interface LevelKey {
  id: string;
  level: number;
  key: string;
  is_valid: boolean;
}

export function AdminPanel() {
  const [teams, setTeams] = useState<TeamProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<TeamSubmission[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [penaltyPoints, setPenaltyPoints] = useState<number>(0);
  const [penaltyReason, setPenaltyReason] = useState<string>('');
  const [bonusPoints, setBonusPoints] = useState<number>(0);
  const [bonusReason, setBonusReason] = useState<string>('');
  const [newLevelKey, setNewLevelKey] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [levelKeys, setLevelKeys] = useState<LevelKey[]>([]);

  useEffect(() => {
    loadTeams();
    loadUsers();
    loadSubmissions();
    loadLevelKeys();
  }, []);

  const loadUsers = () => {
    const users = dataService.getUsers();
    setUsers(users);
  };

  async function loadTeams() {
    try {
      const data = dataService.getTeams();
      setTeams(data.sort((a, b) => a.team_name.localeCompare(b.team_name)));
    } catch (error) {
      toast.error('Failed to load teams');
    }
  }

  async function loadSubmissions() {
    try {
      const data = dataService.getSubmissions();
      setSubmissions(data.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 50));
    } catch (error) {
      toast.error('Failed to load submissions');
    }
  }

  async function loadLevelKeys() {
    try {
      const data = dataService.getLevelKeys();
      setLevelKeys(data.sort((a, b) => a.level - b.level));
    } catch (error) {
      toast.error('Failed to load level keys');
    }
  }

  async function applyPenalty() {
    if (!selectedTeam || !penaltyPoints || !penaltyReason) {
      toast.error('Please fill in all penalty details');
      return;
    }

    try {
      // Create penalty submission
      dataService.createSubmission({
        team_id: selectedTeam,
        level: 0, // Penalties don't correspond to a level
        submission_type: 'code',
        status: 'success',
        points: -penaltyPoints
      });

      // Update team points
      const team = dataService.getTeamById(selectedTeam);
      if (!team) {
        toast.error('Team not found');
        return;
      }

      const updatedTeam = dataService.updateTeam(selectedTeam, {
        total_points: team.total_points - penaltyPoints
      });

      if (!updatedTeam) {
        toast.error('Failed to update team points');
        return;
      }

      toast.success('Penalty applied successfully');
      loadTeams();
      setPenaltyPoints(0);
      setPenaltyReason('');
    } catch (error) {
      toast.error('Failed to apply penalty');
    }
  }

  async function awardBonus() {
    if (!selectedTeam || !bonusPoints || !bonusReason) {
      toast.error('Please fill in all bonus details');
      return;
    }

    try {
      // Create bonus submission
      dataService.createSubmission({
        team_id: selectedTeam,
        level: 0, // Bonuses don't correspond to a level
        submission_type: 'code',
        status: 'success',
        points: bonusPoints
      });

      // Update team points
      const team = dataService.getTeamById(selectedTeam);
      if (!team) {
        toast.error('Team not found');
        return;
      }

      const updatedTeam = dataService.updateTeam(selectedTeam, {
        total_points: team.total_points + bonusPoints
      });

      if (!updatedTeam) {
        toast.error('Failed to update team points');
        return;
      }

      toast.success('Bonus points awarded successfully');
      loadTeams();
      setBonusPoints(0);
      setBonusReason('');
    } catch (error) {
      toast.error('Failed to award bonus points');
    }
  }

  async function addLevelKey() {
    if (!newLevelKey || !selectedLevel) {
      toast.error('Please provide both level and key');
      return;
    }

    try {
      dataService.createLevelKey({
        level: selectedLevel,
        key: newLevelKey,
        is_valid: true
      });

      toast.success('Level key added successfully');
      loadLevelKeys();
      setNewLevelKey('');
    } catch (error) {
      toast.error('Failed to add level key');
    }
  }

  async function updateTeamStatus(teamId: string, status: 'active' | 'disqualified' | 'spam') {
    try {
      const updatedTeam = dataService.updateTeam(teamId, { status });
      if (!updatedTeam) {
        toast.error('Failed to update team status');
        return;
      }

      toast.success(`Team ${status} successfully`);
      loadTeams();
    } catch (error) {
      toast.error('Failed to update team status');
    }
  }

  async function updateTeamLevel(teamId: string, newLevel: number) {
    try {
      const updatedTeam = dataService.updateTeam(teamId, { current_level: newLevel });
      if (!updatedTeam) {
        toast.error('Failed to update team level');
        return;
      }

      toast.success('Team level updated successfully');
      loadTeams();
    } catch (error) {
      toast.error('Failed to update team level');
    }
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-2xl border border-purple-500/20">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Headmaster's Control Panel</h2>
        </div>
        <p className="text-purple-200">Manage teams, track submissions, and maintain order in the magical realm</p>
      </div>

      {/* Level Key Management */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-semibold text-purple-300">Level Keys</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white"
          >
            {[1, 2, 3, 4, 5].map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
          <input
            type="text"
            value={newLevelKey}
            onChange={(e) => setNewLevelKey(e.target.value)}
            placeholder="New Level Key"
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white"
          />
          <button
            onClick={addLevelKey}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-colors duration-200"
          >
            Add Key
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {levelKeys.map(key => (
            <div key={key.id} className="bg-white/5 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-purple-300">Level {key.level}</span>
                <span className="text-white font-mono">{key.key}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Management */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Wand2 className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-semibold text-purple-300">Team Management</h3>
        </div>
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-white/5 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{team.name}</h4>
                  <p className="text-sm text-gray-400">
                    Level {team.current_level} • {team.total_points} Points
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateTeamLevel(team.id, Math.min(5, team.current_level + 1))}
                    className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors duration-200"
                    title="Level Up"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedTeam(team.id)}
                    className="p-2 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition-colors duration-200"
                    title="Award/Deduct Points"
                  >
                    <Star className="w-5 h-5" />
                  </button>
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
            </div>
          ))}
        </div>
      </div>

      {/* Points Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Penalty System */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <MinusCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-xl font-semibold text-purple-300">Apply Penalty</h3>
          </div>
          <div className="space-y-4">
            <select
              value={selectedTeam || ''}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={penaltyPoints}
              onChange={(e) => setPenaltyPoints(parseInt(e.target.value))}
              placeholder="Points to Deduct"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
            />
            <input
              type="text"
              value={penaltyReason}
              onChange={(e) => setPenaltyReason(e.target.value)}
              placeholder="Reason"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
            />
            <button
              onClick={applyPenalty}
              className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold transition-colors duration-200"
            >
              Apply Penalty
            </button>
          </div>
        </div>

        {/* Bonus System */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-5 h-5 text-green-400" />
            <h3 className="text-xl font-semibold text-purple-300">Award Bonus</h3>
          </div>
          <div className="space-y-4">
            <select
              value={selectedTeam || ''}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={bonusPoints}
              onChange={(e) => setBonusPoints(parseInt(e.target.value))}
              placeholder="Bonus Points"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
            />
            <input
              type="text"
              value={bonusReason}
              onChange={(e) => setBonusReason(e.target.value)}
              placeholder="Reason"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
            />
            <button
              onClick={awardBonus}
              className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-semibold transition-colors duration-200"
            >
              Award Bonus
            </button>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-semibold text-purple-300">User Management</h3>
        </div>
        <div className="space-y-4">
          {users.map((user) => {
            const team = teams.find(t => t.leader_email === user.email);
            return (
              <div key={user.id} className="bg-white/5 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{user.email}</h4>
                    <p className="text-sm text-gray-400">
                      {user.role === 'admin' ? 'Admin' : 'Team Leader'}
                      {team && ` • ${team.name}`}
                    </p>
                  </div>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => {
                        if (dataService.deleteUser(user.id)) {
                          toast.success('User deleted successfully');
                          loadUsers();
                          loadTeams();
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                      title="Delete User"
                    >
                      <Ban className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Logs */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <History className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-semibold text-purple-300">Recent Submissions</h3>
        </div>
        <div className="space-y-4">
          {submissions.map((submission) => {
            const team = teams.find(t => t.id === submission.team_id);
            return (
              <div key={submission.id} className="bg-white/5 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{team?.name || 'Unknown Team'}</h4>
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