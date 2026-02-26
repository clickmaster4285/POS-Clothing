// components/terminals/RecordActionDialog.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const actionTypes = ["login", "logout", "sale", "refund", "inventory_check", "delivery", "maintenance", "other"];

export const RecordActionDialog = ({
    showRecordAction,
    setShowRecordAction,
    actionForm,
    setActionForm,
    terminal,
    onRecordAction,
    isLoading
}) => {
    return (
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
                        onClick={onRecordAction}
                        disabled={!actionForm.userId || !actionForm.actionType || !actionForm.description || isLoading}
                    >
                        {isLoading ? "Recording..." : "Record Action"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};