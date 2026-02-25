// components/pos/transaction/Receipt.jsx
import { useTransaction } from '@/context/TransactionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useSettings } from "@/hooks/useSettings";
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';

export function Receipt() {
    const {
        cartItems,
        totals,
        transactionNumber,
        selectedCustomer,
        pointsEarned,
        pointsRedeemed,
        loyaltyDiscount,
        overallDiscountPercent,
        overallDiscountAmount
    } = useTransaction();

    const { data: settings } = useSettings();
    const currencySymbol = settings?.currencySymbol || '$';
    const scrollRef = useRef(null);

    // Auto-scroll to bottom when new items are added
    useEffect(() => {
        if (scrollRef.current) {
            const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollArea) {
                scrollArea.scrollTop = scrollArea.scrollHeight;
            }
        }
    }, [cartItems.length]);

    const formatCurrency = (value) => {
        const num = Number(value) || 0;
        return `${currencySymbol}${num.toFixed(2)}`;
    };

    const formatPoints = (value) => {
        const num = Number(value) || 0;
        return Math.floor(num).toString();
    };

    const currentDate = format(new Date(), 'dd/MM/yyyy HH:mm:ss');

    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    if (cartItems.length === 0) {
        return (
            <Card className="h-[65vh] flex flex-col">
                <CardContent className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                        <svg
                            className="w-16 h-16 mb-4 text-muted-foreground/30"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p>No items in receipt</p>
                        <p className="text-sm">Add products to see receipt</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            {/* Receipt Header - Fixed */}
            <CardHeader className="pb-3 border-b flex-shrink-0">
                <CardTitle className="text-lg text-center">Receipt</CardTitle>
                <div className="text-xs text-center text-muted-foreground space-y-0.5">
                    <div className="font-mono">{transactionNumber}</div>
                    <div>{currentDate}</div>
                </div>
            </CardHeader>

            {/* Customer Info - Fixed */}
            {selectedCustomer && (
                <div className="flex px-4 py-2 bg-muted/30 text-xs border-b flex-shrink-0">
                    <div className="font-medium">
                        {selectedCustomer.firstName} {selectedCustomer.lastName}{" "}
                    </div>
                    {selectedCustomer.loyaltyCardNumber && (
                        <div className="text-muted-foreground ml-1">
                            (Card no: {selectedCustomer.loyaltyCardNumber})
                        </div>
                    )}
                </div>
            )}

            {/* Column Headers - Fixed */}
            <div className="grid grid-cols-12 gap-1 px-4 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/10 flex-shrink-0">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Disc%</div>
                <div className="col-span-2 text-right">Total</div>
            </div>

         
            <div className="flex-1 min-h-0 relative" ref={scrollRef}>
                <ScrollArea className="h-[300px] px-4">
                    <div className="space-y-2 py-2">
                        {cartItems.map((item, index) => {
                            const unitPrice = Number(item.unitPrice) || 0;
                            const quantity = Number(item.quantity) || 1;
                            const discountPercent = Number(item.discountPercent) || 0;

                            const gross = unitPrice * quantity;
                            const discount = gross * (discountPercent / 100);
                            const lineTotal = gross - discount;

                            return (
                                <div key={item.id || index} className="border-b border-dashed pb-2 last:border-0">
                                    {/* Main row with columns */}
                                    <div className="grid grid-cols-12 gap-1 text-xs">
                                        {/* Item Name and Details - 6 columns */}
                                        <div className="col-span-6">
                                            <div className="font-medium line-clamp-1">
                                                {item.name}
                                            </div>
                                            {/* Variant details */}
                                            {(item.size || item.color) && (
                                                <div className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                                                    {item.size && <span>Sz: {item.size}</span>}
                                                    {item.color && (
                                                        <span className="flex items-center gap-0.5">
                                                            <span
                                                                className="w-2 h-2 rounded-full border"
                                                                style={{
                                                                    backgroundColor: item.color.toLowerCase(),
                                                                    borderColor: '#e2e8f0'
                                                                }}
                                                            />
                                                            {item.color}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Quantity - 2 columns */}
                                        <div className="col-span-2 text-center self-center">
                                            <Badge variant="outline" className="text-xs px-1.5">
                                                {quantity}
                                            </Badge>
                                        </div>

                                        {/* Discount - 2 columns */}
                                        <div className="col-span-2 text-right self-center">
                                            <div className={`font-medium ${discountPercent > 0 ? 'text-green-600' : ''}`}>
                                                {discountPercent > 0 ? `${discountPercent}%` : '-'}
                                            </div>
                                        </div>

                                        {/* Line Total - 2 columns */}
                                        <div className="col-span-2 text-right self-center">
                                            <div className="font-medium">
                                                {formatCurrency(lineTotal)}
                                            </div>
                                            {discountPercent > 0 && (
                                                <div className="text-[10px] text-muted-foreground line-through">
                                                    {formatCurrency(gross)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
            {/* Totals Section - Fixed */}
            <CardContent className="pt-3 border-t bg-muted/5 flex-shrink-0">
                <div className="space-y-1.5 text-sm">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>{formatCurrency(totals?.subtotal || 0)}</span>
                    </div>

                    {/* Item Discounts */}
                    {totals?.totalDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Item Discounts:</span>
                            <span>-{formatCurrency(totals.totalDiscount)}</span>
                        </div>
                    )}

                    {/* Overall Discount Percentage */}
                    {overallDiscountPercent > 0 && (
                        <div className="flex justify-between text-blue-600">
                            <span>Overall Discount ({overallDiscountPercent}%):</span>
                            <span>-{formatCurrency(overallDiscountAmount)}</span>
                        </div>
                    )}

                    {/* Loyalty Discount */}
                    {loyaltyDiscount > 0 && (
                        <div className="flex justify-between text-primary">
                            <span>Loyalty Discount:</span>
                            <span>-{formatCurrency(loyaltyDiscount)}</span>
                        </div>
                    )}

                    {/* Tax */}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax:</span>
                        <span>{formatCurrency(totals?.totalTax || 0)}</span>
                    </div>

                    <Separator className="my-2" />

                    {/* Grand Total */}
                    <div className="flex justify-between text-lg font-bold">
                        <span>TOTAL:</span>
                        <span className="text-primary">
                            {formatCurrency(totals?.grandTotal || 0)}
                        </span>
                    </div>

                    {/* Items summary */}
                    <div className="text-xs text-muted-foreground text-center pt-2 border-t border-dashed">
                        Total Items: {totalItems}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}