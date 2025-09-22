// Blockchain utilities for Celo integration
export const CELO_CONFIG = {
  RPC_URL: 'https://alfajores-forno.celo-testnet.org',
  CHAIN_ID: 44787,
  CONTRACT_ADDRESS: '0xFA3cF5a4f3a0f963773e4f22286A2D321A05CA4E',
  NETWORK_NAME: 'Celo Alfajores Testnet'
};

export interface Transaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  timestamp: number;
}

// Mock blockchain functions for demo
export const blockchain = {
  mintCredits: async (projectId: number, amount: number): Promise<string> => {
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    console.log(`Minting ${amount} credits for project ${projectId}`);
    console.log(`Transaction hash: ${txHash}`);
    
    return txHash;
  },

  getTransactionStatus: async (txHash: string): Promise<'pending' | 'success' | 'failed'> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'success';
  },

  getBalance: async (address: string): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Math.floor(Math.random() * 10000);
  }
};