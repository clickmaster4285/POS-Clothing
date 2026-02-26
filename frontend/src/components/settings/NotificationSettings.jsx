import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, TrendingUp, Package, Monitor, FileText, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

// Motif map of notification preferences
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
    const { data: settings, isLoading, refetch } = useSettings();
    const updateSettings = useUpdateSettings();

    const [prefs, setPrefs] = useState({ notifications: {} });

    // Initialize preferences when settings load
    useEffect(() => {
        if (settings?.notifications) {
            setPrefs({ ...prefs, notifications: { ...settings.notifications } });
        }
    }, [settings]);

    // Toggle a single notification
    const handleToggle = (key, value) => {
        setPrefs((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value,
            },
        }));
    };

    // Save notification preferences
    const handleSave = () => {
        updateSettings.mutate(prefs, {
            onSuccess: () => toast.success("Notification preferences saved"),
            onError: () => toast.error("Failed to save preferences"),
        });
    };

    if (isLoading || !prefs.notifications) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Notification Cards */}
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
                                        checked={prefs.notifications[item.key] ?? false} // ensure controlled
                                        onCheckedChange={(v) => handleToggle(item.key, v)}
                                    />
                                </div>
                                {i < items.length - 1 && <div className="border-t border-border" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={refetch}>Reset to Defaults</Button>
                <Button onClick={handleSave} disabled={updateSettings.isLoading}>
                    {updateSettings.isLoading
                        ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        : <Save className="h-4 w-4 mr-2" />}
                    Save Preferences
                </Button>
            </div>
        </div>
    );
}
