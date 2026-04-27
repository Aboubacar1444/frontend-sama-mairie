import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import EditCategoryModal from "@/pages/categories/EditCategoryModal";
import CategoryDetailsModal from "@/pages/categories/CategoryDetailsModal";

interface CategoriesListTableProps {
    categories: Category[];
    onDelete: (id: number) => void;
    onUpdated: () => void;
}

export default function CategoriesListTable({ categories, onDelete, onUpdated }: CategoriesListTableProps) {
    return (
        <Table className="w-full border-spacing-0.1 border-separate border-neutral-300 dark:border-slate-600">
            <TableHeader>
                <TableRow className="bg-neutral-200 dark:bg-slate-700 text-center">
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg w-20">Nº</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Nom</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Description</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Taxes</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tr-lg">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category, index) => {
                    const isLast = index === categories.length - 1;
                    return (
                        <TableRow key={category.id}>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""}`}
                            >
                                {category.id}
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600`}
                            >
                                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {category.name}
                                </div>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600`}
                            >
                                <div className="text-neutral-600 dark:text-neutral-300 max-w-xs truncate">
                                    {category.description || "Aucune description"}
                                </div>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600`}
                            >
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {Array.isArray(category.taxes) ? category.taxes.length : 0} taxes
                                </span>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-br-lg" : ""}`}
                            >
                                <div className="flex justify-center gap-2">
                                    <CategoryDetailsModal category={category}>
                                        <Button size="icon" variant="ghost" className="rounded-[50%] text-blue-500 bg-primary/10 hover:bg-primary/20">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </CategoryDetailsModal>
                                    <EditCategoryModal category={category} onUpdated={onUpdated}>
                                        <Button size="icon" variant="ghost" className="rounded-[50%] text-green-500 bg-green-500/10 hover:bg-green-500/20">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </EditCategoryModal>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="rounded-[50%] text-red-500 bg-red-500/10 hover:bg-red-500/20"
                                        onClick={() => onDelete(category.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}