// components/terminals/AddUserDialog.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AddUserDialog = ({
    showAddUser,
    setShowAddUser,
    addUserForm,
    setAddUserForm,
    unassignedUsersByRole,
    onAddUser,
    isLoading
}) => {
    return (
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add User to Terminal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Select
                            value={addUserForm.role}
                            onValueChange={(role) => setAddUserForm({ userId: "", role })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="supplier">Supplier</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {addUserForm.role && (
                        <div className="space-y-2">
                            <Label>Select {addUserForm.role === 'employee' ? 'Employee' : 'Supplier'}</Label>
                            <Select
                                value={addUserForm.userId}
                                onValueChange={(v) => setAddUserForm((f) => ({ ...f, userId: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={`Select ${addUserForm.role}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {unassignedUsersByRole.length === 0 ? (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            No unassigned {addUserForm.role}s available
                                        </div>
                                    ) : (
                                        unassignedUsersByRole.map((u) => (
                                            <SelectItem key={u._id} value={u._id}>
                                                {u.type === 'employee'
                                                    ? `${u.firstName} ${u.lastName} (${u.role})`
                                                    : `${u.fullName} (${u.supplier_id || 'Supplier'})`
                                                }
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => {
                        setShowAddUser(false);
                        setAddUserForm({ userId: "", role: "" });
                    }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onAddUser}
                        disabled={!addUserForm.userId || !addUserForm.role || isLoading}
                    >
                        {isLoading ? "Adding..." : "Add User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};