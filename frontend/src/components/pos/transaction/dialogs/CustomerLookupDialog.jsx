// @/components/pos/transaction/dialogs/CustomerLookupDialog.tsx
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Award } from 'lucide-react';
import { useTransaction } from '@/context/TransactionContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';



// Mock customers data - in real app, this would come from an API
const MOCK_CUSTOMERS = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0101', points: 120, tier: 'Silver' },
    { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', phone: '555-0102', points: 340, tier: 'Gold' },
    { id: '3', name: 'Michael Brown', email: 'michael@example.com', phone: '555-0103', points: 75, tier: 'Bronze' },
    { id: '4', name: 'Emily Johnson', email: 'emily@example.com', phone: '555-0104', points: 520, tier: 'Platinum' },
    { id: '5', name: 'David Wilson', email: 'david@example.com', phone: '555-0105', points: 210, tier: 'Gold' },
];

export function CustomerLookupDialog({ open, onOpenChange }) {
    const { selectedCustomer, setSelectedCustomer } = useTransaction();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        // Simulate API call
        setTimeout(() => {
            const results = MOCK_CUSTOMERS.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone.includes(searchTerm)
            );
            setSearchResults(results);
            setIsSearching(false);
        }, 500);
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        toast({
            title: 'Customer selected',
            description: `${customer.name} has been added to this transaction`,
        });
        onOpenChange(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleClearCustomer = () => {
        setSelectedCustomer(null);
        toast({
            title: 'Customer removed',
            description: 'Continuing as guest',
        });
        onOpenChange(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Platinum': return 'text-purple-600 bg-purple-100';
            case 'Gold': return 'text-yellow-600 bg-yellow-100';
            case 'Silver': return 'text-gray-600 bg-gray-100';
            case 'Bronze': return 'text-amber-600 bg-amber-100';
            default: return 'text-blue-600 bg-blue-100';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Customer Lookup</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Current Customer Section */}
                    {selectedCustomer && (
                        <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="font-semibold">Current Customer</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearCustomer}
                                    className="text-destructive hover:text-destructive"
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{selectedCustomer.name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                                    <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium",
                                        getTierColor(selectedCustomer.tier)
                                    )}>
                                        {selectedCustomer.tier}
                                    </span>
                                    <div className="flex items-center gap-1 mt-1 text-sm">
                                        <Award className="w-3 h-3" />
                                        <span>{selectedCustomer.points} pts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Search Customer
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-9"
                                    autoFocus
                                />
                            </div>
                            <Button onClick={handleSearch} disabled={isSearching}>
                                {isSearching ? 'Searching...' : 'Search'}
                            </Button>
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Search Results ({searchResults.length})</p>
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {searchResults.map((customer) => (
                                    <button
                                        key={customer.id}
                                        onClick={() => handleSelectCustomer(customer)}
                                        className="w-full p-3 flex items-center justify-between hover:bg-muted rounded-lg transition-colors text-left border"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{customer.name}</p>
                                                <p className="text-sm text-muted-foreground">{customer.email}</p>
                                                <p className="text-sm text-muted-foreground">{customer.phone}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                getTierColor(customer.tier)
                                            )}>
                                                {customer.tier}
                                            </span>
                                            <div className="flex items-center gap-1 mt-1 text-sm">
                                                <Award className="w-3 h-3" />
                                                <span>{customer.points} pts</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchTerm && !isSearching && searchResults.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No customers found</p>
                            <p className="text-sm">Try a different search term</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}