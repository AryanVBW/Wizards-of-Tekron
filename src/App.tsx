import React, { useEffect, useState } from 'react';
import { Wand2, Trophy, Shield, Timer, Users, Brain, QrCode, Layout, Sparkles, Settings } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { Dashboard } from './pages/Dashboard';
import { LeaderboardPage } from './pages/Leaderboard';
import { QuestionsPage } from './pages/Questions';
import { AdminPanel } from './pages/AdminPanel';
import { dataService } from './lib/dataService';
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

function Navigation({ isAdmin, activeSection, setActiveSection }: { isAdmin: boolean; activeSection: string; setActiveSection: (section: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">Wizards of Tekron</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`text-gray-300 hover:text-white transition-colors duration-200 ${activeSection === 'dashboard' ? 'text-white' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveSection('questions')}
              className={`text-gray-300 hover:text-white transition-colors duration-200 ${activeSection === 'questions' ? 'text-white' : ''}`}
            >
              Questions
            </button>
            <button 
              onClick={() => setActiveSection('leaderboard')}
              className={`text-gray-300 hover:text-white transition-colors duration-200 ${activeSection === 'leaderboard' ? 'text-white' : ''}`}
            >
              Leaderboard
            </button>
            {isAdmin && (
              <button 
                onClick={() => setActiveSection('admin')}
                className={`text-gray-300 hover:text-white transition-colors duration-200 ${activeSection === 'admin' ? 'text-white' : ''}`}
              >
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}



function App() {
  const [session, setSession] = useState<{ user: any } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const user = dataService.getUserByEmail(userEmail);
          if (user) {
            setSession({ user });
            setIsAdmin(user.email === 'vivek.aryanvbw@gmail.com');
          } else {
            localStorage.removeItem('userEmail');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem('userEmail');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0118] text-white">
      <Toaster position="top-right" />
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('https://github.com/nst-sdc/NST-image-database/releases/download/n1/harry-potter.jpg')] bg-cover bg-center opacity-5" />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20" />

      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : !session ? (
        // Login Screen
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4">
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
              <p className="text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                Embark on an extraordinary journey where coding prowess meets magical challenges in this unique hackathon experience
              </p>
              <div className="flex flex-col items-center max-w-sm mx-auto">
                {currentPath === '/signup' ? <SignupForm /> : <LoginForm />}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Main App
        <div className="relative">
          <Navigation isAdmin={isAdmin} activeSection={activeSection} setActiveSection={setActiveSection} />
          {activeSection === 'dashboard' && <Dashboard isAdmin={isAdmin} />}
          {activeSection === 'leaderboard' && <LeaderboardPage />}
          {activeSection === 'admin' && <AdminPanel />}
          {activeSection === 'questions' && <QuestionsPage />}
        </div>
      )}


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