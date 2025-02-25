import React from 'react';
import { TeamDashboard } from '../components/TeamDashboard';
import { AdminPanel } from '../components/AdminPanel';

interface DashboardProps {
  isAdmin: boolean;
}

export function Dashboard({ isAdmin }: DashboardProps) {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
        {isAdmin ? <AdminPanel /> : <TeamDashboard />}
      </div>
    </div>
  );
}
