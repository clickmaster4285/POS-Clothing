import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useBranches } from "@/hooks/useBranches";
import { useAuth } from "@/hooks/useAuth";
import {
    useTerminals,
    useCreateTerminal,
    useUpdateTerminal,
} from "@/hooks/useTerminal";

// Import components
import TerminalStats from "./TerminalStats";
import TerminalFilters from "./TerminalFilters";
import TerminalTable from "./TerminalTable";
import CreateTerminalDialog from "./CreateTerminalDialog";
import EditTerminalDialog from "./EditTerminalDialog";

export default function TerminalMainPage() {
    const { user } = useAuth();
    const role = user?.role;
    const navigate = useNavigate();

    // Data fetching
    const { data, isLoading, refetch } = useTerminals();
    const terminals = data?.data || [];
    const { data: branchesData } = useBranches();
    const branches = branchesData?.data || [];

    // Mutations
    const createMutation = useCreateTerminal();
    const updateMutation = useUpdateTerminal();

    // Filter state
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    // Dialog state
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedTerminal, setSelectedTerminal] = useState(null);

    // Form state
    const [createForm, setCreateForm] = useState({
        terminalId: "",
        terminalName: "",
        branch: "",
        location: "",
    });

    const [editForm, setEditForm] = useState({
        terminalName: "",
        branch: "",
        location: "",
    });

    // Handlers
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

    const handleEditClick = (terminal) => {
        setSelectedTerminal(terminal);
        setEditForm({
            terminalName: terminal.terminalName,
            branch: terminal.branch?._id || terminal.branch,
            location: terminal.location,
        });
        setShowEdit(true);
    };

    const handleUpdate = async () => {
        try {
            await updateMutation.mutateAsync({
                id: selectedTerminal._id,
                data: editForm,
            });
            toast.success("Terminal updated successfully");
            setShowEdit(false);
            setSelectedTerminal(null);
            refetch();
        } catch (err) {
            toast.error(err.message || "Failed to update terminal");
        }
    };

    const handleToggleStatus = async (terminal) => {
        try {
            await updateMutation.mutateAsync({
                id: terminal._id,
                data: { isActive: !terminal.isActive },
            });
            toast.success(`Terminal ${terminal.isActive ? 'deactivated' : 'activated'} successfully`);
            refetch();
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        }
    };

    // Filter and sort terminals
    const filtered = terminals
        .filter((t) => {
            const matchSearch =
                t.terminalName?.toLowerCase().includes(search.toLowerCase()) ||
                t.terminalId?.toLowerCase().includes(search.toLowerCase()) ||
                t.location?.toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                statusFilter === "all" || (statusFilter === "active" ? t.isActive : !t.isActive);
            return matchSearch && matchStatus;
        })
        .sort((a, b) => {
            if (sortBy === "name") return a.terminalName?.localeCompare(b.terminalName);
            if (sortBy === "id") return a.terminalId?.localeCompare(b.terminalId);
            if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
            return 0;
        });

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
            <TerminalStats terminals={terminals} />

            {/* Filters */}
            <TerminalFilters
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
            />

            {/* Table */}
            <Card className="p-4">
                <TerminalTable
                    terminals={filtered}
                    isLoading={isLoading}
                    onEdit={handleEditClick}
                    onToggleStatus={handleToggleStatus}
                    role={role}
                />
            </Card>

            {/* Dialogs */}
            <CreateTerminalDialog
                open={showCreate}
                onOpenChange={setShowCreate}
                form={createForm}
                onFormChange={setCreateForm}
                onSubmit={handleCreate}
                branches={branches}
                user={user}
            />

            <EditTerminalDialog
                open={showEdit}
                onOpenChange={setShowEdit}
                form={editForm}
                onFormChange={setEditForm}
                onSubmit={handleUpdate}
                branches={branches}
                user={user}
            />
        </div>
    );
}