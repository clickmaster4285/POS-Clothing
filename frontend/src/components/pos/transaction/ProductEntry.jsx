import { useState, useMemo } from 'react';
import { Search, Barcode, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTransaction } from '@/context/TransactionContext';
import { useProducts } from "@/hooks/inv_hooks/useProducts";
import { toast } from '@/hooks/use-toast';
import { useAuth } from "@/hooks/useAuth"
import { useStockByBranch } from '@/hooks/inv_hooks/useStock'

export function ProductEntry() {
    const { addToCart, setCurrentStep, cartItems, transactionNumber, status, selectedBranch, clearCart } = useTransaction();
    const [query, setQuery] = useState('');
    const [selectedStockItem, setSelectedStockItem] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [showResults, setShowResults] = useState(false);


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

   

    // Fetch products (keeping for product data enrichment if needed)
    const { data: productsData } = useProducts();
    const products = productsData?.data || [];

    // Filter stock items based on search query
    const filteredStock = useMemo(() => {
        if (!query) return [];
        return branchStock.filter(stockItem =>
            stockItem.product?.productName?.toLowerCase().includes(query.toLowerCase()) ||
            stockItem.product?.sku?.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, branchStock]);

    // Get current variant data from the selected stock item
    const selectedVariant = useMemo(() => {
        if (!selectedStockItem?.product?.variants || !selectedStockItem?.variantId) return null;
        return selectedStockItem.product.variants.find(v => v?._id === selectedStockItem.variantId);
    }, [selectedStockItem]);

    // Get current price from the variant
    const currentPrice = useMemo(() => {
        return selectedVariant?.price?.retailPrice || 0;
    }, [selectedVariant]);

    // Current stock is directly from the stock item
    const currentStock = selectedStockItem?.currentStock || 0;

    // Get available colors for the selected product (from variants)
    const availableColors = useMemo(() => {
        if (!selectedStockItem?.product?.variants) return [];

        // Get all colors from all variants of this product
        const colors = new Set();
        selectedStockItem.product.variants.forEach(variant => {
            if (variant.stockByAttribute && Array.isArray(variant.stockByAttribute)) {
                variant.stockByAttribute.forEach(stock => {
                    if (stock?.color) {
                        colors.add(stock.color);
                    }
                });
            }
        });

        return Array.from(colors).map(color => ({
            name: color,
            hex: getColorHex(color),
            // Check if this color has stock in the current branch
            hasStock: branchStock.some(s =>
                s?.product?._id === selectedStockItem.product._id &&
                s?.color === color &&
                s?.currentStock > 0
            )
        }));
    }, [selectedStockItem, branchStock]);

    // Get available sizes for the selected product (from variants)
    const availableSizes = useMemo(() => {
        if (!selectedStockItem?.product?.variants) return [];

        return [...new Set(
            selectedStockItem.product.variants
                .map(v => v?.size)
                .filter(size => size) // Remove undefined/null sizes
        )];
    }, [selectedStockItem]);

    // NEW: Function to find stock item for selected size and color
    const findStockItemForSelection = (size, color) => {
        if (!selectedStockItem?.product) return null;
        
        // Find the variant that matches the size
        const variant = selectedStockItem.product.variants.find(v => v.size === size);
        if (!variant) return null;
        
        // Find stock item for this variant and color
        return branchStock.find(s =>
            s?.product?._id === selectedStockItem.product._id &&
            s?.variantId === variant._id &&
            s?.color === color &&
            s?.currentStock > 0
        );
    };

    // UPDATED: Handle size change - update selected stock item when size changes
    const handleSizeChange = (size) => {
        setSelectedSize(size);
        
        // Find the stock item for the new size with current color
        const newStockItem = findStockItemForSelection(size, selectedColor);
        if (newStockItem) {
            setSelectedStockItem(newStockItem);
        }
    };

    // UPDATED: Handle color change - update selected stock item when color changes
    const handleColorChange = (color) => {
        setSelectedColor(color);
        
        // Find the stock item for the new color with current size
        const newStockItem = findStockItemForSelection(selectedSize, color);
        if (newStockItem) {
            setSelectedStockItem(newStockItem);
        }
    };

    const handleSelectStockItem = (stockItem) => {
        setSelectedStockItem(stockItem);
        setSelectedColor(stockItem.color || '');

        // Find the variant for this stock item
        const variant = stockItem.product?.variants?.find(v => v._id === stockItem.variantId);
        setSelectedSize(variant?.size || '');

        setQuantity(1);
        setQuery(stockItem.product?.productName || '');
        setShowResults(false);
    };

    const handleAddToCart = () => {
        if (!selectedStockItem || !selectedVariant) return;

        if (quantity > currentStock) {
            toast({
                title: 'Insufficient stock',
                description: `Only ${currentStock} available`,
                variant: 'destructive'
            });
            return;
        }
       
        addToCart({
            id: `${selectedStockItem._id}-${Date.now()}`,
            productId: selectedStockItem.product._id,
            stockId: selectedStockItem._id,
            name: selectedStockItem.product.productName,
            size: selectedSize,
            color: selectedColor,
            quantity,
            unitPrice: currentPrice,
            discountPercent: 0,
            taxPercent: 8.5,
            image: selectedVariant?.images?.[0] || '',
            variantId: selectedStockItem.variantId,
            categoryId: selectedStockItem?.product?.category?._id || '',
        });


    
        toast({
            title: 'Added to cart',
            description: `${selectedStockItem.product.productName} (${selectedSize}, ${selectedColor}) x${quantity}`
        });

        setSelectedStockItem(null);
        setQuery('');
        setSelectedSize('');
        setSelectedColor('');
        setQuantity(1);
    };

    const totalCartItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const defaultStockItems = branchStock.slice(0, 6);
   

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Transaction Info - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-full sm:w-auto">
                    <p className="text-xs sm:text-sm text-muted-foreground">Transaction Number</p>
                    <h2 className="text-base sm:text-lg font-bold text-primary break-all">{transactionNumber}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">Status: {status}</p>
                </div>
                <div className='flex gap-2'>   <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-white border-0"
                    disabled={cartItems.length === 0}
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="sm:hidden">Cart</span>
                    <span className="hidden sm:inline">View Cart</span>
                    {totalCartItems > 0 && (
                        <Badge className="bg-white text-primary ml-1">
                            {totalCartItems}
                        </Badge>
                    )}
                </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (cartItems.length === 0) {
                                toast({ title: 'Cart is already empty', variant: 'destructive' });
                                return;
                            }
                            if (confirm('Are you sure you want to clear the cart?')) {
                                clearCart(); // Make sure this exists in your context
                                toast({ title: 'Cart cleared successfully' });
                            }
                        }}
                        className="w-full sm:w-auto"
                    >
                        Clear Cart
                    </Button></div>
            </div>

            {/* Search & Barcode - Stack on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                        <CardTitle className="text-sm sm:text-base">Search Product</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by product name or SKU..."
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                                onFocus={() => setShowResults(true)}
                                className="pl-10 text-sm"
                            />
                            {showResults && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                                    {(query ? filteredStock : defaultStockItems).map(stockItem => (
                                        <button
                                            key={stockItem._id}
                                            onClick={() => handleSelectStockItem(stockItem)}
                                            className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted flex items-center gap-2 sm:gap-3 border-b last:border-b-0"
                                        >
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                                                {stockItem.product?.variants?.[0]?.images?.[0] ? (
                                                    <img
                                                        src={stockItem.product.variants[0].images[0]}
                                                        alt={stockItem.product.productName}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                ) : (
                                                    'IMG'
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-xs sm:text-sm truncate">
                                                    {stockItem.product?.productName}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {stockItem.color} · {stockItem.location}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                                                {stockItem.currentStock} in stock
                                            </Badge>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <Barcode className="w-4 h-4" />
                            <span className="sm:hidden">Barcode</span>
                            <span className="hidden sm:inline">Barcode Entry</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        <Input placeholder="Scan barcode" className="text-sm" />
                        <p className="text-xs text-muted-foreground mt-2">Press Enter after scanning</p>
                    </CardContent>
                </Card>
            </div>

            {/* Selected Stock Item - Mobile Optimized */}
            {selectedStockItem && (
                <Card className="relative overflow-hidden">
                    {/* Close Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-red-600 hover:bg-card"
                        onClick={() => setSelectedStockItem(null)}
                    >
                        ✕
                    </Button>

                    <CardContent className="pt-6 px-4 sm:px-6">
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                            {/* Product Info - Mobile: Horizontal Layout */}
                            <div className="flex gap-3 sm:gap-4 lg:w-1/2">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs sm:text-sm flex-shrink-0">
                                    {selectedVariant?.images?.[0] || selectedStockItem.product?.variants?.[0]?.images?.[0] ? (
                                        <img
                                            src={selectedVariant?.images?.[0] || selectedStockItem.product.variants[0].images[0]}
                                            alt={selectedStockItem.product.productName}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        'IMG'
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base sm:text-lg truncate">
                                        {selectedStockItem.product.productName}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                        SKU: {selectedStockItem.product.sku}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Location: {selectedStockItem.location}
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold text-primary mt-2">
                                        ${currentPrice?.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Configuration - Mobile: Full Width */}
                            <div className="space-y-4 lg:w-1/2">
                                {/* Size Selection - Scrollable on Mobile */}
                                {availableSizes.length > 0 && (
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium mb-2 block">Size</label>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {availableSizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => handleSizeChange(size)} // UPDATED: Use handleSizeChange
                                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium border transition-colors ${selectedSize === size
                                                            ? 'bg-primary text-white border-primary'
                                                            : 'bg-background border-input hover:bg-muted'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Color Selection */}
                                {availableColors.length > 0 && (
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium mb-2 block">Color</label>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {availableColors.map(color => {
                                                const hasStock = color.hasStock;
                                                return (
                                                    <button
                                                        key={color.name}
                                                        onClick={() => handleColorChange(color.name)} // UPDATED: Use handleColorChange
                                                        disabled={!hasStock}
                                                        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm border transition-colors ${!hasStock ? 'opacity-50 cursor-not-allowed' : ''
                                                            } ${selectedColor === color.name
                                                                ? 'border-primary bg-primary/10'
                                                                : 'border-input hover:bg-muted'
                                                            }`}
                                                    >
                                                        <span
                                                            className="w-4 h-4 rounded-full border border-border shadow-sm"
                                                            style={{ backgroundColor: color.hex }}
                                                        />
                                                        <span className="hidden xs:inline">{color.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity and Stock - Mobile Optimized */}
                                <div className="flex flex-col xs:flex-row xs:items-end gap-3 xs:gap-4">
                                    <div className="w-full xs:w-auto">
                                        <label className="text-xs sm:text-sm font-medium mb-2 block">Quantity</label>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                            >
                                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={currentStock}
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.min(currentStock, Math.max(1, parseInt(e.target.value) || 1)))}
                                                className="w-16 sm:w-20 text-center text-sm h-8 sm:h-9"
                                            />
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                                disabled={quantity >= currentStock}
                                            >
                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={currentStock > 5 ? 'secondary' : 'destructive'}
                                        className="w-fit xs:mb-1"
                                    >
                                        {currentStock} in stock at {selectedStockItem.location}
                                    </Badge>
                                </div>

                                {/* Add to Cart Button - Full Width on Mobile */}
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90 text-white"
                                    size="lg"
                                    onClick={handleAddToCart}
                                    disabled={!selectedVariant || quantity > currentStock}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add — ${(currentPrice * quantity).toFixed(2)}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

          
            {/* Quick Browse - Responsive Grid with Product Grouping */}
            <div>
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">Quick Browse - Available Stock</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                    {(() => {
                        // Group stock items by product ID
                        const groupedByProduct = branchStock.slice(0, 10).reduce((acc, stockItem) => {
                            const productId = stockItem.product?._id;
                            if (!acc[productId]) {
                                acc[productId] = {
                                    product: stockItem.product,
                                    variants: []
                                };
                            }
                            acc[productId].variants.push(stockItem);
                            return acc;
                        }, {});

                        return Object.values(groupedByProduct).map((group) => (
                            <Card key={group.product._id} className="overflow-hidden">
                                <CardContent className="p-3 sm:p-4">
                                    {/* Product Header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground overflow-hidden flex-shrink-0">
                                            {group.product?.variants?.[0]?.images?.[0] ? (
                                                <img
                                                    src={group.product.variants[0].images[0]}
                                                    alt={group.product.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                'IMG'
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm sm:text-base truncate">
                                                {group.product.productName}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                SKU: {group.product.sku}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {group.variants.length} variant(s) available
                                            </p>
                                        </div>
                                    </div>

                                    {/* Variants List */}
                                    <div className="space-y-2 mt-2">
                                        {group.variants.map((variant) => {
                                            // Find the variant details to get size and price
                                            const variantDetails = group.product.variants?.find(v => v._id === variant.variantId);
                                            const variantPrice = variantDetails?.price?.retailPrice || variant.retailPrice || 0;

                                            return (
                                                <button
                                                    key={variant._id}
                                                    onClick={() => handleSelectStockItem(variant)}
                                                    className="w-full flex items-center justify-between p-2 rounded-lg border hover:border-primary hover:bg-muted/50 transition-all"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {/* Color Indicator */}
                                                        {variant.color && (
                                                            <span
                                                                className="w-4 h-4 rounded-full border border-border shadow-sm"
                                                                style={{ backgroundColor: getColorHex(variant.color) }}
                                                                title={variant.color}
                                                            />
                                                        )}
                                                        {/* Size */}
                                                        {variantDetails?.size && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Size: {variantDetails.size}
                                                            </Badge>
                                                        )}
                                                  
                                                       
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {/* Price */}
                                                        <span className="text-sm font-semibold text-primary">
                                                            ${variantPrice.toFixed(2)}
                                                        </span>
                                                        {/* Stock Status */}
                                                        <Badge
                                                            variant={variant.currentStock > 5 ? 'secondary' : 'destructive'}
                                                            className="text-xs"
                                                        >
                                                            {variant.currentStock}
                                                        </Badge>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* View All Variants Button (if more than 3 variants) */}
                                    {group.variants.length > 3 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full mt-2 text-xs"
                                            onClick={() => {
                                                // Optional: Expand or navigate to product view
                                                console.log('Show all variants for', group.product.productName);
                                            }}
                                        >
                                            View all {group.variants.length} variants
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ));
                    })()}
                </div>
            </div>
        </div>
    );
}