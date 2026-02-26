// components/terminals/ActionsTab.jsx
import React from "react";
import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ActionsTab = ({ terminal, onRecordAction }) => {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">Action Log</CardTitle>
                <Button size="sm" className="gap-2" onClick={onRecordAction}>
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
    );
};