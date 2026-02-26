import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Power, Users, Activity } from "lucide-react";

const statsConfig = [
    { label: "Total Terminals", icon: Monitor, changeColor: "text-success" },
    { label: "Active Terminals", icon: Power, changeColor: "text-success" },
    { label: "Assigned Users", icon: Users, changeColor: "text-info" },
    { label: "Total Actions", icon: Activity, changeColor: "text-primary" },
];

export default function TerminalStats({ terminals }) {
    const totalTerminals = terminals.length;
    const activeTerminals = terminals.filter((t) => t.isActive).length;
    const totalUsers = terminals.reduce((acc, t) => acc + (t.users?.length || 0), 0);
    const totalActions = terminals.reduce((acc, t) => acc + (t.actions?.length || 0), 0);

    const stats = [
        {
            ...statsConfig[0],
            value: totalTerminals,
            change: "+2 from last month"
        },
        {
            ...statsConfig[1],
            value: activeTerminals,
            change: `${activeTerminals}/${totalTerminals} active`
        },
        {
            ...statsConfig[2],
            value: totalUsers,
            change: "+5 from last month"
        },
        {
            ...statsConfig[3],
            value: totalActions,
            change: "+12 this week"
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
                <Card key={s.label} className="border border-border">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-muted-foreground">{s.label}</span>
                            <s.icon className="h-5 w-5 text-primary opacity-60" />
                        </div>
                        <p className="text-3xl font-bold text-foreground">{s.value}</p>
                        <p className={`text-xs mt-1 ${s.changeColor}`}>{s.change}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}