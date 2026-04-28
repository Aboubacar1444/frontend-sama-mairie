import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Taxe } from "@/types/taxes";
import { Edit, Loader2, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { formatAmount, formatCategoryName } from "@/pages/taxes/components/taxes-utils";

type TaxesListTableProps = {
    taxeList?: Taxe[],
    isLoading?: boolean,
    onEditClick: (taxe: Taxe) => void,
    onDeleteClick: (taxe: Taxe) => void,
};

export default function TaxesListTable({
    taxeList = [],
    isLoading = false,
    onEditClick,
    onDeleteClick,
}: TaxesListTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table className="w-full min-w-[860px] border-spacing-0.1 border-separate border-neutral-300 dark:border-slate-600">
                <TableHeader>
                    <TableRow className="bg-neutral-200 dark:bg-slate-700 text-center">
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg w-[80px]">No</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Titre</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Description</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Montant</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Categorie</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tr-lg">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-8 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600">
                                <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-300">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Chargement des taxes...
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : taxeList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-8 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600">
                                Aucune taxe trouvee.
                            </TableCell>
                        </TableRow>
                    ) : (
                        taxeList.map((taxe, index) => {
                            const isLast = index === taxeList.length - 1;

                            return (
                                <TableRow key={taxe.id}>
                                    <TaxesCell isLast={isLast} className="text-center">{taxe.id}</TaxesCell>
                                    <TaxesCell isLast={isLast} className="text-center font-medium text-neutral-900 dark:text-white">
                                        {taxe.title}
                                    </TaxesCell>
                                    <TaxesCell isLast={isLast} className="text-center">
                                        <span className="line-clamp-2">{taxe.description || "N/A"}</span>
                                    </TaxesCell>
                                    <TaxesCell isLast={isLast} className="text-center">{formatAmount(taxe.amount, taxe.currency)}</TaxesCell>
                                    <TaxesCell isLast={isLast} className="text-center">{formatCategoryName(taxe)}</TaxesCell>
                                    <TaxesCell isLast={isLast} className="text-center">
                                        <div className="flex justify-center gap-2">
                                            {/*
                                            <Button size="icon" variant="ghost" className="rounded-[50%] text-blue-500 bg-primary/10" onClick={() => onDetailsClick(taxe)}>
                                                <Eye className="w-5 h-5" />
                                            </Button>
                                            */}
                                            <Button size="icon" variant="ghost" className="rounded-[50%] text-green-600 bg-green-600/10" onClick={() => onEditClick(taxe)}>
                                                <Edit className="w-5 h-5" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="rounded-[50%] text-red-500 bg-red-500/10" onClick={() => onDeleteClick(taxe)}>
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </TaxesCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

type TaxesCellProps = {
    children: ReactNode,
    isLast: boolean,
    className?: string,
};

const TaxesCell = ({ children, isLast, className }: TaxesCellProps) => {
    return (
        <TableCell
            className={cn(
                "py-4 px-4 border-b first:border-s last:border-e border-neutral-200 dark:border-slate-600",
                isLast && "first:rounded-bl-lg last:rounded-br-lg",
                className,
            )}
        >
            {children}
        </TableCell>
    );
};
