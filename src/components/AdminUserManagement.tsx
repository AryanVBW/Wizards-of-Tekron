import React, { useState, useEffect } from 'react';
import { dataService } from '../lib/dataService';
import { toast } from 'react-hot-toast';
import { UserPlus, Trash2, Shield } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'team';
  created_at: string;
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'team'>('team');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = dataService.getAllUsers();
    setUsers(allUsers);
  };

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
      loadUsers(); // Refresh user list
    } else {
      toast.error('Failed to create user');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const success = dataService.deleteUser(userId);
      if (success) {
        toast.success('User deleted successfully');
        loadUsers(); // Refresh user list
      } else {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Create User Form */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Create New User
          </h2>
        </div>

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

      {/* User List */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Manage Users
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="pb-3 text-gray-400 font-medium">Email</th>
                <th className="pb-3 text-gray-400 font-medium">Role</th>
                <th className="pb-3 text-gray-400 font-medium">Created</th>
                <th className="pb-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-white/5">
                  <td className="py-3 text-white">{user.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Delete User"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 