"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"
import { toast } from "sonner"

import { useCreateCustomer, useUpdateCustomer, useCustomer } from "@/hooks/pos_hooks/useCustomer"
import { useAuth } from "@/hooks/useAuth"
import { Checkbox } from "@/components/ui/checkbox"

const CreateCustomer = () => {
    const navigate = useNavigate()
    const { id } = useParams() // if id exists, we're editing
    const [showSuccess, setShowSuccess] = useState(false)
    const { user: currentUser } = useAuth()
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phonePrimary: "",
        phoneAlternate: "",
        email: "",
        streetAddress: "",
        city: "",
        state: "",
        zip: "",
        loyaltyProgram: "No Loyalty Program",
        communicationEmail: true,
        communicationSms: false,
        communicationPush: false,
        preferences: "",
    })

    const [errors, setErrors] = useState({})

    // API hooks
    const createMutation = useCreateCustomer()
    const updateMutation = useUpdateCustomer()
    const { data: customerData } = useCustomer(id)

    // Prefill form if editing
    useEffect(() => {
        if (customerData) {
            setForm({
                firstName: customerData.firstName || "",
                lastName: customerData.lastName || "",
                phonePrimary: customerData.phonePrimary || "",
                phoneAlternate: customerData.phoneAlternate || "",
                email: customerData.email || "",
                streetAddress: customerData.streetAddress || "",
                city: customerData.city || "",
                state: customerData.state || "",
                zip: customerData.zip || "",
                loyaltyProgram: customerData.loyaltyProgram || "No Loyalty Program",
                communicationEmail: customerData.communicationEmail ?? true,
                communicationSms: customerData.communicationSms ?? false,
                communicationPush: customerData.communicationPush ?? false,
                preferences: customerData.preferences || "",
            })
        }
    }, [customerData])

    const validate = () => {
        const errs = {}
        if (!form.firstName) errs.firstName = "First name is required"
        if (!form.phonePrimary) errs.phonePrimary = "Phone number is required"
        if (!form.email) errs.email = "Email is required"
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return

        try {
            if (id) {
                // Update
                await updateMutation.mutateAsync({ id, data: form })
                toast.success("Customer updated successfully!")
                navigate(-1)
            } else {
                // Create
                await createMutation.mutateAsync(form)
             
                toast.success("Customer created successfully!")
                setShowSuccess(true)
                navigate(`/${currentUser?.role}/pos/customer-info`)
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || "Something went wrong")
        }
    }

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    if (showSuccess) {
        return (
            <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50">
                <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <Check size={32} className="text-success" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Customer Created Successfully!</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        A new customer has been added to the system.
                    </p>
                    <div className="space-y-3 text-left mb-6">
                        <div className="flex items-center gap-2 text-sm p-3 bg-accent rounded-lg">
                            <span className="text-accent-foreground font-medium">Customer ID:</span>
                            <span className="font-mono">{newCustomer?.customerId || "CUST-XXXX"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm p-3 bg-accent rounded-lg">
                            <span className="text-accent-foreground font-medium">Loyalty Card Number:</span>
                            <span className="font-mono">{newCustomer?.loyaltyCardNumber || `LYL-${Math.floor(1000000 + Math.random() * 9000000)}`}</span>
                        </div>
                    </div>
                    <div className="bg-warning/10 text-warning p-3 rounded-lg text-sm mb-6 text-left">
                        <p className="font-medium mb-1">What's Next?</p>
                        <p className="text-xs">The customer profile has been created. You can now use this profile for transactions and loyalty tracking.</p>
                    </div>
                    <button
                        onClick={() => { setShowSuccess(false); navigate(-1); }}
                        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90"
                    >
                        Back to Customer List
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span>Customer Information</span><span>›</span>
                <span className="text-primary font-medium">{id ? "Edit Customer" : "Create New Customer"}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold">{id ? "Edit Customer" : "Create New Customer"}</h1>
            </div>

            <div className="bg-card rounded-lg border p-6 w-full">

                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm font-medium mb-1 block">
                            First Name <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => updateField("firstName", e.target.value)}
                            placeholder="First Name"
                            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card ${errors.firstName ? "border-destructive" : ""}`}
                        />
                        {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Last Name</label>
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => updateField("lastName", e.target.value)}
                            placeholder="Last Name"
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm font-medium mb-1 block">
                            Phone Number (Primary) <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="tel"
                            value={form.phonePrimary}
                            onChange={(e) => updateField("phonePrimary", e.target.value)}
                            placeholder="(555) 000-0000"
                            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card ${errors.phonePrimary ? "border-destructive" : ""}`}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Phone Number Alternate (OPTIONAL)</label>
                        <input
                            type="tel"
                            value={form.phoneAlternate}
                            onChange={(e) => updateField("phoneAlternate", e.target.value)}
                            placeholder="(555) 000-0000"
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="mb-6">
                    <label className="text-sm font-medium mb-1 block">
                        Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="email@example.com"
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card ${errors.email ? "border-destructive" : ""}`}
                    />
                </div>

                {/* Address */}
                <div className="mb-6">
                    <label className="text-sm font-medium mb-1 block">Street Address</label>
                    <input
                        type="text"
                        value={form.streetAddress}
                        onChange={(e) => updateField("streetAddress", e.target.value)}
                        placeholder="123 Main Street"
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card"
                    />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="text-sm font-medium mb-1 block">City</label>
                        <input type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)}
                            placeholder="City" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card" />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">State</label>
                        <input type="text" value={form.state} onChange={(e) => updateField("state", e.target.value)}
                            placeholder="State" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card" />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">ZIP</label>
                        <input type="text" value={form.zip} onChange={(e) => updateField("zip", e.target.value)}
                            placeholder="ZIP" className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card" />
                    </div>
                </div>

                {/* Loyalty */}
                <div className="mb-6">
                    <label className="text-sm font-medium mb-1 block">Enable Loyalty Program</label>
                    <select
                        value={form.loyaltyProgram}
                        onChange={(e) => updateField("loyaltyProgram", e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card"
                    >
                        <option>No Loyalty Program</option>
                        <option>Basic Rewards Program</option>
                        <option>Premium Loyalty Program</option>
                    </select>
                </div>

                {/* Communication */}
                <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block">Communication Preferences</label>
                    <div className="flex gap-6">
                        {["communicationEmail", "communicationSms", "communicationPush"].map((key) => (
                            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                                <Checkbox
                                    checked={form[key]}
                                    onCheckedChange={(checked) => updateField(key, checked)}
                                    className="accent-primary"
                                />
                                {key.replace("communication", "")}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Preferences */}
                <div className="mb-6">
                    <label className="text-sm font-medium mb-1 block">Notes</label>
                    <textarea
                        value={form.preferences}
                        onChange={(e) => updateField("preferences", e.target.value)}
                        placeholder="Enter any preferences or allergies..."
                        rows={3}
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary bg-card resize-none"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
                    >
                        {id ? "Update" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateCustomer
