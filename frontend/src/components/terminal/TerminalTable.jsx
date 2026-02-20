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
                            <Badge variant="secondary">{terminal.users?.length || 0}</Badge>
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