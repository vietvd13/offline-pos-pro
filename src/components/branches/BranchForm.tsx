
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Branch, BranchService } from "@/services/branch.service";
import { toast } from "sonner";
import { useEffect } from "react";

interface BranchFormProps {
  branch?: Branch;
  onSave: () => void;
  onCancel: () => void;
}

export function BranchForm({ branch, onSave, onCancel }: BranchFormProps) {
  const isEditMode = !!branch;
  
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<Branch>({
    defaultValues: branch || {
      name: '',
      address: '',
      phone: '',
      email: '',
      isActive: true
    }
  });

  useEffect(() => {
    if (branch) {
      reset(branch);
    }
  }, [branch, reset]);

  const onSubmit = async (data: Branch) => {
    try {
      if (isEditMode) {
        await BranchService.updateBranch(branch.id, data);
        toast.success("Branch updated successfully");
      } else {
        await BranchService.createBranch(data);
        toast.success("Branch created successfully");
      }
      onSave();
    } catch (error) {
      toast.error(`Error: ${isEditMode ? "updating" : "creating"} branch`);
      console.error("Error submitting branch:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-lg font-medium">{isEditMode ? "Edit" : "Add"} Branch</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Branch Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Branch name is required" })}
              placeholder="Enter branch name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

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
                },
              })}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone", { required: "Phone is required" })}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("address", { required: "Address is required" })}
              placeholder="Enter branch address"
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={branch?.isActive ?? true}
            onCheckedChange={(checked) => setValue("isActive", checked)}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
