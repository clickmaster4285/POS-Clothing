'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Briefcase, Calendar, UserCog, Clock, CalendarDays, Plus, Building2 } from "lucide-react";
import { ROLES } from "@/context/roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import BranchModal from "@/components/branches/branch-modal"; // Adjust the import path as needed
import { useCreateBranch } from "@/hooks/useBranches"; // You'll need this hook

export const EmploymentDetails = ({ formData, updateFormField, branches, onBranchCreated }) => {
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const createBranchMutation = useCreateBranch();

  
  const employmentStatuses = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'ON_LEAVE', label: 'On Leave' },
    { value: 'TERMINATED', label: 'Terminated' },
  ];

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day) => {
    const currentDays = formData.shift.workDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    updateFormField('shift.workDays', newDays);
  };

  const handleAddBranch = async (branchData) => {
    try {
      const newBranch = await createBranchMutation.mutateAsync(branchData);
      // Call the callback to refresh branches list
      if (onBranchCreated) {
        onBranchCreated();
      }
      // Auto-select the newly created branch
      updateFormField('branch_id', newBranch._id);
      setIsBranchModalOpen(false);
    } catch (error) {
      console.error("Error creating branch:", error);
    }
  };

  // In your parent component where formData is managed
  useEffect(() => {
    if (!formData.role) {
      updateFormField('role', 'staff');
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Job Information */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
            <Briefcase className="h-4 w-4" />
            <span>Job Information</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/20 px-3 py-1 rounded-full border">
            <Label htmlFor="isActive" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer">Account Active</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(val) => updateFormField('isActive', val)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="designation" className="text-xs font-semibold">Designation / Job Title</Label>
            <Input
              id="designation"
              placeholder="e.g. Senior Cashier"
              value={formData.employment.designation}
              onChange={(e) => updateFormField('employment.designation', e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-xs font-semibold">Department</Label>
            <Input
              id="department"
              placeholder="e.g. Sales, Inventory"
              value={formData.employment.department}
              onChange={(e) => updateFormField('employment.department', e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Employment Status</Label>
            <Select
              value={formData.employment.status}
              onValueChange={(val) => updateFormField('employment.status', val)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {employmentStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hireDate" className="text-xs font-semibold">Hire Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="hireDate"
                type="date"
                className="pl-10 bg-white"
                value={formData.employment.hireDate}
                onChange={(e) => updateFormField('employment.hireDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shift Configuration */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold border-b pb-2 text-sm uppercase tracking-wider">
          <Clock className="h-4 w-4" />
          <span>Shift Configuration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Start Time</Label>
            <Input
              type="time"
              value={formData.shift.startTime}
              onChange={(e) => updateFormField('shift.startTime', e.target.value)}
              className="bg-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">End Time</Label>
            <Input
              type="time"
              value={formData.shift.endTime}
              onChange={(e) => updateFormField('shift.endTime', e.target.value)}
              className="bg-white font-mono"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <Label className="text-xs font-semibold flex items-center gap-2">
              <CalendarDays className="h-3 w-3" /> Working Days
            </Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <div
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border text-[11px] font-medium cursor-pointer transition-all select-none",
                    formData.shift.workDays.includes(day)
                      ? "bg-primary border-primary text-white shadow-sm"
                      : "bg-white text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role & Assignment */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-primary font-bold border-b pb-2 text-sm uppercase tracking-wider">
          <UserCog className="h-4 w-4" />
          <span>Role & Assignment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">System Role *</Label>
            <Select
              value={formData.role || ""}
              onValueChange={(value) => updateFormField('role', value)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Optional: Show default message if no role selected */}
            {!formData.role && (
              <p className="text-xs text-muted-foreground mt-1">
                Default role will be <span className="font-medium">Staff</span> if not selected
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Assigned Branch *</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  value={formData.branch_id}
                  onValueChange={(value) => updateFormField('branch_id', value)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches && branches.length > 0 ? (
                      branches.map(branch => (
                        <SelectItem key={branch._id} value={branch._id}>
                          {branch.branch_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-branches" disabled>
                        No branches available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setIsBranchModalOpen(true)}
                className="shrink-0 h-10 px-3 gap-1 bg-primary hover:bg-primary/90 text-white"
                title="Add New Branch"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New</span>
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Don't see your branch? Click "New" to add it.
            </p>
          </div>
        </div>
      </section>

      {/* Branch Modal */}
      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onSave={handleAddBranch}
        branch={null}
        mode="add"
      />
    </div>
  );
};