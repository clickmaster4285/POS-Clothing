import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
    fetchUserProfile,
    updateUserProfile,
    languages,
    timezones,
    currencies,
} from "@/data/dummyData";

export default function ProfileSettings() {
    const [profile, setProfile] = useState (null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUserProfile().then((data) => {
            setProfile(data);
            setLoading(false);
        });
    }, []);

    const handleChange = (field, value) => {
        if (!profile) return;
        setProfile({ ...profile, [field]: value });
    };

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        await updateUserProfile(profile);
        setSaving(false);
        toast.success("Profile updated successfully");
    };

    if (loading || !profile) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

    return (
        <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-5 rounded-xl bg-card p-5 border border-border">
                <div className="relative">
                    <Avatar className="h-20 w-20">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
                        <Camera className="h-3.5 w-3.5" />
                    </button>
                </div>
                <div>
                    <h3 className="text-base font-semibold text-card-foreground">
                        {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{profile.role}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Employee ID: {profile.employeeId} · Joined {new Date(profile.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                </div>
            </div>

            {/* Personal Information */}
            <div className="rounded-xl bg-card p-5 border border-border">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">First Name</Label>
                        <Input value={profile.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Last Name</Label>
                        <Input value={profile.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Email Address</Label>
                        <Input type="email" value={profile.email} onChange={(e) => handleChange("email", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Phone Number</Label>
                        <Input value={profile.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Work Information */}
            <div className="rounded-xl bg-card p-5 border border-border">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Work Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Role</Label>
                        <Input value={profile.role} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Store Location</Label>
                        <Input value={profile.storeLocation} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Employee ID</Label>
                        <Input value={profile.employeeId} disabled className="bg-muted" />
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className="rounded-xl bg-card p-5 border border-border">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Preferences</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Language</Label>
                        <select
                            value={profile.language}
                            onChange={(e) => handleChange("language", e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {languages.map((l) => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Timezone</Label>
                        <select
                            value={profile.timezone}
                            onChange={(e) => handleChange("timezone", e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {timezones.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Currency</Label>
                        <select
                            value={profile.currency}
                            onChange={(e) => handleChange("currency", e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {currencies.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
