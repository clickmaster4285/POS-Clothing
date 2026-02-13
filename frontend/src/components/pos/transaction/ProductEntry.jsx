import { useState, useMemo } from 'react';
import { Search, Barcode, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTransaction } from '@/context/TransactionContext';
import { useProducts } from "@/hooks/inv_hooks/useProducts";
import { toast } from '@/hooks/use-toast';

export function ProductEntry() {
    const { addToCart, setCurrentStep, cartItems, transactionNumber, status } = useTransaction();
    const [query, setQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
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
        return colorMap[colorName.toLowerCase()] || '#6b7280';
    };

    // Fetch products
    const { data: productsData } = useProducts();
    const products = productsData?.data || [];

    const filteredProducts = useMemo(() => {
        if (!query) return [];
        return products.filter(p =>
            p.productName.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, products]);

    // Get all available sizes for selected product
    const allSizes = useMemo(() => {
        if (!selectedProduct) return [];
        return [...new Set(selectedProduct.variants.map(v => v.size))];
    }, [selectedProduct]);

    // Get all available colors with their variants and prices
    const allColors = useMemo(() => {
        if (!selectedProduct) return [];

        const colorMap = new Map();

        selectedProduct.variants.forEach(variant => {
            variant.stockByAttribute.forEach(stock => {
                const colorName = stock.color;
                if (!colorMap.has(colorName)) {
                    colorMap.set(colorName, {
                        name: colorName,
                        hex: getColorHex(colorName),
                        variants: [],
                        totalStock: 0
                    });
                }
                const colorData = colorMap.get(colorName);
                colorData.variants.push({
                    size: variant.size,
                    price: variant.price,
                    quantity: stock.quantity,
                    variantId: variant._id
                });
                colorData.totalStock += stock.quantity;
            });
        });

        return Array.from(colorMap.values());
    }, [selectedProduct]);

    // Get current variant based on selected size and color
    const selectedVariant = useMemo(() => {
        if (!selectedProduct || !selectedSize || !selectedColor) return null;

        return selectedProduct.variants.find(v =>
            v.size === selectedSize &&
            v.stockByAttribute.some(s => s.color === selectedColor)
        );
    }, [selectedProduct, selectedSize, selectedColor]);

    // Get current price based on selected variant
    const currentPrice = useMemo(() => {
        return selectedVariant?.price?.retailPrice ||
            selectedProduct?.variants[0]?.price?.retailPrice ||
            0;
    }, [selectedVariant, selectedProduct]);

    // Get current stock for selected color
    const currentStock = useMemo(() => {
        if (!selectedVariant || !selectedColor) return 0;
        return selectedVariant.stockByAttribute.find(s => s.color === selectedColor)?.quantity || 0;
    }, [selectedVariant, selectedColor]);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        const firstVariant = product.variants[0];
        const firstColor = firstVariant?.stockByAttribute[0]?.color || '';

        setSelectedSize(firstVariant?.size || '');
        setSelectedColor(firstColor);
        setQuantity(1);
        setQuery(product.productName);
        setShowResults(false);
    };

    const handleAddToCart = () => {
        if (!selectedProduct || !selectedSize || !selectedColor || !selectedVariant) return;

        if (quantity > currentStock) {
            toast({
                title: 'Insufficient stock',
                description: `Only ${currentStock} available`,
                variant: 'destructive'
            });
            return;
        }

        addToCart({
            id: `${selectedProduct._id}-${selectedSize}-${selectedColor}-${Date.now()}`,
            productId: selectedProduct._id,
            name: selectedProduct.productName,
            size: selectedSize,
            color: {
                name: selectedColor,
                hex: getColorHex(selectedColor)
            },
            quantity,
            unitPrice: currentPrice,
            discountPercent: 0,
            taxPercent: 8.5,
            image: selectedVariant?.images?.[0] || selectedProduct.variants[0].images[0] || '',
        });

        toast({
            title: 'Added to cart',
            description: `${selectedProduct.productName} (${selectedSize}, ${selectedColor}) x${quantity}`
        });

        setSelectedProduct(null);
        setQuery('');
        setSelectedSize('');
        setSelectedColor('');
        setQuantity(1);
    };

    const totalCartItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const defaultDropdownProducts = products.slice(0, 6);

    // Calculate total stock for a product
    const getTotalStock = (product) => {
        return product.variants.reduce((total, variant) => {
            return total + variant.stockByAttribute.reduce((sum, stock) => sum + stock.quantity, 0);
        }, 0);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Transaction Info - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-full sm:w-auto">
                    <p className="text-xs sm:text-sm text-muted-foreground">Transaction Number</p>
                    <h2 className="text-base sm:text-lg font-bold text-primary break-all">{transactionNumber}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">Status: {status}</p>
                </div>
                <Button
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
                                placeholder="Search by product name..."
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                                onFocus={() => setShowResults(true)}
                                className="pl-10 text-sm"
                            />
                            {showResults && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                                    {(query ? filteredProducts : defaultDropdownProducts).map(p => (
                                        <button
                                            key={p._id}
                                            onClick={() => handleSelectProduct(p)}
                                            className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted flex items-center gap-2 sm:gap-3 border-b last:border-b-0"
                                        >
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                                                {p.variants[0]?.images?.[0] ? (
                                                    <img src={p.variants[0].images[0]} alt={p.productName} className="w-full h-full object-cover rounded" />
                                                ) : (
                                                    'IMG'
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-xs sm:text-sm truncate">{p.productName}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {p.category?.categoryName} · From ${Math.min(...p.variants.map(v => v.price.retailPrice))}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="text-xs flex-shrink-0 hidden sm:inline-flex">
                                                {getTotalStock(p)} in stock
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs sm:hidden">
                                                {getTotalStock(p)}
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
                        <Input placeholder="Scan or enter barcode..." className="text-sm" />
                        <p className="text-xs text-muted-foreground mt-2">Press Enter after scanning</p>
                    </CardContent>
                </Card>
            </div>

            {/* Selected Product - Mobile Optimized */}
            {selectedProduct && (
                <Card className="relative overflow-hidden">
                    {/* Close Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-red-600 hover:bg-card"
                        onClick={() => setSelectedProduct(null)}
                    >
                        ✕
                    </Button>

                    <CardContent className="pt-6 px-4 sm:px-6">
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                            {/* Product Info - Mobile: Horizontal Layout */}
                            <div className="flex gap-3 sm:gap-4 lg:w-1/2">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs sm:text-sm flex-shrink-0">
                                    {selectedVariant?.images?.[0] || selectedProduct.variants[0]?.images?.[0] ? (
                                        <img
                                            src={selectedVariant?.images?.[0] || selectedProduct.variants[0].images[0]}
                                            alt={selectedProduct.productName}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        'IMG'
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base sm:text-lg truncate">{selectedProduct.productName}</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{selectedProduct.category?.categoryName}</p>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-3">{selectedProduct.description}</p>
                                    <p className="text-xl sm:text-2xl font-bold text-primary mt-2">{currentPrice}</p>
                                </div>
                            </div>

                            {/* Configuration - Mobile: Full Width */}
                            <div className="space-y-4 lg:w-1/2">
                                {/* Size Selection - Scrollable on Mobile */}
                                {allSizes.length > 0 && (
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium mb-2 block">Size</label>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {allSizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
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

                                {/* Color Selection - Only show colors available for selected size */}
                                <div>
                                    <label className="text-xs sm:text-sm font-medium mb-2 block">Color</label>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {allColors
                                            .filter(color =>
                                                !selectedSize ||
                                                color.variants.some(v => v.size === selectedSize && v.quantity > 0)
                                            )
                                            .map(color => {
                                                const isAvailable = color.variants.some(v =>
                                                    v.size === selectedSize && v.quantity > 0
                                                );
                                                const price = color.variants.find(v => v.size === selectedSize)?.price?.retailPrice;

                                                return (
                                                    <button
                                                        key={color.name}
                                                        onClick={() => {
                                                            setSelectedColor(color.name);
                                                            // Auto-select the size that has this color if not selected
                                                            if (!selectedSize) {
                                                                const availableVariant = color.variants.find(v => v.quantity > 0);
                                                                if (availableVariant) {
                                                                    setSelectedSize(availableVariant.size);
                                                                }
                                                            }
                                                        }}
                                                        disabled={!isAvailable}
                                                        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm border transition-colors ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''
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
                                                        {price && selectedSize && (
                                                            <span className="text-xs text-muted-foreground ml-1">
                                                                {price}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>

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
                                                disabled={!selectedSize || !selectedColor}
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
                                                disabled={!selectedSize || !selectedColor}
                                            />
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                                disabled={!selectedSize || !selectedColor || quantity >= currentStock}
                                            >
                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {selectedVariant && selectedColor && (
                                        <Badge
                                            variant={currentStock > 5 ? 'secondary' : 'destructive'}
                                            className="w-fit xs:mb-1"
                                        >
                                            {currentStock} in stock
                                        </Badge>
                                    )}
                                </div>

                                {/* Add to Cart Button - Full Width on Mobile */}
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90 text-white"
                                    size="lg"
                                    onClick={handleAddToCart}
                                    disabled={!selectedSize || !selectedColor || !selectedVariant || quantity > currentStock}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add — {(currentPrice * quantity).toFixed(2)}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Browse - Responsive Grid */}
            <div>
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">Quick Browse</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
                    {products.slice(0, 6).map((p) => (
                        <button
                            key={p._id}
                            onClick={() => handleSelectProduct(p)}
                            className="text-left p-2 sm:p-3 border rounded-lg hover:border-primary hover:shadow-sm transition-all bg-card"
                        >
                            <div className="w-full aspect-square bg-muted rounded mb-1.5 sm:mb-2 flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                                {p.variants[0]?.images?.[0] ? (
                                    <img src={p.variants[0].images[0]} alt={p.productName} className="w-full h-full object-cover" />
                                ) : (
                                    'IMG'
                                )}
                            </div>
                            <p className="font-medium text-xs sm:text-sm truncate">{p.productName}</p>
                            <p className="text-xs text-muted-foreground truncate hidden sm:block">{p.category?.categoryName}</p>
                            <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5 sm:mt-1">
                                From {Math.min(...p.variants.map(v => v.price.retailPrice))}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}