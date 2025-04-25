
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserList } from "@/components/users/UserList";
import { User } from "@/services/user.service";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      username: '',
      fullName: '',
      email: '',
      roleId: '',
      branchId: '',
      isActive: true
    }
  });

  const handleAdd = () => {
    setSelectedUser(undefined);
    reset({
      username: '',
      fullName: '',
      email: '',
      roleId: '',
      branchId: '',
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    reset({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      roleId: user.roleId,
      branchId: user.branchId,
      isActive: user.isActive
    });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`User ${selectedUser ? 'updated' : 'created'} successfully`);
      setIsFormOpen(false);
    } catch (error) {
      toast.error(`Error ${selectedUser ? 'updating' : 'creating'} user`);
      console.error("Error submitting user:", error);
    }
  };
  
  return (
    <MainLayout>
      <UserList onEdit={handleEdit} onAdd={handleAdd} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-lg font-medium">{selectedUser ? "Edit" : "Add"} User</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    {...register("username", { required: "Username is required" })}
                    placeholder="Enter username"
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username.message?.toString()}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    {...register("fullName", { required: "Full name is required" })}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message?.toString()}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      }
                    })}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message?.toString()}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roleId">Role</Label>
                  <Select
                    value={watch("roleId")}
                    onValueChange={(value) => setValue("roleId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Administrator</SelectItem>
                      <SelectItem value="2">Branch Manager</SelectItem>
                      <SelectItem value="3">Cashier</SelectItem>
                      <SelectItem value="4">Inventory Clerk</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.roleId && <p className="text-sm text-red-500">{errors.roleId.message?.toString()}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchId">Branch</Label>
                <Select
                  value={watch("branchId")}
                  onValueChange={(value) => setValue("branchId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="1">Main Branch</SelectItem>
                    <SelectItem value="2">Downtown Branch</SelectItem>
                    <SelectItem value="3">Airport Branch</SelectItem>
                  </SelectContent>
                </Select>
                {errors.branchId && <p className="text-sm text-red-500">{errors.branchId.message?.toString()}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : selectedUser ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default UserManagement;
