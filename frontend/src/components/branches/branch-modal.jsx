import React, { useState, useEffect } from "react";
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
import { useStaffList } from "@/api/users.api";

const initialFormData = {
    branch_name: "",
    tax_region: "",
    opening_time: "",
    closing_time: "",
    status: "ACTIVE",
    branch_manager: "",
    address: {
        city: "",
        state: "",
        country: "",
    },
};

const BranchModal = ({ isOpen, onClose, onSave, branch, mode }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [selectedCityValue, setSelectedCityValue] = useState("");

    const { data: managers = [], isLoading: managersLoading } = useStaffList();

    const isViewMode = mode === "view";
    const title =
        mode === "add"
            ? "Add New Branch"
            : mode === "edit"
                ? "Edit Branch"
                : "Branch Details";

    // Fetch countries when modal opens
    useEffect(() => {
        if (!isOpen) return;
        getCountries()
            .then(setCountries)
            .catch(console.error);
    }, [isOpen]);

    // Populate form data in edit/view mode
    useEffect(() => {
        if (!branch || !isOpen) {
            setFormData(initialFormData);
            setSelectedCityValue("");
            setStates([]);
            setCities([]);
            return;
        }

        const { country, state, city } = branch.address;

      
        // Set form data
        setFormData({
            branch_name: branch.branch_name || "",
            tax_region: branch.tax_region || "",
            opening_time: branch.opening_time || "",
            closing_time: branch.closing_time || "",
            status: branch.status || "ACTIVE",
            branch_manager: typeof branch.branch_manager === 'object'
                ? branch.branch_manager?._id || ""
                : branch.branch_manager || "",
            address: {
                country: country || "",
                state: state || "",
                city: city || ""
            },
        });

        // Set selected city value
        if (city) {
            setSelectedCityValue(city);
        }

        // Load states and cities based on address
        const loadLocationData = async () => {
            if (country) {
                try {
                    setIsLoadingStates(true);
                    const statesData = await getStates(country);
                   
                    setStates(statesData);

                    if (state) {
                        setIsLoadingCities(true);
                        const citiesData = await getCities(country, state);
                     
                 

                        // Find the exact city in the loaded data
                        const foundCity = citiesData.find(c =>
                            c.name === city ||
                            c.name.toLowerCase() === city.toLowerCase()
                        );

                       

                        // If city is found, ensure we use the exact name from API
                        if (foundCity) {
                            // Update form data with the exact city name from API
                            setFormData(prev => ({
                                ...prev,
                                address: {
                                    ...prev.address,
                                    city: foundCity.name
                                }
                            }));
                            setSelectedCityValue(foundCity.name);
                        }

                        setCities(citiesData);
                    }
                } catch (error) {
                    console.error("Error loading location data:", error);
                } finally {
                    setIsLoadingStates(false);
                    setIsLoadingCities(false);
                }
            } else {
                setStates([]);
                setCities([]);
            }
        };

        loadLocationData();
    }, [branch, mode, isOpen]);

    // Handle country selection
    const handleCountryChange = async (countryCode) => {
        setFormData({
            ...formData,
            address: {
                country: countryCode,
                state: "",
                city: ""
            },
        });
        setSelectedCityValue("");
        setStates([]);
        setCities([]);

        if (!countryCode) return;

        try {
            setIsLoadingStates(true);
            const statesData = await getStates(countryCode);
            setStates(statesData);
        } catch (error) {
            console.error("Error loading states:", error);
        } finally {
            setIsLoadingStates(false);
        }
    };

    // Handle state selection
    const handleStateChange = async (stateIso) => {
        const countryCode = formData.address.country;

        setFormData({
            ...formData,
            address: {
                ...formData.address,
                state: stateIso,
                city: ""
            },
        });
        setSelectedCityValue("");
        setCities([]);

        if (!stateIso) return;

        try {
            setIsLoadingCities(true);
            const citiesData = await getCities(countryCode, stateIso);
          
            setCities(citiesData);
        } catch (error) {
            console.error("Error loading cities:", error);
        } finally {
            setIsLoadingCities(false);
        }
    };

    // Handle city selection
    const handleCityChange = (cityName) => {
      
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                city: cityName
            },
        });
        setSelectedCityValue(cityName);
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

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

                    {/* Branch Manager */}
                    <div className="space-y-2">
                        <Label htmlFor="branch_manager">Branch Manager</Label>
                        <Select
                            value={formData.branch_manager}
                            onValueChange={(value) =>
                                setFormData({ ...formData, branch_manager: value })
                            }
                            disabled={isViewMode || managersLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={managersLoading ? "Loading..." : "Select Manager"} />
                            </SelectTrigger>
                            <SelectContent>
                                {managers.map((manager) => (
                                    <SelectItem key={manager._id} value={manager._id}>
                                        {manager.firstName && manager.lastName
                                            ? `${manager.firstName} ${manager.lastName}`
                                            : manager.email || manager._id}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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

                    {/* Address Section */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium">Address</Label>

                        {/* Country & State in one row */}
                        <div className="grid grid-cols-2 gap-4">
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
                                    disabled={!formData.address.country || isViewMode || isLoadingStates}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                isLoadingStates
                                                    ? "Loading states..."
                                                    : states.length === 0
                                                        ? "No states available"
                                                        : "Select state"
                                            }
                                        />
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
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">City</Label>
                            <Select
                                value={selectedCityValue || formData.address.city}
                                onValueChange={handleCityChange}
                                disabled={!formData.address.state || isViewMode || isLoadingCities}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            isLoadingCities
                                                ? "Loading cities..."
                                                : cities.length === 0
                                                    ? formData.address.city
                                                        ? `Current: ${formData.address.city}`
                                                        : "No cities available"
                                                    : "Select city"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city, index) => (
                                        <SelectItem key={`${city.name}-${index}`} value={city.name}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Debug info - you can remove this after testing */}
                            {mode === "edit" && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    <div>Form city: {formData.address.city}</div>
                                    <div>Selected city value: {selectedCityValue}</div>
                                    <div>Matching: {cities.some(c => c.name === (selectedCityValue || formData.address.city)) ? '✓' : '✗'}</div>
                                </div>
                            )}
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
};

export default BranchModal;