import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Business as BusinessType } from "@/types/business";
import { Edit, Eye, Loader2, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import BusinessStatusBadge from "@/pages/business/components/BusinessStatusBadge";
import { formatAmount, formatDate, getOwnerName } from "@/pages/business/components/business-utils";

type BusinessListTableProps = {
    businessList?: BusinessType[],
    isLoading?: boolean,
    onDetailsClick: (business: BusinessType) => void,
    onEditClick: (business: BusinessType) => void,
    onDeleteClick: (business: BusinessType) => void,
    onDeclaredToggle: (business: BusinessType, checked: boolean) => void,
    updatingDeclaredIds?: number[],
};

export default function BusinessListTable({
    businessList = [],
    isLoading = false,
    onDetailsClick,
    onEditClick,
    onDeleteClick,
    onDeclaredToggle,
    updatingDeclaredIds = [],
}: BusinessListTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table className="w-full min-w-[980px] border-spacing-0.1 border-separate border-neutral-300 dark:border-slate-600">
                <TableHeader>
                    <TableRow className="bg-neutral-200 dark:bg-slate-700 text-center">
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg w-[80px]">Nº</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Activité</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Contribuable</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Type</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Taxe</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Statut</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Création</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tr-lg">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={8} className="py-8 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600">
                                <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-300">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Chargement des business...
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : businessList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="py-8 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600">
                                Aucun business trouvé.
                            </TableCell>
                        </TableRow>
                    ) : (
                        businessList.map((business, index) => {
                            const isLast = index === businessList.length - 1;

                            return (
                                <TableRow key={business.id}>
                                    <BusinessCell isLast={isLast} className="text-center">{business.id}</BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center font-medium text-neutral-900 dark:text-white">
                                        {business.name}
                                    </BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">
                                        {getOwnerName(business)}
                                    </BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">{business.type}</BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">
                                        {business.taxe ? formatAmount(business.taxe.amount, business.taxe.currency) : "N/A"}
                                    </BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">
                                        <BusinessStatusBadge isDeclared={business.is_declared} />
                                    </BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">{formatDate(business.creation_date)}</BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Switch
                                                checked={Boolean(business.is_declared)}
                                                disabled={updatingDeclaredIds.includes(business.id)}
                                                onCheckedChange={(checked) => onDeclaredToggle(business, checked)}
                                                aria-label={business.is_declared ? "Marquer non déclaré" : "Marquer déclaré"}
                                            />
                                            <Button size="icon" variant="ghost" className="rounded-[50%] text-blue-500 bg-primary/10" onClick={() => onDetailsClick(business)}>
                                                <Eye className="w-5 h-5" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="rounded-[50%] text-green-600 bg-green-600/10" onClick={() => onEditClick(business)}>
                                                <Edit className="w-5 h-5" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="rounded-[50%] text-red-500 bg-red-500/10" onClick={() => onDeleteClick(business)}>
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </BusinessCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

type BusinessCellProps = {
    children: ReactNode,
    isLast: boolean,
    className?: string,
};

const BusinessCell = ({ children, isLast, className }: BusinessCellProps) => {
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
