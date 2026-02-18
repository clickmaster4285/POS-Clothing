import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, TrendingUp, Package, Monitor, FileText, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
    fetchNotificationPreferences,
    updateNotificationPreferences,
   
} from "@/data/dummyData";


const items = [
    { key: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email", icon: Mail },
    { key: "smsNotifications", label: "SMS Notifications", description: "Receive notifications via text message", icon: MessageSquare },
    { key: "salesAlerts", label: "Sales Alerts", description: "Get notified about new sales and transactions", icon: TrendingUp },
    { key: "inventoryAlerts", label: "Inventory Alerts", description: "Low stock and reorder notifications", icon: Package },
    { key: "systemUpdates", label: "System Updates", description: "POS system updates and maintenance alerts", icon: Monitor },
    { key: "dailyReports", label: "Daily Reports", description: "Receive end-of-day sales summary", icon: FileText },
    { key: "weeklyReports", label: "Weekly Reports", description: "Receive weekly performance reports", icon: FileText },
];

export default function NotificationSettings() {
    const [prefs, setPrefs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchNotificationPreferences().then((data) => {
            setPrefs(data);
            setLoading(false);
        });
    }, []);

    const handleToggle =() => {
        if (!prefs) return;
        setPrefs({ ...prefs, [key]: value });
    };

    const handleSave = async () => {
        if (!prefs) return;
        setSaving(true);
        await updateNotificationPreferences(prefs);
        setSaving(false);
        toast.success("Notification preferences saved");
    };

    if (loading || !prefs) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-card p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-card-foreground">Notification Preferences</h3>
                </div>
                <div className="space-y-1">
                    {items.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.key}>
                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-card-foreground">{item.label}</p>
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={prefs[item.key]}
                                        onCheckedChange={(v) => handleToggle(item.key, v)}
                                    />
                                </div>
                                {i < items.length - 1 && <div className="border-t border-border" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Preferences
                </Button>
            </div>
        </div>
    );
}
