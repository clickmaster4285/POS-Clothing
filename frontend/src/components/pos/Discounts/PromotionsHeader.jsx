import { Search } from "lucide-react";

const PromotionsHeader = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 w-full max-w-md bg-card border rounded-lg px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary">
                <Search className="text-muted-foreground" size={20} />
                <input
                    type="text"
                    placeholder="Search promotions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground"
                />
            </div>

        </div>
    );
};

export default PromotionsHeader;
