export function StatCard({
    title,
    value,
    icon: Icon,
    iconColor = "text-primary",
    bgColor = "bg-card",   // default card background
    trend,
    className = "",
}) {
    return (
        <div className={`rounded-xl p-6 shadow-sm border border-border/50 ${bgColor} ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-card-foreground">{value}</p>

                    {trend && (
                        <p
                            className={`mt-1 text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {trend.isPositive ? "+" : "-"}
                            {Math.abs(trend.value)}% from last month
                        </p>
                    )}
                </div>

                {Icon && (
                    <div className="rounded-lg p-3 bg-white/60 dark:bg-black/20">
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                )}
            </div>
        </div>
    );
}
