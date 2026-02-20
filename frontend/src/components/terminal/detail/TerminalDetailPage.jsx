// pages/TerminalDetailPage.jsx (Refactored)
import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { useTerminal, useAddUserToTerminal, useRemoveUserFromTerminal, useRecordAction } from "@/hooks/useTerminal";
import { useGetAllUsers } from '@/api/users.api';
import { useSuppliers } from "@/hooks/useSupplier";

import { TerminalHeader } from "./TerminalHeader";
import { OverviewTab } from "./OverviewTab";
import { UsersTab } from "./UsersTab";
import { ActionsTab } from "./ActionsTab";
import { AddUserDialog } from "./AddUserDialog";
import { RecordActionDialog } from "./RecordActionDialog";

export default function TerminalDetail() {
    const { data: users = [] } = useGetAllUsers();
    const { data: suppliers } = useSuppliers();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

    // Dialog states
    const [showAddUser, setShowAddUser] = useState(false);
    const [addUserForm, setAddUserForm] = useState({ userId: "", role: "" });
    const [showRecordAction, setShowRecordAction] = useState(false);
    const [actionForm, setActionForm] = useState({ userId: "", role: "", actionType: "", description: "" });

    // Fetch terminal
    const { data, isLoading, refetch } = useTerminal(id);
    const terminal = data?.data;

    // Mutations
    const addUserMutation = useAddUserToTerminal();
    const removeUserMutation = useRemoveUserFromTerminal({
        onSuccess: () => {
            toast.success("User removed");
            refetch();
        }
    });
    const recordActionMutation = useRecordAction({
        onSuccess: () => {
            toast.success("Action recorded");
            refetch();
            setShowRecordAction(false);
            setActionForm({ userId: "", role: "", actionType: "", description: "" });
        }
    });

    const handleAddUser = () => {
        if (!addUserForm.userId || !addUserForm.role) return;

        addUserMutation.mutate(
            {
                id: id,
                data: {
                    userId: addUserForm.userId,
                    role: addUserForm.role
                }
            },
            {
                onSuccess: () => {
                    toast.success("User added successfully");
                    refetch();
                    setShowAddUser(false);
                    setAddUserForm({ userId: "", role: "" });
                },
                onError: (error) => {
                    console.error("Add user error:", error);
                    toast.error(error?.response?.data?.message || "Failed to add user");
                }
            }
        );
    };

    const handleRemoveUser = (userId) => {
        const user = userId._id;
        removeUserMutation.mutate({ id, userId: user });
    };

    const handleRecordAction = () => {
        if (!actionForm.userId || !actionForm.role || !actionForm.actionType || !actionForm.description) return;
        recordActionMutation.mutate({ id, ...actionForm });
    };

    // Create unified list of available users and suppliers
    const availableEmployees = useMemo(() => {
        if (!users) return [];
        return users.map(user => ({
            _id: user._id,
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`,
            role: user.role,
            type: 'employee',
            email: user.email,
            phone: user.phone
        }));
    }, [users]);

    const availableSuppliers = useMemo(() => {
        if (!suppliers) return [];
        return suppliers.map(supplier => ({
            _id: supplier._id,
            id: supplier._id,
            firstName: supplier.company_name,
            lastName: '',
            fullName: supplier.company_name,
            role: 'supplier',
            type: 'supplier',
            email: supplier.email,
            phone: supplier.phone,
            company_name: supplier.company_name,
            supplier_id: supplier.supplier_id
        }));
    }, [suppliers]);

    const allAvailableUsers = useMemo(() => {
        return [...availableEmployees, ...availableSuppliers];
    }, [availableEmployees, availableSuppliers]);

    const assignedUserIds = useMemo(() => {
        if (!terminal?.users) return new Set();
        return new Set(terminal.users.map(u => u.userId));
    }, [terminal]);

    const unassignedUsersByRole = useMemo(() => {
        if (!addUserForm.role) return [];
        return allAvailableUsers.filter(u => {
            const typeMatches = u.type === addUserForm.role;
            const notAssigned = !assignedUserIds.has(u._id);
            return typeMatches && notAssigned;
        });
    }, [allAvailableUsers, addUserForm.role, assignedUserIds]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
    }

    if (!terminal) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-muted-foreground">Terminal not found</p>
                <Button variant="outline" onClick={() => navigate("/terminals")}>Go Back</Button>
            </div>
        );
    }

    return (
        <div>
            <TerminalHeader terminal={terminal} onBack={() => navigate(-1)} />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users ({terminal.users.length})</TabsTrigger>
                    {/* <TabsTrigger value="actions">Action Log ({terminal.actions.length})</TabsTrigger> */}
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    <OverviewTab terminal={terminal} />
                </TabsContent>

                <TabsContent value="users" className="mt-4">
                    <UsersTab
                        terminal={terminal}
                        onAddUser={() => setShowAddUser(true)}
                        onRemoveUser={handleRemoveUser}
                    />
                </TabsContent>

                {/* <TabsContent value="actions" className="mt-4">
                    <ActionsTab
                        terminal={terminal}
                        onRecordAction={() => setShowRecordAction(true)}
                    />
                </TabsContent> */}
            </Tabs>

            <AddUserDialog
                showAddUser={showAddUser}
                setShowAddUser={setShowAddUser}
                addUserForm={addUserForm}
                setAddUserForm={setAddUserForm}
                unassignedUsersByRole={unassignedUsersByRole}
                onAddUser={handleAddUser}
                isLoading={addUserMutation.isLoading}
            />

            <RecordActionDialog
                showRecordAction={showRecordAction}
                setShowRecordAction={setShowRecordAction}
                actionForm={actionForm}
                setActionForm={setActionForm}
                terminal={terminal}
                onRecordAction={handleRecordAction}
                isLoading={recordActionMutation.isLoading}
            />
        </div>
    );
}