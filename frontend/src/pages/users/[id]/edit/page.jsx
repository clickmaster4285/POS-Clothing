'use client';

import { useParams } from "react-router-dom";
import { StaffForm } from '@/components/users/StaffForm';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUsersHook } from '@/hooks/useUsersHook';
import { ROLES } from '@/context/roles';
import { useBranches } from '@/hooks/useBranches';

const StaffFormPage = () => {
  const params = useParams();
  const { id } = params;

  const {
    formData,
    isUserLoading,
    permissionsLoading,
    transformedAllPermissions,
    updateFormField,
    handleSubmit,
    resetForm,
    createUserMutation,
    updateUserMutation,
    isEditMode,
  } = useUsersHook(id); 

  const { data: branchesData, isLoading: branchesLoading } = useBranches();
  const branches = branchesData?.data || [];

  if (isUserLoading || branchesLoading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <Dialog>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Staff Member" : "Add New Staff"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update staff member details below."
              : "Add a new staff member to your organization."
            }
          </DialogDescription>
        </DialogHeader>
      </Dialog>
      <StaffForm
        formData={formData}
        updateFormField={updateFormField}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
        editingUser={isEditMode ? { id } : null} 
        createUserMutation={createUserMutation}
        updateUserMutation={updateUserMutation}
        allPermissions={transformedAllPermissions} 
        permissionsLoading={permissionsLoading}
        ROLES={ROLES}
        branches={branches}
      />
    </div>
  );
};

export default StaffFormPage;
