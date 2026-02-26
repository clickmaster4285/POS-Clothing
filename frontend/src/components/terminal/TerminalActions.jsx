import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, UserPlus, Zap, Power } from "lucide-react";

export default function TerminalActions({ terminal, onEdit, onToggleStatus, role }) {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/${role}/terminals/${terminal._id}`)}>
                    <Eye className="h-4 w-4 mr-2" /> View Details
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onEdit(terminal)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Info
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate(`/${role}/terminals/${terminal._id}?tab=users`)}>
                    <UserPlus className="h-4 w-4 mr-2" /> Manage Users
                </DropdownMenuItem>

                {/* <DropdownMenuItem onClick={() => navigate(`/${role}/terminals/${terminal._id}?tab=actions`)}>
                    <Zap className="h-4 w-4 mr-2" /> View Actions
                </DropdownMenuItem> */}

                <DropdownMenuItem onClick={() => onToggleStatus(terminal)}>
                    <Power className="h-4 w-4 mr-2" />
                    {terminal.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}