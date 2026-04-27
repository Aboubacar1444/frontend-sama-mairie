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
};

export default function BusinessListTable({
    businessList = [],
    isLoading = false,
    onDetailsClick,
    onEditClick,
    onDeleteClick,
}: BusinessListTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table className="w-full min-w-[1180px] border-spacing-0.1 border-separate border-neutral-300 dark:border-slate-600">
                <TableHeader>
                    <TableRow className="bg-neutral-200 dark:bg-slate-700 text-center">
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg w-[80px]">Nº</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Business</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Propriétaire</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Type</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Local</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Taxe</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Employés</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Statut</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Création</TableHead>
                        <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tr-lg">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={10} className="py-8 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600">
                                <div className="flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-300">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Chargement des business...
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : businessList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="py-8 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600">
                                Aucun business trouvé.
                            </TableCell>
                        </TableRow>
                    ) : (
                        businessList.map((business, index) => {
                            const isLast = index === businessList.length - 1;

                            return (
                                <TableRow key={business.id}>
                                    <BusinessCell isLast={isLast} className="text-center">{business.id}</BusinessCell>
                                    <BusinessCell isLast={isLast}>
                                        <div className="flex flex-col text-center md:text-left">
                                            <span className="font-medium text-neutral-900 dark:text-white">{business.name}</span>
                                            <span className="text-sm text-neutral-500 dark:text-neutral-300">RCCM: {business.rccm ?? "N/A"}</span>
                                        </div>
                                    </BusinessCell>
                                    <BusinessCell isLast={isLast}>
                                        <div className="flex flex-col text-center md:text-left">
                                            <span className="font-medium text-neutral-900 dark:text-white">{getOwnerName(business)}</span>
                                            <span className="text-sm text-neutral-500 dark:text-neutral-300">{business.owner?.phone ?? "N/A"}</span>
                                        </div>
                                    </BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">{business.type}</BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">
                                        <div className="flex flex-col">
                                            <span>{business.local_type ?? "N/A"}</span>
                                            <span className="text-sm text-neutral-500 dark:text-neutral-300">{business.local_status ?? "N/A"}</span>
                                        </div>
                                    </BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">
                                        {business.taxe ? (
                                            <div className="flex flex-col">
                                                <span>{business.taxe.title}</span>
                                                <span className="text-sm text-neutral-500 dark:text-neutral-300">
                                                    {formatAmount(business.taxe.amount, business.taxe.currency)}
                                                </span>
                                            </div>
                                        ) : (
                                            "N/A"
                                        )}
                                    </BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">{business.number_of_employee ?? "N/A"}</BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">
                                        <BusinessStatusBadge isDeclared={business.is_declared} />
                                    </BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">{formatDate(business.creation_date)}</BusinessCell>
                                    <BusinessCell isLast={isLast} className="text-center">
                                        <div className="flex justify-center gap-2">
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
