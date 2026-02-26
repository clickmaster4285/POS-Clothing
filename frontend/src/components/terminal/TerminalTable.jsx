import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TerminalActions from "./TerminalActions";

export default function TerminalTable({
    terminals,
    isLoading,
    onEdit,
    onToggleStatus,
    role
}) {
    const navigate = useNavigate();
   
    if (isLoading) {
        return (
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            Loading...
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

    if (terminals.length === 0) {
        return (
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No terminals found
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Terminal</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Users</TableHead>
                   
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {terminals.map((terminal) => (
                    <TableRow
                        key={terminal._id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => navigate(`/${role}/terminals/${terminal._id}`)}
                    >
                        <TableCell>{terminal.terminalName}</TableCell>
                        <TableCell className="text-muted-foreground">
                            {terminal.terminalId}
                        </TableCell>
                        <TableCell>{terminal?.branch?.branch_name || 'N/A'}</TableCell>
                        <TableCell className="text-muted-foreground">
                            {terminal.location}
                        </TableCell>
                        <TableCell>
                            {terminal.users && terminal.users.length > 0 ? (
                                <div className="flex flex-col gap-1 text-xs text-muted-foreground font-medium">
                                    {terminal.users?.map((user) => (
                                        <div key={user._id}>
                                            {user.role === 'supplier' ? (
                                                // Display supplier info
                                                <span>{user.userId?.company_name || 'N/A'}</span>
                                            ) : (
                                                // Display employee info
                                                <span>{user.userId?.firstName} {user.userId?.lastName}</span>
                                            )}
                                            <span className="text-xs text-muted-foreground">({user.role})</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Badge variant="secondary">No Users</Badge>
                            )}
                        </TableCell>
                      
                        <TableCell>
                            <Badge
                                variant={terminal.isActive ? "default" : "destructive"}
                                className={
                                    terminal.isActive ? "bg-green-500 text-white " : ""
                                }
                            >
                                {terminal.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <TerminalActions
                                terminal={terminal}
                                onEdit={onEdit}
                                onToggleStatus={onToggleStatus}
                                role={role}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}