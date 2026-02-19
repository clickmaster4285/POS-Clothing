import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, Users, Activity, Power, Plus, MoreVertical, Eye, UserPlus, Zap, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useBranches } from "@/hooks/useBranches"
import { useAuth } from "@/hooks/useAuth";

import {
    useTerminals,
    useCreateTerminal,
    useUpdateTerminal,
} from "@/hooks/useTerminal";


export default function TerminalListPage() {
    const { user } = useAuth();
    const role = user?.role;
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useTerminals();
    const terminals = data?.data || [];
  
    const createMutation = useCreateTerminal();
    const updateMutation = useUpdateTerminal();

    const { data: branchesData } = useBranches();
    const branches = branchesData?.data || [];
  

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({
        terminalId: "",
        terminalName: "",
        branch: "",
        location: "",
    });

    // Create terminal
    const handleCreate = async () => {
        try {
            await createMutation.mutateAsync(createForm);
            toast.success("Terminal created successfully");
            setShowCreate(false);
            setCreateForm({ terminalId: "", terminalName: "", branch: "", location: "" });
            refetch();
        } catch (err) {
            toast.error(err.message || "Failed to create terminal");
        }
    };

    // Toggle status
    const handleToggleStatus = async (terminal) => {
      
        try {
            await updateMutation.mutateAsync({
                terminalId: terminal.terminalId,
                data: { isActive: !terminal.isActive },
            });
            toast.success("Terminal status updated");
            refetch();
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        }
    };

    // Filtering and sorting
    const filtered = terminals
        .filter((t) => {
            const matchSearch =
                t.terminalName.toLowerCase().includes(search.toLowerCase()) ||
                t.terminalId.toLowerCase().includes(search.toLowerCase()) ||
                t.location.toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                statusFilter === "all" || (statusFilter === "active" ? t.isActive : !t.isActive);
            return matchSearch && matchStatus;
        })
        .sort((a, b) => {
            if (sortBy === "name") return a.terminalName.localeCompare(b.terminalName);
            if (sortBy === "id") return a.terminalId.localeCompare(b.terminalId);
            if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
            return 0;
        });

    // Stats
    const totalTerminals = terminals.length;
    const activeTerminals = terminals.filter((t) => t.isActive).length;
    const totalUsers = terminals.reduce((acc, t) => acc + t.users.length, 0);
    const totalActions = terminals.reduce((acc, t) => acc + t.actions.length, 0);
    const stats = [
        { label: "Total Terminals", value: totalTerminals, icon: Monitor, change: "+2 from last month", changeColor: "text-success" },
        { label: "Active Terminals", value: activeTerminals, icon: Power, change: `${activeTerminals}/${totalTerminals} active`, changeColor: "text-success" },
        { label: "Assigned Users", value: totalUsers, icon: Users, change: "+5 from last month", changeColor: "text-info" },
        { label: "Total Actions", value: totalActions, icon: Activity, change: "+12 this week", changeColor: "text-primary" },
    ];

    return (
      <div>
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          Home &gt;{" "}
          <span className="text-primary font-medium">Terminal Management</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Terminal Management
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage terminals, users & actions
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Terminal
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <Card key={s.label} className="border border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    {s.label}
                  </span>
                  <s.icon className="h-5 w-5 text-primary opacity-60" />
                </div>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className={`text-xs mt-1 ${s.changeColor}`}>{s.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-md bg-card">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="id">Sort by ID</SelectItem>
              <SelectItem value="date">Sort by Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Terminal</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No terminals found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t) => (
                  <TableRow
                    key={t._id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => navigate(`/${role}/terminals/${t._id}`)}

                  >
                    <TableCell>{t.terminalName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.terminalId}
                    </TableCell>
                    <TableCell>{t.branch}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.location}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t.users.length}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t.actions.length}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={t.isActive ? "default" : "outline"}
                        className={
                          t.isActive ? "bg-success text-success-foreground" : ""
                        }
                      >
                        {t.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate(`/${role}/terminals/${t.terminalId}`)}>
                                        <Eye className="h-4 w-4 mr-2" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/terminals/${t.terminalId}?tab=users`)}>
                                        <UserPlus className="h-4 w-4 mr-2" /> Manage Users
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/terminals/${t.terminalId}?tab=actions`)}>
                                        <Zap className="h-4 w-4 mr-2" /> View Actions
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleStatus(t.terminalId)}>
                                        <Power className="h-4 w-4 mr-2" /> {t.isActive ? "Deactivate" : "Activate"}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Create Terminal Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Terminal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Terminal ID</Label>
                <Input
                  placeholder="e.g. TRM-005"
                  value={createForm.terminalId}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, terminalId: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Terminal Name</Label>
                <Input
                  placeholder="e.g. Main Counter Terminal"
                  value={createForm.terminalName}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      terminalName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select
                  value={createForm.branch}
                  onValueChange={(v) =>
                    setCreateForm((f) => ({ ...f, branch: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b._id} value={b._id}>
                            {b.branch_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g. Ground Floor - Counter 1"
                  value={createForm.location}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, location: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  !createForm.terminalId ||
                  !createForm.terminalName ||
                  !createForm.branch
                }
              >
                Create Terminal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
}
