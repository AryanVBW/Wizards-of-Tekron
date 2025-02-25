import React, { useState } from 'react';
import { dataService } from '../lib/dataService';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export function SignupForm() {
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Create new team
      const team = {
        id: `team-${Date.now()}`,
        name: teamName,
        created_at: new Date().toISOString(),
        leader_email: email
      };

      // Create new user
      const user = {
        id: `user-${Date.now()}`,
        email,
        password,
        role: 'team_leader',
        created_at: new Date().toISOString()
      };

      await dataService.createTeam(team);
      await dataService.createUser(user);

      toast.success('Team created successfully!');
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      toast.error('Failed to create team');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div>
        <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-2">
          Team Name
        </label>
        <input
          id="teamName"
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 transition-all duration-200"
          placeholder="Enter team name"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Team Leader's Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 transition-all duration-200"
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 transition-all duration-200"
          placeholder="Create a password"
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 transition-all duration-200"
          placeholder="Confirm your password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-500 text-white py-3 px-4 rounded-xl hover:bg-purple-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Creating Team...
          </>
        ) : (
          'Create Team'
        )}
      </button>
      <p className="text-center text-gray-400">
        Already have a team?{' '}
        <a 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }} 
          className="text-purple-500 hover:text-purple-400"
        >
          Login here
        </a>
      </p>
    </form>
  );
}
