import React, { useState } from 'react';
import { dataService } from '../lib/dataService';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = dataService.validateUser(email, password);
      
      if (!user) {
        toast.error('Invalid email or password');
        return;
      }

      localStorage.setItem('userEmail', email);
      toast.success('Welcome back!');
      window.location.href = '/';
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
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
          placeholder="Enter your password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full relative group px-6 py-3 rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 mx-auto animate-spin" />
        ) : (
          'Sign In'
        )}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </button>
    </form>
  );
}