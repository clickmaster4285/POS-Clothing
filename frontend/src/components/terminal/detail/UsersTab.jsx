// components/terminals/UsersTab.jsx
import React from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const UsersTab = ({ terminal, onAddUser, onRemoveUser }) => {

    
    // Helper function to get user display name
    const getUserDisplayName = (userEntry) => {
        const userData = userEntry.userId;
        
        if (userEntry.role === 'supplier') {
            // For suppliers, show company name
            return userData.company_name || 'Unknown Supplier';
        } else {
            // For employees, show firstName + lastName
            return `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown User';
        }
    };
    
    // Helper function to get user role badge text
    const getUserRole = (userEntry) => {
        const userData = userEntry.userId;
        
        if (userEntry.role === 'supplier') {
            return 'Supplier';
        } else {
            // For employees, show their assigned role (general_staff, manager, etc.)
            return userData.role || 'Employee';
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Terminal Users</h2>
                <Button size="sm" className="gap-2" onClick={onAddUser}>
                    <UserPlus className="h-4 w-4" /> Add User
                </Button>
            </div>
            
            <Card>
                <Table className="border-t">
                    <TableHeader className="bg-muted-foreground/10">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!terminal.users || terminal.users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No users assigned to this terminal
                                </TableCell>
                            </TableRow>
                        ) : (
                            terminal.users.map((userEntry, index) => (
                                <TableRow key={userEntry.userId?._id || userEntry.userId || index}>
                                    <TableCell className="font-medium">
                                        {getUserDisplayName(userEntry)}
                                        {userEntry.role === 'supplier' && userEntry.userId?.company_name && (
                                            <span className="text-xs text-muted-foreground block">
                                                {userEntry.userId.email || ''}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {getUserRole(userEntry)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {userEntry.role === 'supplier' ? 'Supplier' : 'Employee'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => onRemoveUser(userEntry.userId._id || userEntry.userId)}
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
        </>
    );
};