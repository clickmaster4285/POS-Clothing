import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";



const variantStyles = {
    default: "border-border",
    success: "border-l-4 border-l-green-500",
    warning: "border-l-4 border-l-primary",
    destructive: "border-l-4 border-l-destructive",
};

export const KPICard = ({ title, value, icon, change, prefix = "", subtitle, variant = "default" }) => {
    const formatted = typeof value === "number"
        ? `${prefix}${value.toLocaleString()}`
        : value;

    return (
        <Card className={`${variantStyles[variant]} transition-shadow hover:shadow-md`}>
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold tracking-tight">{formatted}</p>
                        {change !== undefined && (
                            <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? "text-success" : "text-destructive"}`}>
                                {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {Math.abs(change)}% vs last period
                            </div>
                        )}
                        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg text-primary ">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
