import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, UserPlus, Zap, Monitor, MapPin, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useTerminal, useAddUserToTerminal, useRemoveUserFromTerminal, useRecordAction } from "@/hooks/useTerminal";
import { useGetAllUsers } from '@/api/users.api';
import { useSuppliers } from "@/hooks/useSupplier";

const actionTypes = ["login", "logout", "sale", "refund", "inventory_check", "delivery", "maintenance", "other"];

export default function TerminalDetailPage() {
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

    // 🔹 Fetch terminal
    const { data, isLoading, refetch } = useTerminal(id);

    const terminal = data?.data;
    console.log("Terminal data:", terminal);

    // 🔹 Mutations
    const addUserMutation =
        useAddUserToTerminal({
        onSuccess: () => {
            toast.success("User added");
            refetch();
            setShowAddUser(false);
            setAddUserForm({ userId: "", role: "" }); 
        }
    });

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
            setActionForm({ userId: "", role: "", actionType: "", description: "" }); // Reset form
        }
    });

    const handleAddUser = () => {
        if (!addUserForm.userId || !addUserForm.role) return;

      

        addUserMutation.mutate({
            id: id,  // This should be 'id' not 'terminalId'
            data: {
                userId: addUserForm.userId,
                role: addUserForm.role
            }
        });
    };

    const handleRemoveUser = (userId) => {
        const user = userId._id;
        removeUserMutation.mutate({ id, userId: user });
    };

    const handleRecordAction = () => {
        if (!actionForm.userId || !actionForm.role || !actionForm.actionType || !actionForm.description) return;
        recordActionMutation.mutate({ id, ...actionForm });
    };

    // Create a unified list of available users and suppliers for adding to terminal
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

    // Combined available users (employees + suppliers)
    const allAvailableUsers = useMemo(() => {
        return [...availableEmployees, ...availableSuppliers];
    }, [availableEmployees, availableSuppliers]);

    // Users already assigned to terminal
    const assignedUserIds = useMemo(() => {
        if (!terminal?.users) return new Set();
        return new Set(terminal.users.map(u => u.userId));
    }, [terminal]);

    // Filter users based on role selection and exclude already assigned ones
    const unassignedUsersByRole = useMemo(() => {
        if (!addUserForm.role) return [];

        return allAvailableUsers.filter(u => {
            // Check if user type matches selected role
            const typeMatches = u.type === addUserForm.role;
            // Check if user is not already assigned
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
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground mb-4">
                Home &gt;{" "}
                <button onClick={() => navigate("/terminals")} className="text-primary hover:underline">Terminal Management</button>
                {" "}&gt; <span className="text-primary font-medium">{terminal.terminalName}</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate("/terminals")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-foreground">{terminal.terminalName}</h1>
                        <Badge variant={terminal.isActive ? "default" : "outline"} className={terminal.isActive ? "bg-success text-success-foreground" : ""}>
                            {terminal.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{terminal._id}</p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                            <Monitor className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Terminal ID</p>
                            <p className="font-medium text-foreground">{terminal.terminalId}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Branch</p>
                            <p className="font-medium text-foreground">{terminal.branchName}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="font-medium text-foreground">{terminal.location}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users ({terminal.users.length})</TabsTrigger>
                    <TabsTrigger value="actions">Action Log ({terminal.actions.length})</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Users Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Assigned Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {terminal.users.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No users assigned</p>
                                ) : (
                                    <div className="space-y-3">
                                        {terminal.users.map((u) => (
                                            <div key={u.userId?._id || u.userId} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-foreground">
                                                        {u.firstName ? u.firstName[0] : ''}{u.lastName ? u.lastName[0] : u.role === 'supplier' ? u.firstName?.[0] : ''}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">
                                                            {u.firstName} {u.lastName}
                                                            {u.role === 'supplier' && u.companyName && ` (${u.companyName})`}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground capitalize">{u.role}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="capitalize">{u.role}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Recent Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {terminal.actions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No actions recorded</p>
                                ) : (
                                    <div className="space-y-3">
                                        {terminal.actions.slice(-5).reverse().map((a, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                                                <div>
                                                    <p className="text-sm text-foreground">{a.description}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {a.userName || "Unknown"} · {new Date(a.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="mt-4">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="text-lg">Terminal Users</CardTitle>
                            <Button size="sm" className="gap-2" onClick={() => setShowAddUser(true)}>
                                <UserPlus className="h-4 w-4" /> Add User
                            </Button>
                        </CardHeader>
                        <Table className="p-4">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {terminal.users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No users assigned to this terminal
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    terminal.users.map((u) => (
                                        <TableRow key={u.userId?._id || u.userId}>

                                            <TableCell className="font-medium flex items-center gap-3">
                                               
                                                {u.userId.firstName} {u.userId.lastName}
                                                {u.role === 'supplier' && u.companyName && ` (${u.companyName})`}
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">{u.userId.role}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {u.role === 'supplier' ? 'Supplier' : 'Employee'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() => handleRemoveUser(u.userId)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Actions Tab */}
                <TabsContent value="actions" className="mt-4">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="text-lg">Action Log</CardTitle>
                            <Button size="sm" className="gap-2" onClick={() => setShowRecordAction(true)}>
                                <Zap className="h-4 w-4" /> Record Action
                            </Button>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Action Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {terminal.actions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No actions recorded
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    [...terminal.actions].reverse().map((a, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Badge variant="secondary" className="capitalize">
                                                    {a.actionType.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{a.description}</TableCell>
                                            <TableCell className="font-medium">{a.userName || "Unknown"}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">{a.role}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(a.timestamp).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add User Dialog */}
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
                            onClick={handleAddUser}
                            disabled={!addUserForm.userId || !addUserForm.role}
                        >
                            Add User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Record Action Dialog */}
            <Dialog open={showRecordAction} onOpenChange={setShowRecordAction}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Action</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>User</Label>
                            <Select
                                value={actionForm.userId}
                                onValueChange={(v) => {
                                    const user = terminal.users.find((u) => u.userId === v);
                                    setActionForm((f) => ({ ...f, userId: v, role: user?.role || "" }));
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {terminal.users.map((u) => (
                                        <SelectItem
                                            key={u.userId?._id || u.userId}
                                            value={u.userId?._id || u.userId}
                                        >

                                            {u.firstName} {u.lastName}
                                            {u.role === 'supplier' && u.companyName ? ` (${u.companyName})` : ` (${u.role})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Action Type</Label>
                            <Select
                                value={actionForm.actionType}
                                onValueChange={(v) => setActionForm((f) => ({ ...f, actionType: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select action type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {actionTypes.map((t) => (
                                        <SelectItem key={t} value={t} className="capitalize">
                                            {t.replace("_", " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Describe the action..."
                                value={actionForm.description}
                                onChange={(e) => setActionForm((f) => ({ ...f, description: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setShowRecordAction(false);
                            setActionForm({ userId: "", role: "", actionType: "", description: "" });
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRecordAction}
                            disabled={!actionForm.userId || !actionForm.actionType || !actionForm.description}
                        >
                            Record Action
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}