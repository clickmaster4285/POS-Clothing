import { useState, useMemo } from "react";
import { Zap, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTerminals } from "@/hooks/useTerminal"; // React Query hook

export default function TerminalActionsPage() {
    const { data: terminals = [], isLoading } = useTerminals();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");

    // Flatten all actions across terminals
    const allActions = useMemo(
        () =>
            terminals.flatMap((t) =>
                t.actions.map((a) => ({
                    ...a,
                    terminalId: t.terminalId,
                    terminalName: t.terminalName,
                    userName: a.userId?.firstName ? `${a.userId.firstName} ${a.userId.lastName}` : undefined,
                }))
            ),
        [terminals]
    );

    const actionTypes = useMemo(() => [...new Set(allActions.map((a) => a.actionType))], [allActions]);

    // Filtered and sorted actions
    const filtered = useMemo(
        () =>
            allActions
                .filter((a) => {
                    const matchSearch =
                        a.description.toLowerCase().includes(search.toLowerCase()) ||
                        a.terminalName.toLowerCase().includes(search.toLowerCase()) ||
                        (a.userName || "").toLowerCase().includes(search.toLowerCase());
                    const matchType = typeFilter === "all" || a.actionType === typeFilter;
                    const matchRole = roleFilter === "all" || a.role === roleFilter;
                    return matchSearch && matchType && matchRole;
                })
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        [allActions, search, typeFilter, roleFilter]
    );

    return (
        <div>
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground mb-4">
                Home &gt; Terminals &gt; <span className="text-primary font-medium">Terminal Actions</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Zap className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Terminal Actions</h1>
                    <p className="text-muted-foreground text-sm">All actions across all terminals</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search actions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {actionTypes.map((t) => (
                            <SelectItem key={t} value={t} className="capitalize">
                                {t.replace("_", " ")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Actions Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Terminal</TableHead>
                            <TableHead>Action Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No actions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((a, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{a.terminalName}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">
                                            {a.actionType.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{a.description}</TableCell>
                                    <TableCell>{a.userName || "Unknown"}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {a.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(a.timestamp).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground">
                    Showing {filtered.length} of {allActions.length} actions
                </div>
            </Card>
        </div>
    );
}
