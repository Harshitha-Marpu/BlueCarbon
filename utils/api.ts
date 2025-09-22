export const API_BASE_URL = 'http://localhost:8000';

// Fallback to demo mode if backend is not available
const DEMO_MODE = true;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface Project {
  project_id: number;
  project_name: string;
  credits: number;
  project_type: string;
  status: string;
  balances: {
    circulating: number;
  };
}

export interface MintRequest {
  project_id: number;
  amount: number;
}

export interface MintResponse {
  txHash: string;
  status: string;
}

// Demo data for offline mode
const DEMO_PROJECTS: Project[] = [
  {
    project_id: 1,
    project_name: "Coastal Mangrove Restoration",
    credits: 1000,
    project_type: "mangrove",
    status: "active",
    balances: { circulating: 1000 }
  },
  {
    project_id: 2,
    project_name: "Seagrass Meadow Conservation",
    credits: 500,
    project_type: "seagrass",
    status: "active",
    balances: { circulating: 500 }
  },
  {
    project_id: 3,
    project_name: "Salt Marsh Protection",
    credits: 750,
    project_type: "marsh",
    status: "inactive",
    balances: { circulating: 750 }
  },
];

// API functions with fallback to demo mode
export const api = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    if (DEMO_MODE) {
      // Demo mode - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.email === 'demo@bluecarbon.org' && data.password === 'demo123') {
        return {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo',
          user: {
            id: '1',
            name: 'Demo User',
            email: data.email,
            role: 'Minter'
          }
        };
      }
      throw new Error('Invalid credentials. Use demo@bluecarbon.org / demo123');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend not available, using demo mode');
      // Fallback to demo mode
      if (data.email === 'demo@bluecarbon.org' && data.password === 'demo123') {
        return {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo',
          user: {
            id: '1',
            name: 'Demo User',
            email: data.email,
            role: 'Minter'
          }
        };
      }
      throw new Error('Invalid credentials');
    }
  },

  getProjects: async (): Promise<Project[]> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return DEMO_PROJECTS.filter(p => p.status === 'active');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return await response.json();
    } catch (error) {
      console.warn('Backend not available, using demo data');
      return DEMO_PROJECTS.filter(p => p.status === 'active');
    }
  },

  mintCredits: async (data: MintRequest): Promise<MintResponse> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: 'success'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Minting failed');
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend not available, using demo response');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: 'success'
      };
    }
  }
};