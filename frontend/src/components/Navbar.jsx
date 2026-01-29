
import { useAuth } from "../context/AuthContext";

import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Navbar = () => {
    const { logout } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-card px-6">
            {/* Search */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products, customers, transactions..."
                    className="h-10 w-full bg-muted/50 pl-10 text-sm"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src="/placeholder.svg" alt="Store Manager" />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            SM
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-foreground">Store Manager</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
