import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

// Simple function to generate terminal ID
const generateTerminalId = (branchName = "", existingIds = []) => {
    let prefix = 'TRM'; // Default prefix

    // If branch is selected, use first 3 letters for prefix
    if (branchName) {
        prefix = branchName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 3);
    }

    // Generate random alphanumeric suffix (4 characters)
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();

    // Combine to create ID
    let newId = `${prefix}-${randomSuffix}`;

    // Check if ID already exists and regenerate if needed
    while (existingIds.includes(newId)) {
        const newRandomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        newId = `${prefix}-${newRandomSuffix}`;
    }

    return newId;
};

export default function CreateTerminalDialog({
    open,
    onOpenChange,
    form,
    onFormChange,
    user,
    onSubmit,
    branches,
    existingTerminalIds = [] // Pass array of existing terminal IDs to avoid duplicates
}) {
    const [isGenerating, setIsGenerating] = useState(false);

    // Auto-generate terminal ID when dialog opens
    useEffect(() => {
        if (open && !form.terminalId) {
            handleGenerateId();
        }
    }, [open]); // Removed form.branch dependency

    const handleGenerateId = () => {
        setIsGenerating(true);

        // Find selected branch name if branch is selected
        const selectedBranch = form.branch
            ? branches.find(b => b._id === form.branch)
            : null;
        const branchName = selectedBranch?.branch_name || '';

        // Generate new ID
        const newId = generateTerminalId(branchName, existingTerminalIds);

        // Update form with new ID
        onFormChange({ ...form, terminalId: newId });

        // Small delay to show animation
        setTimeout(() => setIsGenerating(false), 300);
    };

    // Optional: Update ID when branch changes (you can remove this if you don't want this behavior)
    const handleBranchChange = (branchId) => {
        const newForm = { ...form, branch: branchId };

        // Option 1: Auto-generate new ID when branch changes
        const selectedBranch = branches.find(b => b._id === branchId);
        const branchName = selectedBranch?.branch_name || '';
        const newId = generateTerminalId(branchName, existingTerminalIds);
        newForm.terminalId = newId;

        // Option 2: If you DON'T want auto-generation on branch change, just comment the above lines

        onFormChange(newForm);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Terminal</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Terminal ID with Auto-generate button */}
                    <div className="space-y-2">
                        <Label htmlFor="terminalId">Terminal ID</Label>
                        <div className="flex gap-2">
                            <Input
                                id="terminalId"
                                placeholder="Auto-generated"
                                value={form.terminalId}
                                onChange={(e) => onFormChange({ ...form, terminalId: e.target.value })}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleGenerateId}
                                className="shrink-0"
                                title="Generate new ID"
                            >
                                <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Click refresh to generate a new ID
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="terminalName">Terminal Name</Label>
                        <Input
                            id="terminalName"
                            placeholder="e.g. Main Counter Terminal"
                            value={form.terminalName}
                            onChange={(e) => onFormChange({ ...form, terminalName: e.target.value })}
                        />
                    </div>

                    {user?.role === 'admin' && (<div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Select
                            value={form.branch}
                            onValueChange={handleBranchChange}
                        >
                            <SelectTrigger id="branch">
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

                    </div>)}

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            placeholder="e.g. Ground Floor - Counter 1"
                            value={form.location}
                            onChange={(e) => onFormChange({ ...form, location: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!form.terminalId || !form.terminalName} // Branch is optional
                    >
                        Create Terminal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}