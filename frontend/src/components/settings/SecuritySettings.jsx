import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Loader2, Monitor, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
    fetchSecuritySettings,
    updateSecuritySettings,
    changePassword,
    fetchLoginHistory,
  
} from "@/data/dummyData";

export default function SecuritySettings() {
    const [settings, setSettings] = useState (null);
    const [history, setHistory] = useState ([]);
    const [loading, setLoading] = useState(true);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        Promise.all([fetchSecuritySettings(), fetchLoginHistory()]).then(([sec, hist]) => {
            setSettings(sec);
            setHistory(hist);
            setLoading(false);
        });
    }, []);

    const handleToggle = async (field, value) => {
        if (!settings) return;
        const updated = await updateSecuritySettings({ [field]: value });
        setSettings(updated);
        toast.success("Security settings updated");
    };

    const handleChangePassword = async () => {
        if (!newPassword || newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setChangingPassword(true);
        const result = await changePassword(currentPassword, newPassword);
        setChangingPassword(false);
        if (result.success) {
            toast.success(result.message);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            // Refresh settings
            const updated = await fetchSecuritySettings();
            setSettings(updated);
        } else {
            toast.error(result.message);
        }
    };

    if (loading || !settings) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Change Password */}
            <div className="rounded-xl bg-card p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                    <Key className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-card-foreground">Change Password</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Current Password</Label>
                        <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">New Password</Label>
                        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Confirm New Password</Label>
                        <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Last changed: {new Date(settings.lastPasswordChange).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
                <div className="mt-4 flex justify-end">
                    <Button onClick={handleChangePassword} disabled={changingPassword} size="sm">
                        {changingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
                        Update Password
                    </Button>
                </div>
            </div>

            {/* Security Options */}
            <div className="rounded-xl bg-card p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-card-foreground">Security Options</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-card-foreground">Two-Factor Authentication</p>
                            <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Switch checked={settings.twoFactorEnabled} onCheckedChange={(v) => handleToggle("twoFactorEnabled", v)} />
                    </div>
                    <div className="border-t border-border" />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-card-foreground">Login Notifications</p>
                            <p className="text-xs text-muted-foreground">Get notified when someone logs into your account</p>
                        </div>
                        <Switch checked={settings.loginNotifications} onCheckedChange={(v) => handleToggle("loginNotifications", v)} />
                    </div>
                    <div className="border-t border-border" />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-card-foreground">Session Timeout</p>
                            <p className="text-xs text-muted-foreground">Auto-lock POS after inactivity</p>
                        </div>
                        <select
                            value={settings.sessionTimeout}
                            onChange={(e) => handleToggle("sessionTimeout", Number(e.target.value))}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        >
                            <option value={15}>15 min</option>
                            <option value={30}>30 min</option>
                            <option value={60}>1 hour</option>
                            <option value={120}>2 hours</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Login History */}
            <div className="rounded-xl bg-card p-5 border border-border">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Recent Login Activity</h3>
                <div className="space-y-3">
                    {history.map((login) => (
                        <div key={login.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                            <div className="flex items-center gap-3">
                                <Monitor className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-card-foreground">{login.device}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{login.location}</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{login.date}</span>
                                        <span>IP: {login.ip}</span>
                                    </div>
                                </div>
                            </div>
                            {login.status === "success" ? (
                                <Badge variant="secondary" className="bg-success/10 text-success border-0 text-[11px]">
                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Success
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0 text-[11px]">
                                    <XCircle className="h-3 w-3 mr-1" /> Failed
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
