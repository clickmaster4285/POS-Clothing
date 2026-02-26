"use client"

import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Search,
    Plus,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Users,
    Crown,
    UserPlus,
    Activity
} from "lucide-react"

import { StatCard } from "@/components/inventory/stat-card"
import { useAuth } from "@/hooks/useAuth"
import { useCustomers, useToggleCustomerStatus } from "@/hooks/pos_hooks/useCustomer"

const CustomerInformation = () => {
    const { user: currentUser } = useAuth()
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [tierFilter, setTierFilter] = useState("all")
    const [sortBy, setSortBy] = useState("name")
    const perPage = 5

    // Fetch actual customers
    const { data: customers = [], isLoading } = useCustomers()
    const toggleCustomerStatus = useToggleCustomerStatus()

    // 🔎 Filtering + Sorting + Pagination
    // 🔎 Filtering + Sorting + Pagination
    const filtered = useMemo(() => {
        let data = customers

        // Search
        if (searchQuery) {
            data = data.filter(
                (c) =>
                    c.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.customerId?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Tier filter - FIXED: Match actual values from your database
        if (tierFilter !== "all") {
            // Map display filter values to actual database values
            let dbTierValue = tierFilter;

            // If you want to map "Gold" to your actual DB value
            if (tierFilter === "Gold") {
                dbTierValue = "Premium Loyalty Program"; // or whatever your DB stores for Gold
            } else if (tierFilter === "Regular") {
                dbTierValue = "Basic Rewards Program"; // or whatever your DB stores for Regular
            }

            data = data.filter((c) => c.loyaltyProgram === dbTierValue)
        }

        // Sort
        if (sortBy === "name") {
            data.sort((a, b) => {
                const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
                const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
                return nameA.localeCompare(nameB)
            })
        } else if (sortBy === "points") {
            data.sort((a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0))
        } else if (sortBy === "value") {
            data.sort((a, b) => (b.lifetimeValue || 0) - (a.lifetimeValue || 0))
        }

        return data
    }, [customers, searchQuery, tierFilter, sortBy])
    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    )

    // Stats
    const customerStats = {
        totalCustomers: customers.length,
        goldMembers: customers.filter((c) => c.loyaltyProgram === "Gold").length,
        newCustomers: customers.filter((c) => {
            const created = new Date(c.createdAt)
            const now = new Date()
            return (now - created) / (1000 * 60 * 60 * 24) <= 30 // last 30 days
        }).length,
        activeMembers: customers.filter((c) => c.isActive).length,
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center text-xs text-muted-foreground gap-1">
                <span>Home</span><span>›</span>
                <span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Customer Information</span>
            </div>

            {/* Header */}
            <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Customer Information</h1>
                    <p className="text-sm text-muted-foreground">Listing, Profile & Loyalty</p>
                </div>

                <Button
                    onClick={() => navigate(`/${currentUser?.role}/pos/create`)}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Customer
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Customers" value={customerStats.totalCustomers} icon={Users} iconColor="text-blue-600" trend={{ value: 6, isPositive: true }} />
                <StatCard title="Gold Members" value={customerStats.goldMembers} icon={Crown} iconColor="text-yellow-600" bgColor="bg-yellow-50 dark:bg-yellow-950/20" trend={{ value: 3, isPositive: true }} />
                <StatCard title="New Customers" value={customerStats.newCustomers} icon={UserPlus} iconColor="text-green-600" bgColor="bg-green-50 dark:bg-green-950/20" trend={{ value: 12, isPositive: true }} />
                <StatCard title="Active Members" value={customerStats.activeMembers} icon={Activity} iconColor="text-purple-600" bgColor="bg-purple-50 dark:bg-purple-950/20" trend={{ value: 2, isPositive: false }} />
            </div>

            {/* Search + Filters */}
            {/* Search + Filters */}
            <Card>
                <CardContent className="pt-6 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex-1 min-w-[200px] max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email or ID..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Select value={tierFilter} onValueChange={(value) => { setTierFilter(value); setCurrentPage(1) }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Tier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tiers</SelectItem>
                                <SelectItem value="No Loyalty Program">No Loyalty Program</SelectItem>
                                <SelectItem value="Basic Rewards Program">Basic Rewards</SelectItem>
                                <SelectItem value="Premium Loyalty Program">Premium</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1) }}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="points">Points</SelectItem>
                                <SelectItem value="value">Lifetime Value</SelectItem>
                            </SelectContent>
                        </Select> */}
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Tier</TableHead>
                                <TableHead>Loyalty Points</TableHead>
                                <TableHead>Redeemed Points</TableHead>
                                
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.map((customer) => (
                                <TableRow key={customer._id}>
                                    <TableCell onClick={() => navigate(`/${currentUser?.role}/pos/${customer._id}/detail`)}>{customer.firstName} {customer.lastName}</TableCell>

                                    <TableCell onClick={() => navigate(`/${currentUser?.role}/pos/${customer._id}/detail`)}>{customer.email}</TableCell>

                                    <TableCell onClick={() => navigate(`/${currentUser?.role}/pos/${customer._id}/detail`)}><Badge variant="outline">{customer.loyaltyProgram}</Badge></TableCell>

                                    <TableCell onClick={() => navigate(`/${currentUser?.role}/pos/${customer._id}/detail`)}>{customer.loyaltyPoints || 0}</TableCell>
                                    <TableCell>{customer.redeemedPoints || 0}</TableCell>
                                   
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/${currentUser?.role}/pos/${customer._id}/detail`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View
                                                </DropdownMenuItem>


                                            


                                                <DropdownMenuItem onClick={() => navigate(`/${currentUser?.role}/pos/${customer._id}/edit`)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => toggleCustomerStatus.mutate(customer._id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    Showing {(currentPage - 1) * perPage + 1} – {Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
                </span>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CustomerInformation
