
export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  branchAccess: string[];
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  roleId: string;
  role?: UserRole;
  branchId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const mockRoles: UserRole[] = [
  {
    id: '1',
    name: 'Administrator',
    permissions: ['all'],
    branchAccess: ['all']
  },
  {
    id: '2',
    name: 'Branch Manager',
    permissions: ['manage_branch', 'view_reports', 'manage_inventory', 'create_sales', 'manage_users'],
    branchAccess: ['assigned']
  },
  {
    id: '3',
    name: 'Cashier',
    permissions: ['create_sales'],
    branchAccess: ['assigned']
  },
  {
    id: '4',
    name: 'Inventory Clerk',
    permissions: ['manage_inventory', 'view_inventory_reports'],
    branchAccess: ['assigned']
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Admin User',
    email: 'admin@posoffline.com',
    roleId: '1',
    branchId: 'all',
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    username: 'manager1',
    fullName: 'Branch Manager',
    email: 'manager@posoffline.com',
    roleId: '2',
    branchId: '1',
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    username: 'cashier1',
    fullName: 'Cashier One',
    email: 'cashier1@posoffline.com',
    roleId: '3',
    branchId: '1',
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    username: 'inventory1',
    fullName: 'Inventory Clerk',
    email: 'inventory@posoffline.com',
    roleId: '4',
    branchId: '1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Enriched users with role data
const getEnrichedUsers = () => {
  return mockUsers.map(user => ({
    ...user,
    role: mockRoles.find(role => role.id === user.roleId)
  }));
};

// Mock service functions
export const UserService = {
  getUsers: async (): Promise<User[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getEnrichedUsers());
      }, 500);
    });
  },
  
  getUserById: async (id: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(user => user.id === id);
        if (user) {
          const enrichedUser = {
            ...user,
            role: mockRoles.find(role => role.id === user.roleId)
          };
          resolve(enrichedUser);
        } else {
          resolve(undefined);
        }
      }, 300);
    });
  },
  
  getUsersByBranchId: async (branchId: string): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredUsers = getEnrichedUsers().filter(
          user => user.branchId === branchId || user.branchId === 'all'
        );
        resolve(filteredUsers);
      }, 300);
    });
  },
  
  getRoles: async (): Promise<UserRole[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRoles);
      }, 300);
    });
  },
  
  createUser: async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    return new Promise((resolve) => {
      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const enrichedUser = {
        ...newUser,
        role: mockRoles.find(role => role.id === newUser.roleId)
      };
      
      setTimeout(() => {
        resolve(enrichedUser);
      }, 500);
    });
  },
  
  updateUser: async (id: string, user: Partial<User>): Promise<User | undefined> => {
    return new Promise((resolve) => {
      const existingUser = mockUsers.find(u => u.id === id);
      if (existingUser) {
        const updatedUser = {
          ...existingUser,
          ...user,
          updatedAt: new Date()
        };
        
        const enrichedUser = {
          ...updatedUser,
          role: mockRoles.find(role => role.id === updatedUser.roleId)
        };
        
        setTimeout(() => {
          resolve(enrichedUser);
        }, 500);
      } else {
        resolve(undefined);
      }
    });
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
};
