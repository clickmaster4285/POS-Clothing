import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

// NPM packages for dropdowns
import currencyCodes from "currency-codes";
import getSymbolFromCurrency from "currency-symbol-map";
import ISO6391 from "iso-639-1";
import moment from "moment-timezone";

export default function ProfileSettings() {
    const { data: settings, isLoading } = useSettings();
    const updateMutation = useUpdateSettings();

    // Dropdown values
    const currencies = currencyCodes.codes(); // ['USD', 'EUR', ...]
    const languages = ISO6391.getAllCodes(); // ['en', 'es', ...]
    const timezones = moment.tz.names(); // ['Europe/London', 'America/New_York', ...]

    const [form, setForm] = useState({
        companyName: "",
        logo: null,
        tax: 0,
        currency: "USD",
        currencySymbol: "$", // New field for currency symbol
        language: "en",
        timezone: "UTC",
    });

    useEffect(() => {
        if (settings) {
            setForm({
                companyName: settings.companyName || "",
                logo: null,
                tax: settings.tax || 0,
                currency: settings.currency || "USD",
                currencySymbol: settings.currencySymbol || getSymbolFromCurrency(settings.currency) || "$",
                language: settings.language || "en",
                timezone: settings.timezone || "UTC",
            });
        }
    }, [settings]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // Handle currency change - auto-update symbol
    const handleCurrencyChange = (e) => {
        const selectedCurrency = e.target.value;
        const symbol = getSymbolFromCurrency(selectedCurrency) || selectedCurrency;

        setForm((prev) => ({
            ...prev,
            currency: selectedCurrency,
            currencySymbol: symbol, // Auto-detect and set symbol
        }));
    };

    // Optional: Allow manual override of symbol
    const handleSymbolChange = (e) => {
        handleChange("currencySymbol", e.target.value);
    };

    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleChange("logo", e.target.files[0]);
        }
    };

    const handleSave = async () => {
        const formData = new FormData();

        // append fields
        formData.append("companyName", form.companyName);
        formData.append("tax", form.tax.toString());
        formData.append("currency", form.currency);
        formData.append("currencySymbol", form.currencySymbol); // Send symbol to backend
        formData.append("language", form.language);
        formData.append("timezone", form.timezone);

        if (form.logo) {
            formData.append("logo", form.logo);
        }

        try {
            await updateMutation.mutateAsync(formData);
            toast.success("Settings updated successfully");
        } catch (err) {
            toast.error(err.message || "Failed to update settings");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Logo Section */}
            <div className="flex items-center gap-5 rounded-xl bg-card p-5 border border-border">
                <div className="relative">
                    <Avatar className="h-20 w-20">
                        {settings?.logo ? (
                            <img
                                src={`${import.meta.env.VITE_API_URL}${settings.logo}`}
                                alt="Logo"
                            />
                        ) : (
                            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                                {form.companyName[0] || "C"}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
                        <Camera className="h-3.5 w-3.5" />
                        <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                    </label>
                </div>
                <div>
                    <h3 className="text-base font-semibold text-card-foreground">
                        {form.companyName}
                    </h3>
                </div>
            </div>

            {/* Company Information */}
            <div className="rounded-xl bg-card p-5 border border-border">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">
                    Company Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                            Company Name
                        </Label>
                        <Input
                            value={form.companyName}
                            onChange={(e) => handleChange("companyName", e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Tax (%)</Label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={form.tax}
                            onChange={(e) => handleChange("tax", e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Currency</Label>
                        <select
                            value={form.currency}
                            onChange={handleCurrencyChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {currencies.map((c) => (
                                <option key={c} value={c}>
                                    {c} - {getSymbolFromCurrency(c) || '?'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* New Currency Symbol Field */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                            Currency Symbol
                        </Label>
                        <Input
                            value={form.currencySymbol}
                            onChange={handleSymbolChange}
                            placeholder="Auto-detected"
                            className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Auto-detected from currency code.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Language</Label>
                        <select
                            value={form.language}
                            onChange={(e) => handleChange("language", e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {languages.map((l) => (
                                <option key={l} value={l}>
                                    {ISO6391.getName(l)} ({l})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Timezone</Label>
                        <select
                            value={form.timezone}
                            onChange={(e) => handleChange("timezone", e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {timezones.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end gap-3">
                <Button onClick={handleSave} disabled={updateMutation.isLoading}>
                    {updateMutation.isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}