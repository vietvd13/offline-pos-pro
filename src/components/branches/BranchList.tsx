
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
import { Branch, BranchService } from "@/services/branch.service";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";

interface BranchListProps {
  onEdit: (branch: Branch) => void;
  onAdd: () => void;
}

export function BranchList({ onEdit, onAdd }: BranchListProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our offline storage hook
  const { 
    data: branches, 
    updateData: updateBranches,
    isOnline,
    isSyncing
  } = useOfflineStorage<Branch[]>({
    key: 'branches',
    initialData: [],
    syncFunction: async (data) => {
      // In a real app, this would sync with a backend API
      console.log('Syncing branches data...', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    }
  });

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await BranchService.getBranches();
        updateBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBranches();
  }, [updateBranches]);

  const handleDeleteBranch = async (id: string) => {
    // In a real app, you'd show a confirmation dialog
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await BranchService.deleteBranch(id);
        // Update the list by filtering out the deleted branch
        if (branches) {
          updateBranches(branches.filter(branch => branch.id !== id));
        }
      } catch (error) {
        console.error("Error deleting branch:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Branch List</h3>
          <p className="text-sm text-gray-500">Manage your store branches</p>
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
            <span>Add Branch</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse text-gray-400">Loading branches...</div>
        </div>
      ) : (
        <div className="pos-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches && branches.length > 0 ? (
                branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell>{branch.address}</TableCell>
                    <TableCell>{branch.phone}</TableCell>
                    <TableCell>{branch.email}</TableCell>
                    <TableCell>
                      {branch.isActive ? (
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
                        onClick={() => onEdit(branch)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteBranch(branch.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No branches found. Add your first branch to get started.
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
