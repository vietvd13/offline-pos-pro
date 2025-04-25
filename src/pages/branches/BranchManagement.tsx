
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { BranchList } from "@/components/branches/BranchList";
import { BranchForm } from "@/components/branches/BranchForm";
import { Branch } from "@/services/branch.service";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const BranchManagement = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAdd = () => {
    setSelectedBranch(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    setIsFormOpen(false);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
  };
  
  return (
    <MainLayout>
      <BranchList onEdit={handleEdit} onAdd={handleAdd} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <BranchForm 
            branch={selectedBranch} 
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default BranchManagement;
