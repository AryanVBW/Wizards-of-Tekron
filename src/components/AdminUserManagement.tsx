import React, { useState } from 'react';
import { dataService } from '../lib/dataService';
import { toast } from 'react-hot-toast';

export function AdminUserManagement() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'team'>('team');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const newUser = dataService.createUserAsAdmin({ email, password, role });
    
    if (newUser) {
      toast.success('User created successfully');
      setEmail('');
      setPassword('');
    } else {
      toast.error('Failed to create user');
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
        Create New User
      </h2>

      <form onSubmit={handleCreateUser} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white"
            placeholder="user@hogwarts.edu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'team')}
            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white"
          >
            <option value="team">Team</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-medium transition-all duration-300"
        >
          Create User
        </button>
      </form>
    </div>
  );
} 