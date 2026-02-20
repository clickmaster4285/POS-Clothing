import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditTerminalDialog({
    open,
    onOpenChange,
    form,
    onFormChange,
    onSubmit,
    branches,
    user
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Terminal</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Terminal Name</Label>
                        <Input
                            placeholder="e.g. Main Counter Terminal"
                            value={form.terminalName}
                            onChange={(e) => onFormChange({ ...form, terminalName: e.target.value })}
                        />
                    </div>

                    {user?.role === 'admin' && (<div className="space-y-2">
                        <Label>Branch</Label>
                        <Select
                            value={form.branch}
                            onValueChange={(v) => onFormChange({ ...form, branch: v })}
                        >
                            <SelectTrigger>
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
                        <Label>Location</Label>
                        <Input
                            placeholder="e.g. Ground Floor - Counter 1"
                            value={form.location}
                            onChange={(e) => onFormChange({ ...form, location: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!form.terminalName || !form.branch}
                    >
                        Update Terminal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}