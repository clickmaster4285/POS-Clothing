"use client";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomer } from "@/hooks/pos_hooks/useCustomer";
import { Mail, Phone, MapPin, ArrowLeft, Send, Star, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTransactionsByCustomer } from "@/hooks/pos_hooks/useTransaction";

const CustomerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    // Fetch customer from API
    const { data: customer, isLoading, isError } = useCustomer(id);

    // Fetch transactions for this customer
    const { data: transactionsData, isLoading: transactionsLoading } = useTransactionsByCustomer(customer?._id);


    const transactions = transactionsData?.transactions || [];


    console.log("transactionsData:", transactionsData);


    if (isLoading) return <div>Loading customer...</div>;
    if (isError || !customer) return <div>Customer not found.</div>;

    return (
        <div>
            {/* Breadcrumb */}
            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span>Customer Information</span><span>›</span>
                <span className="text-primary font-medium">Customer Profile</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold">Customer Profile</h1>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Left - Customer Info */}
                <div className="col-span-2 space-y-6">
                    <div className="bg-card rounded-lg border p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                                    {customer.firstName[0]}{customer.lastName?.[0] || ""}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">{customer.firstName} {customer.lastName}</h2>
                                    <p className="text-sm text-muted-foreground">{customer.customerId}</p>
                                    <span className={`pos-badge ${customer.isActive ? "pos-badge-success" : "pos-badge-destructive"} mt-1`}>
                                        {customer.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="text-sm text-primary hover:underline"
                                onClick={() => navigate(`/${currentUser?.role}/pos/${customer._id}/edit`)}
                            >
                                Edit Profile
                            </button>
                        </div>

                        {/* Contact info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground"><Phone size={14} /> {customer.phonePrimary}</div>
                            <div className="flex items-center gap-2 text-muted-foreground"><Mail size={14} /> {customer.email}</div>
                            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                                <MapPin size={14} /> {customer.streetAddress}, {customer.city}, {customer.state} {customer.zip}
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="border-t mt-6 pt-4">
                            <h3 className="font-semibold mb-3">ADDRESS</h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <div><span className="text-muted-foreground">Contact Name:</span></div>
                                <div>{customer.firstName} {customer.lastName}</div>
                                <div><span className="text-muted-foreground">Street Address:</span></div>
                                <div>{customer.streetAddress}</div>
                                <div><span className="text-muted-foreground">City/State/Zip:</span></div>
                                <div>{customer.city}, {customer.state} {customer.zip}</div>
                            </div>
                        </div>

                        {/* Communication history / Transactions */}
                        <div className="border-t mt-6 pt-4">
                            {/* <div className="flex gap-4 mb-4">
                                <button className="text-sm font-medium text-primary border-b-2 border-primary pb-1">Email</button>
                                <button className="text-sm font-medium text-muted-foreground pb-1">SMS</button>
                                <button className="text-sm font-medium text-muted-foreground pb-1">Push Notifications</button>
                            </div> */}

                            <h3 className="font-semibold mb-3">Recent Transactions</h3>

                            {transactionsLoading && <p className="text-muted-foreground text-sm">Loading transactions...</p>}

                            {transactions.length === 0 && !transactionsLoading && (
                                <p className="text-muted-foreground text-sm">No transactions found.</p>
                            )}

                            {transactions.map((tx) => (
                                <div
                                    key={tx._id}
                                    className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg mb-2"
                                >
                                    <div>
                                        <p className="font-medium">{tx.transactionNumber}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(tx.createdAt).toLocaleDateString()} – Status: {tx.status}
                                        </p>

                                        {/* Show cart items */}
                                        {tx.cartItems?.map((item, i) => (
                                            <p key={i} className="text-xs text-muted-foreground ml-2">
                                                {item.name} x {item.quantity} – ${item.unitPrice}
                                            </p>
                                        ))}
                                    </div>
                                    <span className={`pos-badge ${tx.status === "completed" ? "pos-badge-success" : "pos-badge-destructive"}`}>
                                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        {/* <div className="flex gap-3 mt-6">
                            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                                <Send size={14} /> Send To Transaction
                            </button>
                            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted">
                                Mark Customer To Remember
                            </button>
                        </div> */}
                    </div>
                </div>

                {/* Right - Loyalty Program */}
                <div className="space-y-6">
                    <div className="bg-card rounded-lg border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Award size={20} className="text-primary" />
                            <h3 className="font-semibold">Loyalty Program</h3>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">Member Since</div>
                        <div className="text-sm mb-4">{new Date(customer.createdAt).toLocaleDateString()}</div>

                        {/* Loyalty Card */}
                        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-5 mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <Star size={24} />
                                <span className="text-xs opacity-80">LOYALTY CARD</span>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold">{customer.loyaltyProgram}</p>
                                <div className="flex items-center justify-center gap-3 mt-3">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">{customer.loyaltyPoints || 0}</p>
                                        <p className="text-xs opacity-80">Points Earned</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">${customer.lifetimeValue || 0}</p>
                                        <p className="text-xs opacity-80">Lifetime Value</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="text-center text-sm text-muted-foreground">
                            Reward: 5 Stars = 100 pts
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
