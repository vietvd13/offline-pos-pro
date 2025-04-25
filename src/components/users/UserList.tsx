
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, UserService } from "@/services/user.service";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";

interface UserListProps {
  onEdit: (user: User) => void;
  onAdd: () => void;
}

export function UserList({ onEdit, onAdd }: UserListProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our offline storage hook
  const { 
    data: users, 
    updateData: updateUsers,
    isOnline,
    isSyncing
  } = useOfflineStorage<User[]>({
    key: 'users',
    initialData: [],
    syncFunction: async (data) => {
      // In a real app, this would sync with a backend API
      console.log('Syncing users data...', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    }
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getUsers();
        updateUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [updateUsers]);

  const handleDeleteUser = async (id: string) => {
    // In a real app, you'd show a confirmation dialog
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await UserService.deleteUser(id);
        // Update the list by filtering out the deleted user
        if (users) {
          updateUsers(users.filter(user => user.id !== id));
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">User List</h3>
          <p className="text-sm text-gray-500">Manage your system users</p>
        </div>
        
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Offline Mode
            </Badge>
          )}
          {isSyncing && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Syncing...
            </Badge>
          )}
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse text-gray-400">Loading users...</div>
        </div>
      ) : (
        <div className="pos-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {user.role?.name || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(user)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No users found. Add your first user to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
