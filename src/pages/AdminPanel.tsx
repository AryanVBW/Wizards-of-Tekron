import React, { useState, useEffect } from 'react';
import { dataService } from '../lib/dataService';
import { toast } from 'react-hot-toast';
import { Users, UserPlus, Key, Shield } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'team_leader';
  created_at: string;
}

interface Team {
  id: string;
  name: string;
  leader_email: string;
  current_level: number;
  total_points: number;
  created_at: string;
}

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'team_leader' as const });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const isAdminUser = dataService.isAdmin();
      setIsAdmin(isAdminUser);
      if (isAdminUser) {
        loadData();
      }
    };

    checkAdmin();
  }, []);

  const loadData = () => {
    const allUsers = dataService.getUsers();
    const allTeams = dataService.getTeams();
    setUsers(allUsers);
    setTeams(allTeams);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = dataService.createUserAsAdmin(newUser);
      if (user) {
        toast.success('User created successfully');
        setNewUser({ email: '', password: '', role: 'team' });
        loadUsers();
      } else {
        toast.error('Failed to create user');
      }
    } catch (error) {
      toast.error('Error creating user');
      console.error('Error:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-400">Access Denied</h2>
          <p className="text-gray-400 mt-2">You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-400" />
          User Management
        </h2>

        {/* Create User Form */}
        <div className="mb-12 bg-black/20 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-400" />
            Create New User
          </h3>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            try {
              const user = dataService.createUserAsAdmin(newUser);
              if (user) {
                toast.success('User created successfully');
                setNewUser({ email: '', password: '', role: 'team_leader' });
                loadData();
              } else {
                toast.error('Failed to create user');
              }
            } catch (error) {
              toast.error('Error creating user');
              console.error('Error:', error);
            }
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'team' })}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="team_leader">Team Leader</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Create User
            </button>
          </form>
        </div>



        {/* User List */}
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            Registered Users
          </h3>
          
          <div className="space-y-4">
            {users.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10"
              >
                <div>
                  <p className="font-medium text-white">{user.email}</p>
                  <p className="text-sm text-gray-400">Role: {user.role}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(user.created_at).toLocaleDateString()}
                  </span>
                  {user.email !== 'vivek.aryanvbw@gmail.com' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${user.email}?`)) {
                          const success = dataService.deleteUser(user.id);
                          if (success) {
                            toast.success('User deleted successfully');
                            loadData();
                          } else {
                            toast.error('Failed to delete user');
                          }
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                      title="Delete user"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team List */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Teams
          </h3>
          
          <div className="space-y-4">
            {teams.map(team => (
              <div
                key={team.id}
                className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10"
              >
                <div>
                  <p className="font-medium text-white">{team.name}</p>
                  <p className="text-sm text-gray-400">Leader: {team.leader_email}</p>
                  <p className="text-sm text-gray-400">Level: {team.current_level} | Points: {team.total_points}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(team.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
