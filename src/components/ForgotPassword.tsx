import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success('Password reset link sent to your email');
      onBack(); // Return to login form
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <button
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to login
      </button>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 transition-all duration-200"
            placeholder="Enter your email"
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
            'Send Reset Link'
          )}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </button>
      </form>
    </div>
  );
}
