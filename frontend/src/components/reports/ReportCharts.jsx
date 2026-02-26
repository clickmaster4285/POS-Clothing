import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from "recharts";



export const ChartCard = ({ title, children, className = "" }) => (
    <Card className={`${className}`}>
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

const CHART_COLORS = [
    "hsl(16, 85%, 55%)",
    "hsl(220, 20%, 25%)",
    "hsl(16, 85%, 70%)",
    "hsl(220, 15%, 50%)",
    "hsl(38, 92%, 50%)",
    "hsl(220, 20%, 70%)",
];



export const SalesLineChart = ({ data, xKey, lines, height = 280 }) => (
    <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
            <Tooltip
                contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                }}
            />
            <Legend />
            {lines.map((line, i) => (
                <Area
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    stroke={line.color || CHART_COLORS[i]}
                    fill={line.color || CHART_COLORS[i]}
                    fillOpacity={i === 0 ? 0.1 : 0.05}
                    strokeWidth={2}
                    strokeDasharray={line.dashed ? "5 5" : undefined}
                    dot={false}
                />
            ))}
        </AreaChart>
    </ResponsiveContainer>
);


export const ReportBarChart = ({ data, xKey, bars, height = 280, layout = "vertical" }) => (
    <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout={layout === "horizontal" ? "vertical" : "horizontal"}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            {layout === "horizontal" ? (
                <>
                    <YAxis dataKey={xKey} type="category" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" width={80} />
                    <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
                </>
            ) : (
                <>
                    <XAxis dataKey={xKey} tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
                </>
            )}
            <Tooltip
                contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                }}
            />
            {bars.map((bar, i) => (
                <Bar key={bar.key} dataKey={bar.key} fill={bar.color || CHART_COLORS[i]} radius={[4, 4, 0, 0]} />
            ))}
        </BarChart>
    </ResponsiveContainer>
);


export const ReportDonutChart = ({ data, height = 250 }) => (
    <ResponsiveContainer width="100%" height={height}>
        <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
            >
                {data.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
            </Pie>
            <Tooltip
                contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                }}
            />
            <Legend iconType="circle" iconSize={8} />
        </PieChart>
    </ResponsiveContainer>
);
