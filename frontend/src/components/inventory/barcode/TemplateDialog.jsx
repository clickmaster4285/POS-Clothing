"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings } from "lucide-react"

export function TemplateDialog({ open, onOpenChange, templates }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Label Templates</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Template Name</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Fields</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {templates.map((template) => (
                                <TableRow key={template.id}>
                                    <TableCell className="font-medium">{template.name}</TableCell>
                                    <TableCell>{template.size}</TableCell>
                                    <TableCell className="capitalize">{template.barcodeType}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {template.showName && (
                                                <Badge variant="outline" className="text-xs">
                                                    Name
                                                </Badge>
                                            )}
                                            {template.showSku && (
                                                <Badge variant="outline" className="text-xs">
                                                    SKU
                                                </Badge>
                                            )}
                                            {template.showPrice && (
                                                <Badge variant="outline" className="text-xs">
                                                    Price
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Template
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}