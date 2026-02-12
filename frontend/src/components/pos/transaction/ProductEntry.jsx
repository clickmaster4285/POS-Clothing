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

    // Fetch products
    const { data: productsData } = useProducts();
    const products = productsData?.data || [];

    const filteredProducts = useMemo(() => {
        if (!query) return [];
        return products.filter(p =>
            p.productName.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, products]);

    const allSizes = selectedProduct?.variants?.map(v => v.size) || [];
    const allColors = selectedProduct?.variants?.flatMap(v => v.stockByAttribute.map(s => ({ name: s.color, quantity: s.quantity }))) || [];

    const selectedVariant = selectedProduct?.variants?.find(
        v => v.size === selectedSize && v.stockByAttribute.some(s => s.color === selectedColor)
    );

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        const firstVariant = product.variants[0];
        setSelectedSize(firstVariant?.size || '');
        setSelectedColor(firstVariant?.stockByAttribute[0]?.color || '');
        setQuantity(1);
        setQuery(product.productName);
        setShowResults(false);
    };

    const handleAddToCart = () => {
        if (!selectedProduct || !selectedSize || !selectedColor) return;

        const variantStock = selectedVariant?.stockByAttribute.find(s => s.color === selectedColor)?.quantity || 0;
        if (quantity > variantStock) {
            toast({ title: 'Insufficient stock', description: `Only ${variantStock} available`, variant: 'destructive' });
            return;
        }

        addToCart({
            id: `${selectedProduct._id}-${selectedSize}-${selectedColor}-${Date.now()}`,
            productId: selectedProduct._id,
            name: selectedProduct.productName,
            size: selectedSize,
            color: { name: selectedColor },
            quantity,
            unitPrice: selectedProduct.variants[0].price.retailPrice,
            discountPercent: 0,
            taxPercent: 8.5,
            image: selectedProduct.variants[0].images[0] || '',
        });

        toast({ title: 'Added to cart', description: `${selectedProduct.productName} (${selectedSize}, ${selectedColor}) x${quantity}` });
        setSelectedProduct(null);
        setQuery('');
        setSelectedSize('');
        setSelectedColor('');
        setQuantity(1);
    };

    const totalCartItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const defaultDropdownProducts = products.slice(0, 6); 
    return (
        <div className="space-y-6">

            {/* Transaction Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Transaction Numbers</p>
                    <h2 className="text-lg font-bold text-primary">{transactionNumber}</h2>
                    <p className="text-sm text-muted-foreground capitalize">Status: {status}</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="gap-2 bg-primary hover:bg-primary/90 text-white border-0"
                    disabled={cartItems.length === 0}
                >
                    <ShoppingCart className="w-4 h-4" />
                    View Cart {totalCartItems > 0 && <Badge className="bg-white text-primary">{totalCartItems}</Badge>}
                </Button>
            </div>

            {/* Search & Barcode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Search Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by product name..."
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                                onFocus={() => setShowResults(true)}
                                className="pl-10"
                            />
                            {showResults && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                                    {(query ? filteredProducts : defaultDropdownProducts).map(p => (
                                        <button
                                            key={p._id}
                                            onClick={() => handleSelectProduct(p)}
                                            className="w-full text-left px-4 py-3 hover:bg-muted flex items-center gap-3 border-b last:border-b-0"
                                        >
                                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                                                IMG
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{p.productName}</p>
                                                <p className="text-xs text-muted-foreground">{p.category?.categoryName} · ${p.variants[0].price.retailPrice}</p>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {p.variants.reduce((s, v) => s + v.stockByAttribute.reduce((q, x) => q + x.quantity, 0), 0)} in stock
                                            </Badge>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* {showResults && filteredProducts.length > 0 && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                                    {filteredProducts.map(p => (
                                        <button
                                            key={p._id}
                                            onClick={() => handleSelectProduct(p)}
                                            className="w-full text-left px-4 py-3 hover:bg-muted flex items-center gap-3 border-b last:border-b-0"
                                        >
                                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                                                IMG
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{p.productName}</p>
                                                <p className="text-xs text-muted-foreground">{p.category?.categoryName} · ${p.variants[0].price.retailPrice}</p>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {p.variants.reduce((s, v) => s + v.stockByAttribute.reduce((q, x) => q + x.quantity, 0), 0)} in stock
                                            </Badge>
                                        </button>
                                    ))}
                                </div>
                            )} */}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Barcode className="w-4 h-4" /> Barcode Entry
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder="Scan or enter barcode..." />
                        <p className="text-xs text-muted-foreground mt-2">Press Enter after scanning</p>
                    </CardContent>
                </Card>
            </div>

            {/* Selected Product */}
            {selectedProduct && (
                <Card className="relative">
                    {/* Close Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-red-600 hover:bg-card"
                        onClick={() => setSelectedProduct(null)}
                    >
                        ✕
                    </Button>

                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm shrink-0">
                                    IMG
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedProduct.productName}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedProduct.category?.categoryName}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{selectedProduct.description}</p>
                                    <p className="text-2xl font-bold text-primary mt-2">${selectedProduct.variants[0].price.retailPrice}</p>
                                </div>
                            </div>

                            {/* Configuration */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Size</label>
                                    <div className="flex flex-wrap gap-2">
                                        {allSizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${selectedSize === size
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-background border-input hover:bg-muted'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {allColors.map(color => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${selectedColor === color.name
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-input hover:bg-muted'
                                                    }`}
                                            >
                                                <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color.hex || 'gray' }} />
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-end gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Quantity</label>
                                        <div className="flex items-center gap-2">
                                            <Button size="icon" variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-4 h-4" /></Button>
                                            <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center" />
                                            <Button size="icon" variant="outline" onClick={() => setQuantity(quantity + 1)}><Plus className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                    {selectedVariant && (
                                        <Badge variant={selectedVariant.stock > 5 ? 'secondary' : 'destructive'} className="mb-1">
                                            {selectedVariant.stockByAttribute.find(s => s.color === selectedColor)?.quantity || 0} in stock
                                        </Badge>
                                    )}
                                </div>

                                <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="lg" onClick={handleAddToCart}>
                                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart — ${((selectedProduct?.variants[0].price.retailPrice || 0) * quantity).toFixed(2)}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}


            {/* Quick Browse */}
            <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Browse</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {products.slice(0, 6).map((p) => (
                        <button
                            key={p._id}
                            onClick={() => handleSelectProduct(p)}
                            className="text-left p-3 border rounded-lg hover:border-primary hover:shadow-sm transition-all bg-card"
                        >
                            <div className="w-full h-16 bg-muted rounded mb-2 flex items-center justify-center text-xs text-muted-foreground">
                                {p.variants[0].images[0] ? <img src={p.variants[0].images[0]} alt={p.productName} className="w-full h-full object-cover rounded" /> : 'IMG'}
                            </div>
                            <p className="font-medium text-sm truncate">{p.productName}</p>
                            <p className="text-xs text-muted-foreground">{p.category?.categoryName}</p>
                            <p className="text-sm font-semibold text-primary mt-1">${p.variants[0].price.retailPrice}</p>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
