import { v4 as uuidv4 } from 'uuid';
import teamsData from '../data/teams.json';
import submissionsData from '../data/submissions.json';
import levelKeysData from '../data/level-keys.json';
import usersData from '../data/users.json';
import { toast } from 'react-hot-toast';

interface TeamProfile {
  id: string;
  name: string;
  leader_email: string;
  current_level: number;
  total_points: number;
  created_at: string;
}

interface TeamSubmission {
  id: string;
  team_id: string;
  question_id: string;
  level: number;
  submission_type: 'code';
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

interface Question {
  level: number;
  title: string;
  description: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  url: string;
}

interface TeamQuestions {
  team_id: string;
  questions: Question[];
}

interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'team_leader';
  created_at: string;
}

class DataService {
  private readonly allQuestions: { [key: number]: Question[] } = {
    1: [{
      level: 1,
      title: "The Sorcerer's Algorithm",
      description: "Master the fundamental spells of programming with this introductory challenge. Learn to cast your first coding spells!",
      points: 100,
      difficulty: 'Easy',
      url: 'https://www.hackerrank.com/challenges/lumos-maxima'
    }],
    2: [{
      level: 2,
      title: "Chamber of Binary Secrets",
      description: "Venture into the Chamber of Binary Secrets and unlock the mysteries of data structures. Can you tame the basilisk of complexity?",
      points: 100,
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/alohomora-binary'
    }],
    3: [{
      level: 3,
      title: "Prisoner of Recursion",
      description: "Break free from the confines of iterative thinking and master the art of recursive spells. Time to escape the loop prison!",
      points: 100,
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/expecto-recursion'
    }],
    4: [{
      level: 4,
      title: "Goblet of Code",
      description: "Face the Triwizard Tournament of algorithms! Your name has been chosen - now prove your worth in this challenging trial.",
      points: 100,
      difficulty: 'Hard',
      url: 'https://www.hackerrank.com/challenges/goblet-code'
    }],
    5: [{
      level: 5,
      title: "Order of the Programmers",
      description: "Join the elite Order of the Programmers in this final challenge. Prove your mastery of magical algorithms and defend against the dark bugs!",
      points: 100,
      difficulty: 'Expert',
      url: 'https://www.hackerrank.com/challenges/order-programmers'
    }]
  };

  private teams: TeamProfile[] = [];
  private submissions: TeamSubmission[] = [];
  private levelKeys: LevelKey[] = [];
  private users: User[] = [];

  // Local storage keys
  private readonly TEAMS_KEY = 'winzard_teams';
  private readonly SUBMISSIONS_KEY = 'winzard_submissions';
  private readonly LEVEL_KEYS_KEY = 'winzard_level_keys';
  private readonly USERS_KEY = 'winzard_users';

  private questions: Question[] = [
    {
      level: 1,
      title: "The Sorcerer's Algorithm",
      description: "Master the basic spells of programming with this introductory challenge.",
      points: 100,
      difficulty: 'Easy',
      url: 'https://www.hackerrank.com/challenges/lumos-maxima'
    },
    {
      level: 2,
      title: "Chamber of Binary Secrets",
      description: "Unlock the mysteries of binary operations and bitwise magic.",
      points: 150,
      difficulty: 'Medium',
      url: 'https://www.hackerrank.com/challenges/alohomora-binary'
    },
    // Add more questions here...
  ];

  submitQuestion(teamId: string, questionId: string, level: number) {
    const team = this.getTeamById(teamId);
    if (!team) return null;

    const question = this.allQuestions[level]?.[0]; // Since there's only one question per level
    if (!question) return null;

    const submission: TeamSubmission = {
      id: uuidv4(),
      team_id: teamId,
      question_id: questionId,
      level,
      submission_type: 'code',
      status: 'success',
      points: 100, // Fixed 100 points per level
      created_at: new Date().toISOString()
    };

    this.submissions.push(submission);
    this.saveSubmissions();

    // Update team level and points
    team.current_level = Math.min(team.current_level + 1, 5);
    team.total_points += 100;
    this.saveTeams();

    return submission;
  }

  constructor() {
    try {
      // Initialize data from localStorage if exists, otherwise use default data
      const storedTeams = localStorage.getItem(this.TEAMS_KEY);
      const storedSubmissions = localStorage.getItem(this.SUBMISSIONS_KEY);
      const storedLevelKeys = localStorage.getItem(this.LEVEL_KEYS_KEY);
      const storedUsers = localStorage.getItem(this.USERS_KEY);

      this.teams = storedTeams ? JSON.parse(storedTeams) : teamsData.teams;
      this.submissions = storedSubmissions ? JSON.parse(storedSubmissions) : submissionsData.submissions;
      this.levelKeys = storedLevelKeys ? JSON.parse(storedLevelKeys) : levelKeysData.levelKeys;
      this.users = storedUsers ? JSON.parse(storedUsers) : usersData.users;

      // Validate data structure
      if (!Array.isArray(this.teams)) this.teams = teamsData.teams;
      if (!Array.isArray(this.submissions)) this.submissions = submissionsData.submissions;
      if (!Array.isArray(this.levelKeys)) this.levelKeys = levelKeysData.levelKeys;
      if (!Array.isArray(this.users)) this.users = usersData.users;

      // Save initial data to localStorage
      localStorage.setItem(this.TEAMS_KEY, JSON.stringify(this.teams));
      localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(this.submissions));
      localStorage.setItem(this.LEVEL_KEYS_KEY, JSON.stringify(this.levelKeys));
      localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));

      // Initialize teamQuestions if needed
      this.teamQuestions = []; // or initialize with some data
    } catch (error) {
      console.error('Error initializing data service:', error);
      // Use default data if there's an error
      this.teams = teamsData.teams;
      this.submissions = submissionsData.submissions;
      this.levelKeys = levelKeysData.levelKeys;
      this.users = usersData.users;
    }
  }

  // Team Profiles
  getTeams(): TeamProfile[] {
    return this.teams;
  }

  getTeamById(id: string): TeamProfile | null {
    const teams = this.getTeams();
    return teams.find(team => team.id === id) || null;
  }

  updateTeamLevel(teamId: string, newLevel: number): boolean {
    const teamIndex = this.teams.findIndex(team => team.id === teamId);
    if (teamIndex === -1) return false;

    const team = this.teams[teamIndex];
    // Only allow progressing to the next level
    if (newLevel !== team.current_level + 1) return false;

    // Update team level and points
    this.teams[teamIndex] = {
      ...team,
      current_level: newLevel,
      total_points: team.total_points + 100 // Add points for completing the level
    };

    localStorage.setItem(this.TEAMS_KEY, JSON.stringify(this.teams));
    return true;
  }

  createTeam(teamData: Omit<TeamProfile, 'id' | 'current_level' | 'total_points'>): TeamProfile {
    const newTeam: TeamProfile = {
      id: `team-${Date.now()}`,
      name: teamData.name,
      leader_email: teamData.leader_email,
      current_level: 1,
      total_points: 0,
      created_at: teamData.created_at
    };

    this.teams.push(newTeam);
    localStorage.setItem(this.TEAMS_KEY, JSON.stringify(this.teams));
    return newTeam;
  }

  updateTeam(id: string, teamData: Partial<TeamProfile>): TeamProfile | null {
    const index = this.teams.findIndex(team => team.id === id);
    if (index === -1) return null;

    this.teams[index] = { ...this.teams[index], ...teamData };
    localStorage.setItem(this.TEAMS_KEY, JSON.stringify(this.teams));
    return this.teams[index];
  }

  deleteTeam(id: string): boolean {
    const index = this.teams.findIndex(team => team.id === id);
    if (index === -1) return false;

    // Remove team
    this.teams.splice(index, 1);

    // Remove associated submissions
    this.submissions = this.submissions.filter(s => s.team_id !== id);

    // Save changes
    localStorage.setItem(this.TEAMS_KEY, JSON.stringify(this.teams));
    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(this.submissions));
    return true;
  }

  // Submissions
  getSubmissions(): TeamSubmission[] {
    return this.submissions;
  }

  createSubmission(submissionData: Omit<TeamSubmission, 'id' | 'created_at'>): TeamSubmission {
    const newSubmission: TeamSubmission = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      ...submissionData
    };
    this.submissions.push(newSubmission);
    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(this.submissions));
    return newSubmission;
  }

  // Level Keys
  getLevelKeys(): LevelKey[] {
    return this.levelKeys;
  }

  createLevelKey(levelKeyData: Omit<LevelKey, 'id'>): LevelKey | null {
    // Validate level
    if (levelKeyData.level < 1 || levelKeyData.level > 5) {
      toast.error('Invalid level number');
      return null;
    }

    // Find existing key for this level
    const existingIndex = this.levelKeys.findIndex(k => k.level === levelKeyData.level);

    const newLevelKey: LevelKey = {
      id: uuidv4(),
      ...levelKeyData
    };

    if (existingIndex !== -1) {
      // Update existing key
      this.levelKeys[existingIndex] = newLevelKey;
    } else {
      // Add new key
      this.levelKeys.push(newLevelKey);
    }

    // Sort keys by level
    this.levelKeys.sort((a, b) => a.level - b.level);

    localStorage.setItem(this.LEVEL_KEYS_KEY, JSON.stringify(this.levelKeys));
    return newLevelKey;
  }

  // Users
  getUsers(): User[] {
    return this.users;
  }

  getUserByEmail(email: string): User | null {
    try {
      return this.users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  validateUser(email: string, password: string): User | null {
    try {
      const user = this.users.find(u => u.email === email && u.password === password);
      return user || null;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }

  createUser(userData: Omit<User, 'id'>): User {
    const existingUser = this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      created_at: userData.created_at
    };

    this.users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
    return newUser;
  }

  // Admin methods
  deleteUser(userId: string): boolean {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) return false;

      const user = this.users[userIndex];

      // Don't allow deleting the last admin
      const isAdmin = user.role === 'admin';
      if (isAdmin) {
        const adminCount = this.users.filter(u => u.role === 'admin').length;
        if (adminCount <= 1) {
          toast.error('Cannot delete the last admin user');
          return false;
        }
      }

      // Remove the user
      this.users.splice(userIndex, 1);
      
      // Also remove associated team profile if exists
      const teamIndex = this.teams.findIndex(t => t.leader_email === user.email);
      if (teamIndex !== -1) {
        this.teams.splice(teamIndex, 1);
      }

      // Save changes to localStorage
      localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
      localStorage.setItem(this.TEAMS_KEY, JSON.stringify(this.teams));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  createUserAsAdmin(userData: { email: string; password: string; role: 'admin' | 'team_leader' }): User | null {
    if (!this.isAdmin()) return null;

    const newUser = this.createUser(userData);
    
    if (userData.role === 'team_leader') {
      // Create associated team profile
      this.createTeam({
        name: `Team ${newUser.email.split('@')[0]}`,
        leader_email: newUser.email,
        created_at: new Date().toISOString()
      });
    }

    return newUser;
  }

  isAdmin(): boolean {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return false;

    const user = this.getUserByEmail(userEmail);
    return user?.role === 'admin';
  }

  // Modified team methods
  getTeamByUserId(userId: string): TeamProfile | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;
    return this.teams.find(team => team.leader_email === user.email) || null;
  }

  getTeamQuestions(userId: string): Question[] {
    const team = this.getTeamByUserId(userId);
    if (!team) return [];

    return Object.values(this.allQuestions)
      .map(questions => questions[0])
      .filter(q => q.level === team.current_level);
  }

  // Modified submission methods
  getTeamSubmissions(userId: string): TeamSubmission[] {
    const team = this.getTeamByUserId(userId);
    if (!team) return [];
    return this.submissions.filter(sub => sub.team_id === team.id);
  }
}

export const dataService = new DataService();
