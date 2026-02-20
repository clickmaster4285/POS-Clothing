// components/terminals/TerminalHeader.jsx
import React from "react";
import { ArrowLeft, Monitor, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const TerminalHeader = ({ terminal, onBack }) => {
   
    return (
        <>
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground mb-4">
                Home &gt;{" "}
                <button onClick={onBack} className="text-primary hover:underline">
                    Terminal Management
                </button>{" "}
                &gt; <span className="text-primary font-medium">{terminal.terminalName}</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-foreground">{terminal.terminalName}</h1>
                        <Badge
                            variant={terminal.isActive ? "default" : "outline"}
                            className={terminal.isActive ? "bg-success text-success-foreground" : ""}
                        >
                            {terminal.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                   
                </div>
            </div>

            {/* Terminal Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Terminal ID */}
                <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Terminal ID</span>
                            <Monitor className="h-5 w-5 text-primary opacity-70" />
                        </div>
                        <p className="text-lg font-semibold text-foreground">{terminal.terminalId}</p>
                        <p className="text-xs text-muted-foreground mt-1">Unique terminal identifier</p>
                    </CardContent>
                </Card>

                {/* Branch Name */}
                <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Branch</span>
                            <Building2 className="h-5 w-5 text-primary opacity-70" />
                        </div>
                        <p className="text-lg font-semibold text-foreground">{terminal.branch?.branch_name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Branch associated with this terminal</p>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Location</span>
                            <MapPin className="h-5 w-5 text-primary opacity-70" />
                        </div>
                        <p className="text-lg font-semibold text-foreground">{terminal.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">Physical location of the terminal</p>
                    </CardContent>
                </Card>
            </div>

        </>
    );
};