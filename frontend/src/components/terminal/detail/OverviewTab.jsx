// components/terminals/OverviewTab.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";

export const OverviewTab = ({ terminal }) => {
    const users = terminal?.users || [];
    const actions = terminal?.actions || [];

    // Helper function to get user display name
    const getUserDisplayName = (userEntry) => {
        const userData = userEntry.userId;

        if (userEntry.role === 'supplier') {
            return userData.company_name || 'Unknown Supplier';
        } else {
            return `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown User';
        }
    };

    // Helper function to get user role badge text
    const getUserRole = (userEntry) => {
        const userData = userEntry.userId;

        if (userEntry.role === 'supplier') {
            return 'Supplier';
        } else {
            return userData.role || 'Employee';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ================= USERS CARD ================= */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Assigned Users</CardTitle>
                </CardHeader>

                <CardContent>
                    {users.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No users assigned
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {users.map((userEntry) => (
                                <div
                                    key={userEntry.userId?._id || userEntry.userId}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar - Using the new UserAvatar component */}
                                        <UserAvatar
                                            user={userEntry.userId}
                                            size="sm"
                                        />

                                        {/* User Info */}
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {getUserDisplayName(userEntry)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {userEntry.role === 'supplier'
                                                    ? userEntry.userId?.email
                                                    : getUserRole(userEntry)
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <Badge variant="outline" className="capitalize">
                                        {userEntry.role === 'supplier' ? 'Supplier' : getUserRole(userEntry)}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ================= ACTIONS CARD ================= */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Actions</CardTitle>
                </CardHeader>

                <CardContent>
                    {actions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No actions recorded
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {actions
                                .slice(-5)
                                .reverse()
                                .map((action, index) => {
                                    // Get user data for the action if available
                                    const actionUser = action.userId;

                                    return (
                                        <div
                                            key={action._id || index}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />

                                            <div className="flex-1">
                                                <p className="text-sm text-foreground">
                                                    {action.description || `${action.actionType || 'Action'} performed`}
                                                </p>

                                                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                                    {actionUser && (
                                                        <span className="flex items-center gap-1">
                                                            <UserAvatar
                                                                user={actionUser}
                                                                size="sm"
                                                                className="h-4 w-4"
                                                            />
                                                            {actionUser.company_name ||
                                                                `${actionUser.firstName || ''} ${actionUser.lastName || ''}`.trim() ||
                                                                'Unknown'}
                                                        </span>
                                                    )}
                                                    {action.createdAt && (
                                                        <>
                                                            <span>·</span>
                                                            <span>
                                                                {new Date(action.createdAt).toLocaleString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
};