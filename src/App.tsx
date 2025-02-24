import React, { useEffect, useState } from 'react';
import { Wand2, Trophy, Shield, Timer, Users, Brain, QrCode, Layout, Sparkles } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { AdminPanel } from './components/AdminPanel';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="group relative bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:bg-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl inline-block mb-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string, label: string }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-black/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
        <p className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">{number}</p>
        <p className="text-gray-300 font-medium">{label}</p>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAdmin(session?.user?.email === 'vivek.aryanvbw@gmail.com');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAdmin(session?.user?.email === 'vivek.aryanvbw@gmail.com');
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0118] text-white overflow-hidden">
      <Toaster position="top-right" />
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-5" />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20" />

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 pt-32 pb-24">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Hackathon in Progress</span>
            </div>
            <h1 className="text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
                Wizards of Tekron
              </span>
            </h1>
            {!session ? (
              <>
                <p className="text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                  Embark on an extraordinary journey where coding prowess meets magical challenges in this unique hackathon experience
                </p>
                <div className="flex flex-col items-center max-w-sm mx-auto">
                  <LoginForm />
                </div>
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
                {isAdmin ? (
                  <AdminPanel />
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Welcome back, Team!</h2>
                    {/* Add team dashboard content here */}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Only show marketing sections when not logged in */}
      {!session && (
        <>
          {/* Stats Section */}
          <div className="container mx-auto px-4 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard number="20" label="Elite Teams" />
              <StatCard number="5" label="Epic Levels" />
              <StatCard number="25" label="Unique Challenges" />
              <StatCard number="80" label="Brilliant Minds" />
            </div>
          </div>

          {/* Features Section */}
          <div className="container mx-auto px-4 py-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 text-transparent bg-clip-text">
                Hackathon Features
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Experience a revolutionary hackathon format that combines coding excellence with real-world exploration
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={Brain}
                title="Competitive Programming"
                description="Master five challenging levels with unique coding questions tailored for each team"
              />
              <FeatureCard
                icon={QrCode}
                title="Physical Puzzles"
                description="Embark on an adventure with location-based challenges and QR code verification"
              />
              <FeatureCard
                icon={Trophy}
                title="Real-time Leaderboard"
                description="Track your team's progress with live rankings and performance metrics"
              />
              <FeatureCard
                icon={Shield}
                title="Secure Platform"
                description="Compete fairly with our advanced anti-cheating system and full-screen lock mode"
              />
            </div>
          </div>

          {/* Format Section */}
          <div className="container mx-auto px-4 py-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 text-transparent bg-clip-text">
                Competition Format
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                A carefully crafted format that tests both technical skills and problem-solving abilities
              </p>
            </div>
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="group flex items-start gap-8 p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-purple-500/30">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl">
                  <Layout className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Coding Challenges
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Teams must solve unique coding questions hosted on Newton School Portal before advancing to the next level. Each challenge is carefully designed to test different aspects of programming expertise.
                  </p>
                </div>
              </div>
              <div className="group flex items-start gap-8 p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-purple-500/30">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl">
                  <Timer className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Time Management
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Rankings are determined by submission timestamps and overall performance. Strategic time management is crucial for success in this competition.
                  </p>
                </div>
              </div>
              <div className="group flex items-start gap-8 p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-purple-500/30">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Team Collaboration
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Four brilliant minds working as one. Teams must collaborate effectively to tackle both coding challenges and physical puzzles throughout the competition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wand2 className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Wizards of Tekron
              </span>
            </div>
            <p className="text-gray-400">© 2025 Newton School of Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;