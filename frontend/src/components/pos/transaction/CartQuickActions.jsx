import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransaction } from "@/context/TransactionContext";

export function CartQuickActions({
    onAddToCart,
    showAdd = true,
    showClear = true,
    className = "",
}) {
    const { clearCart, cartItems, setCurrentStep } = useTransaction();
    const totalCartItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className={`flex gap-2 mt-4 border-t-2 pt-4 ${className}`}>
            {showAdd && (
                <Button
                    onClick={() => {
                        if (onAddToCart) {
                            onAddToCart();
                            setCurrentStep(1); // go to cart view
                        }
                    }}
                    className="relative flex-1 flex items-center justify-center gap-2 bg-primary text-xl hover:bg-primary/90 text-white rounded-lg py-12 px-3 "
                    disabled={!onAddToCart}
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                    {totalCartItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                            {totalCartItems}
                        </span>
                    )}
                </Button>
            )}

            {showClear && (
                <Button
                    variant="destructive"
                    onClick={clearCart}
                    disabled={cartItems.length === 0}
                    className="flex-1 flex items-center text-xl justify-center gap-2 py-12 px-3 rounded-lg"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                </Button>
            )}
        </div>
    );
}
