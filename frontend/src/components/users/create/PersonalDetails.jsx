'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/PhoneInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Globe,
  Landmark,
  Building2,
  Mail,
  Home,
  User,
  PhoneCall,
  Info
} from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { useMemo } from "react";

export const PersonalDetails = ({ formData, updateFormField }) => {

  // Memoized lists for location selection
  const countries = useMemo(() =>
    Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode })), []);

  const states = useMemo(() =>
    formData.address.country ? State.getStatesOfCountry(formData.address.country).map(s => ({ label: s.name, value: s.isoCode })) : [],
    [formData.address.country]);

  const cities = useMemo(() =>
    (formData.address.country && formData.address.state) ? City.getCitiesOfState(formData.address.country, formData.address.state).map(c => ({ label: c.name, value: c.name })) : [],
    [formData.address.country, formData.address.state]);

  const relationshipOptions = [
    { label: 'Spouse', value: 'Spouse' },
    { label: 'Parent', value: 'Parent' },
    { label: 'Sibling', value: 'Sibling' },
    { label: 'Friend', value: 'Friend' },
    { label: 'Other', value: 'Other' },
  ];

  return (
    <div className="space-y-8">
      {/* Basic Identity */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold border-b pb-2 text-sm uppercase tracking-wider">
          <User className="h-4 w-4" />
          <span>Basic Identity</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-xs font-semibold">First Name *</Label>
            <Input
              id="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => updateFormField('firstName', e.target.value)}
              required
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-xs font-semibold">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => updateFormField('lastName', e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <PhoneInput
              value={formData.phone}
              onChange={(val) => updateFormField('phone', val)}
              label="Primary Phone Number"
              placeholder="Enter phone number"
              required={false}
            />
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Residential Address</h3>
            <p className="text-xs text-muted-foreground">Enter your current residential address details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Country */}
          <div className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              Country <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.address.country}
              onValueChange={(val) => {
                updateFormField('address.country', val);
                updateFormField('address.state', '');
                updateFormField('address.city', '');
              }}
            >
              <SelectTrigger className="bg-white h-10">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-1.5">
              <Landmark className="h-3.5 w-3.5 text-muted-foreground" />
              State / Province <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.address.state}
              onValueChange={(val) => {
                updateFormField('address.state', val);
                updateFormField('address.city', '');
              }}
              disabled={!formData.address.country}
            >
              <SelectTrigger className="bg-white h-10">
                <SelectValue placeholder={formData.address.country ? "Select State" : "Select Country first"} />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              City <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.address.city}
              onValueChange={(val) => updateFormField('address.city', val)}
              disabled={!formData.address.state}
            >
              <SelectTrigger className="bg-white h-10">
                <SelectValue placeholder={formData.address.state ? "Select City" : "Select State first"} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Zip Code */}
          <div className="space-y-2">
            <Label htmlFor="zip" className="text-xs font-medium flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Zip / Postal Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="zip"
              placeholder="e.g., 10001"
              value={formData.address.zip}
              onChange={(e) => updateFormField('address.zip', e.target.value)}
              className="bg-white h-10"
            />
          </div>

          {/* Street Address - Full width */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="street" className="text-xs font-medium flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Street Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="street"
              placeholder="House number, street name"
              value={formData.address.street}
              onChange={(e) => updateFormField('address.street', e.target.value)}
              className="bg-white h-10"
            />
          </div>

          {/* Additional address line (optional) */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="addressLine2" className="text-xs font-medium flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              Apartment / Suite / Unit <span className="text-muted-foreground text-[10px]">(Optional)</span>
            </Label>
            <Input
              id="addressLine2"
              placeholder="Apartment, suite, unit, building, floor, etc."
              value={formData.address.addressLine2 || ''}
              onChange={(e) => updateFormField('address.addressLine2', e.target.value)}
              className="bg-white h-10"
            />
          </div>
        </div>

        {/* Address validation note */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Please ensure your address is accurate for shipping and verification purposes.
          </p>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold border-b pb-2 text-sm uppercase tracking-wider">
          <PhoneCall className="h-4 w-4" />
          <span>Emergency Contact</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Contact Full Name</Label>
            <Input
              placeholder="Emergency contact name"
              value={formData.emergencyContact.name}
              onChange={(e) => updateFormField('emergencyContact.name', e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Relationship</Label>
            <Select
              value={formData.emergencyContact.relationship}
              onValueChange={(val) => updateFormField('emergencyContact.relationship', val)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationshipOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <PhoneInput
              value={formData.emergencyContact.phone}
              onChange={(val) => updateFormField('emergencyContact.phone', val)}
              label="Emergency Contact Phone"
              placeholder="Enter phone number"
              required={false}
            />
          </div>
        </div>
      </section>
    </div>
  );
};