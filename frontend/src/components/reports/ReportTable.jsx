import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";



export function ReportTable({ title, data, columns, className = "" }) {
    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {columns.map((col, i) => (
                                <TableHead key={i} className={`text-xs ${col.align === "right" ? "text-right" : ""}`}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, rowIdx) => (
                            <TableRow key={rowIdx}>
                                {columns.map((col, colIdx) => (
                                    <TableCell key={colIdx} className={`text-sm ${col.align === "right" ? "text-right" : ""}`}>
                                        {typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export const StatusBadge = ({ status }) => {
    // Map status to appropriate badge styles
    const getBadgeStyles = () => {
        switch (status) {
            case "in-stock":
                return "bg-green-100 text-green-800 hover:bg-green-200"; // Green for in stock
            case "low-stock":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"; // Yellow for low stock
            case "out-of-stock":
                return "bg-red-100 text-red-800 hover:bg-red-200"; // Red for out of stock
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200";
        }
    };

    // Format the display text
    const getDisplayText = () => {
        switch (status) {
            case "in-stock":
                return "In Stock";
            case "low-stock":
                return "Low Stock";
            case "out-of-stock":
                return "Out of Stock";
            default:
                return status;
        }
    };

    return (
        <Badge className={`text-xs ${getBadgeStyles()}`}>
            {getDisplayText()}
        </Badge>
    );
};
