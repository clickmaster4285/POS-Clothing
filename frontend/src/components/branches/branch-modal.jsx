import React from 'react'
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getCountries, getStates, getCities } from "@/api/location.api";


const initialFormData = {
    branch_name: "",
    tax_region: "",
    opening_time: "",
    closing_time: "",
    status: "ACTIVE",
    address: {
        city: "",
        state: "",
        country: "",
    },
};

const BranchModal = ({
    isOpen,
    onClose,
    onSave,
    branch,
    mode,
}) => {
    const [formData, setFormData] = useState(initialFormData);


    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        getCountries()
            .then(setCountries)
            .catch(console.error);
    }, [isOpen]);

    const handleCountryChange = async (countryCode) => {
        setFormData({
            ...formData,
            address: { country: countryCode, state: "", city: "" },
        });

        setStates([]);
        setCities([]);

        if (!countryCode) return;

        const data = await getStates(countryCode);
        setStates(data);
    };

    const handleStateChange = async (stateCode) => {
        setFormData({
            ...formData,
            address: { ...formData.address, state: stateCode, city: "" },
        });

        setCities([]);

        if (!stateCode) return;

        const data = await getCities(formData.address.country, stateCode);
        setCities(data);
    };

    const handleCityChange = (cityName) => {
        setFormData({
            ...formData,
            address: { ...formData.address, city: cityName },
        });
    };


    useEffect(() => {
        if (branch && (mode === "edit" || mode === "view")) {
            setFormData({
                branch_name: branch.branch_name,
                tax_region: branch.tax_region,
                opening_time: branch.opening_time,
                closing_time: branch.closing_time,
                status: branch.status,
                address: {
                    city: branch.address.city,
                    state: branch.address.state,
                    country: branch.address.country,
                },
            });
        } else {
            setFormData(initialFormData);
        }
    }, [branch, mode, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const isViewMode = mode === "view";
    const title =
        mode === "add"
            ? "Add New Branch"
            : mode === "edit"
                ? "Edit Branch"
                : "Branch Details";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg rounded-lg bg-card p-6 shadow-xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Branch Name */}
                    <div className="space-y-2">
                        <Label htmlFor="branch_name">Branch Name</Label>
                        <Input
                            id="branch_name"
                            value={formData.branch_name}
                            onChange={(e) =>
                                setFormData({ ...formData, branch_name: e.target.value })
                            }
                            placeholder="Enter branch name"
                            disabled={isViewMode}
                            required
                        />
                    </div>

                    {/* Tax Region */}
                    <div className="space-y-2">
                        <Label htmlFor="tax_region">Tax Region</Label>
                        <Input
                            id="tax_region"
                            value={formData.tax_region}
                            onChange={(e) =>
                                setFormData({ ...formData, tax_region: e.target.value })
                            }
                            placeholder="e.g., US-CA"
                            disabled={isViewMode}
                        />
                    </div>

                    {/* Opening & Closing Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="opening_time">Opening Time</Label>
                            <Input
                                id="opening_time"
                                type="time"
                                value={formData.opening_time}
                                onChange={(e) =>
                                    setFormData({ ...formData, opening_time: e.target.value })
                                }
                                disabled={isViewMode}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="closing_time">Closing Time</Label>
                            <Input
                                id="closing_time"
                                type="time"
                                value={formData.closing_time}
                                onChange={(e) =>
                                    setFormData({ ...formData, closing_time: e.target.value })
                                }
                                disabled={isViewMode}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData({ ...formData, status: value })
                            }
                            disabled={isViewMode}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium">Address</Label>

                        {/* Country */}
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Country</Label>
                            <Select
                                value={formData.address.country}
                                onValueChange={handleCountryChange}
                                disabled={isViewMode}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((c) => (
                                        <SelectItem key={c.isoCode} value={c.isoCode}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">State</Label>
                            <Select
                                value={formData.address.state}
                                onValueChange={handleStateChange}
                                disabled={!formData.address.country || isViewMode}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map((s) => (
                                        <SelectItem key={s.isoCode} value={s.isoCode}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">City</Label>
                            <Select
                                value={formData.address.city}
                                onValueChange={handleCityChange}
                                disabled={!formData.address.state || isViewMode}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city, index) => (
                                        <SelectItem key={index} value={city.name}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {isViewMode ? "Close" : "Cancel"}
                        </Button>
                        {!isViewMode && (
                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                {mode === "add" ? "Add Branch" : "Save Changes"}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
export default BranchModal;