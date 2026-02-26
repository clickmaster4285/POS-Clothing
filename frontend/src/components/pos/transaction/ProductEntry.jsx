import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Barcode, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTransaction } from '@/context/TransactionContext';
import { useProducts } from "@/hooks/inv_hooks/useProducts";
import { toast } from '@/hooks/use-toast';
import { useAuth } from "@/hooks/useAuth"
import { useStockByBranch } from '@/hooks/inv_hooks/useStock'
import { useSettings } from "@/hooks/useSettings";


export function ProductEntry() {
    const { addToCart, setCurrentStep, cartItems, transactionNumber, status, selectedBranch, clearCart } = useTransaction();
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const searchInputRef = useRef(null);
    const resultsRef = useRef(null);
    const barcodeInputRef = useRef(null);
    const containerRef = useRef(null); // Add container ref for click outside

    const { data: settings } = useSettings();

    // Helper function to get color hex values
    const getColorHex = (colorName) => {
        const colorMap = {
            'red': '#ef4444',
            'blue': '#3b82f6',
            'green': '#22c55e',
            'yellow': '#eab308',
            'purple': '#a855f7',
            'pink': '#ec4899',
            'orange': '#f97316',
            'brown': '#92400e',
            'black': '#000000',
            'white': '#ffffff',
            'gray': '#6b7280',
            'grey': '#6b7280',
            'navy': '#1e3a8a',
            'teal': '#14b8a6',
            'cyan': '#06b6d4',
            'indigo': '#6366f1',
            'violet': '#8b5cf6',
            'fuschia': '#d946ef',
            'rose': '#f43f5e',
            'amber': '#f59e0b',
            'lime': '#84cc16',
            'emerald': '#10b981',
        };
        return colorMap[colorName?.toLowerCase()] || '#6b7280';
    };

    const { user: currentUser, role } = useAuth();

    const branchId = currentUser.role === "admin"
        ? selectedBranch?._id
        : currentUser.branch_id;

    // Fetch stock for the current user's branch
    const { data: branchStockData, isLoading: branchStockLoading, error: branchStockError } = useStockByBranch(branchId);
    const branchStock = branchStockData?.data || [];

    // Filter stock items based on search query
    const filteredStock = useMemo(() => {
        if (!query) return [];
        return branchStock.filter(stockItem =>
            stockItem.product?.productName?.toLowerCase().includes(query.toLowerCase()) ||
            stockItem.product?.sku?.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, branchStock]);

    const displayItems = query ? filteredStock : branchStock.slice(0, 6);

 

    // Reset selected index when items change
    useEffect(() => {
        setSelectedIndex(-1);
    }, [displayItems.length]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowResults(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddToCart = (stockItem) => {
        // Find the variant for this stock item
        const variant = stockItem.product?.variants?.find(v => v._id === stockItem.variantId);
        const currentPrice = variant?.price?.retailPrice || 0;

        addToCart({
            id: `${stockItem._id}-${Date.now()}`,
            productId: stockItem.product._id,
            stockId: stockItem._id,
            name: stockItem.product.productName,
            size: variant?.size || '',
            color: stockItem.color || '',
            quantity: 1,
            unitPrice: currentPrice,
            discountPercent: 0,
            taxPercent: 8.5,
            image: variant?.images?.[0] || '',
            variantId: stockItem.variantId,
            categoryId: stockItem?.product?.category?._id || '',
        });

        toast({
            title: 'Added to cart',
            description: `${stockItem.product.productName}${stockItem.color ? ` (${stockItem.color})` : ''} x1`
        });

        setQuery('');
        setShowResults(false);
        setSelectedIndex(-1);

        // Focus back on search input
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!showResults) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < displayItems.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && displayItems[selectedIndex]) {
                    handleAddToCart(displayItems[selectedIndex]);
                } else if (displayItems.length > 0) {
                    // If nothing selected but there are items, add the first one
                    handleAddToCart(displayItems[0]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowResults(false);
                setSelectedIndex(-1);
                break;
            case 'Tab':
                // Close results on tab out
                setShowResults(false);
                break;
        }
    };

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && resultsRef.current) {
            const selectedElement = resultsRef.current.children[selectedIndex];
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [selectedIndex]);

    // Handle barcode scan (Enter key in barcode input)
    const handleBarcodeKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const barcode = e.target.value.trim();
            if (!barcode) return;

            // Find product by SKU (assuming barcode is SKU)
            const foundItem = branchStock.find(item =>
                item.product?.sku?.toLowerCase() === barcode.toLowerCase()
            );

            if (foundItem) {
                handleAddToCart(foundItem);
                e.target.value = ''; // Clear barcode input
            } else {
                toast({
                    title: 'Product not found',
                    description: `No product found with barcode: ${barcode}`,
                    variant: 'destructive'
                });
            }
        }
    };

    const totalCartItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className="space-y-4 sm:space-y-6 mb-4">
            {/* Search & Barcode */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-3  ">

                    {/* Header */}
                    <div className="   flex flex-row items-center justify-between ">
                        <h2 className="text-sm sm:text-base font-semibold">
                            Search Product
                        </h2>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                if (cartItems.length === 0) {
                                    toast({ title: "Cart is already empty", variant: "destructive" });
                                    return;
                                }
                                if (confirm("Are you sure you want to clear the cart?")) {
                                    clearCart();
                                    toast({ title: "Cart cleared successfully" });
                                }
                            }}
                            className="gap-1 text-muted-foreground hover:text-destructive h-8 px-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-trash2"
                            >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 4V2h8v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                            <span className="text-xs">Clear</span>
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="pt-2">
                        <div className="relative" ref={containerRef}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                            <Input
                                ref={searchInputRef}
                                placeholder="Search by product name or SKU... (↑↓ arrows, Enter to select)"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setShowResults(true);
                                    setSelectedIndex(-1);
                                }}
                                onFocus={() => setShowResults(true)}
                                onKeyDown={handleKeyDown}
                                className="pl-10 text-sm"
                                autoFocus
                            />

                            {showResults && displayItems.length > 0 && (
                                <div
                                    ref={resultsRef}
                                    className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto"
                                >
                                    {displayItems.map((stockItem, index) => (
                                        <button
                                            key={stockItem._id}
                                            onClick={() => handleAddToCart(stockItem)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border-b last:border-b-0 transition-colors
                  ${selectedIndex === index
                                                    ? "bg-primary/10 border-primary"
                                                    : "hover:bg-muted"
                                                }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-xs sm:text-sm truncate">
                                                    {stockItem.product?.productName}
                                                </p>
                                                <p className="font-medium text-xs sm:text-sm truncate">
                                                    {stockItem.variantDetails?.size}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {stockItem.color && (
                                                        <>
                                                            <span
                                                                className="inline-block w-3 h-3 rounded-full mr-1 align-middle"
                                                                style={{
                                                                    backgroundColor: getColorHex(stockItem.color),
                                                                }}
                                                            />
                                                            {stockItem.color}
                                                        </>
                                                    )}
                                                    {stockItem.color &&
                                                        stockItem.location &&
                                                        " · "}
                                                    {stockItem.location}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <div className="font-medium text-sm">
                                                    {settings?.currencySymbol || "$"}
                                                    {stockItem.product?.variants
                                                        ?.find((v) => v._id === stockItem.variantId)
                                                        ?.price?.retailPrice?.toFixed(2) || "0.00"}
                                                </div>

                                                <Badge variant="secondary" className="text-xs">
                                                    {stockItem.currentStock} in stock
                                                </Badge>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}