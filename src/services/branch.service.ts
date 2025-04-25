
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for branches
const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Main Branch',
    address: '123 Main St, City',
    phone: '123-456-7890',
    email: 'main@posoffline.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Downtown Branch',
    address: '456 Downtown Ave, City',
    phone: '123-456-7891',
    email: 'downtown@posoffline.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Airport Branch',
    address: '789 Airport Blvd, City',
    phone: '123-456-7892',
    email: 'airport@posoffline.com',
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock service functions
export const BranchService = {
  getBranches: async (): Promise<Branch[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBranches);
      }, 500);
    });
  },
  
  getBranchById: async (id: string): Promise<Branch | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBranches.find(branch => branch.id === id));
      }, 300);
    });
  },
  
  createBranch: async (branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>): Promise<Branch> => {
    return new Promise((resolve) => {
      const newBranch: Branch = {
        ...branch,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setTimeout(() => {
        resolve(newBranch);
      }, 500);
    });
  },
  
  updateBranch: async (id: string, branch: Partial<Branch>): Promise<Branch | undefined> => {
    return new Promise((resolve) => {
      const updatedBranch = mockBranches.find(b => b.id === id);
      if (updatedBranch) {
        Object.assign(updatedBranch, branch, { updatedAt: new Date() });
      }
      
      setTimeout(() => {
        resolve(updatedBranch);
      }, 500);
    });
  },
  
  deleteBranch: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
};
