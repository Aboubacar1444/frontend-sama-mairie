import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Taxe } from "@/types/taxes";
import type { ReactNode } from "react";
import { formatAmount, formatBusinessCount, formatCategoryName } from "./taxes-utils";

type TaxesDetailsDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    taxe: Taxe | null,
};

const TaxesDetailsDialog = ({
    open,
    onOpenChange,
    taxe,
}: TaxesDetailsDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[760px]">
                <DialogHeader>
                    <DialogTitle>Details de la taxe</DialogTitle>
                    <DialogDescription>
                        Informations recues depuis l'API taxes.
                    </DialogDescription>
                </DialogHeader>

                {taxe && (
                    <div className="grid grid-cols-12 gap-4">
                        <DetailItem label="Titre" value={taxe.title} />
                        <DetailItem label="Montant" value={formatAmount(taxe.amount, taxe.currency)} />
                        <DetailItem label="Categorie" value={formatCategoryName(taxe)} />
                        <DetailItem label="Businesses" value={formatBusinessCount(taxe.businesses.length)} />
                        <DetailItem label="Description" value={taxe.description || "N/A"} className="col-span-12" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

type DetailItemProps = {
    label: string,
    value: ReactNode,
    className?: string,
};

const DetailItem = ({ label, value, className }: DetailItemProps) => {
    return (
        <div className={`md:col-span-6 col-span-12 rounded-lg border border-neutral-200 dark:border-slate-600 p-4 ${className ?? ""}`.trim()}>
            <p className="text-sm text-neutral-500 dark:text-neutral-300 mb-1">{label}</p>
            <div className="font-medium text-neutral-900 dark:text-white break-words">{value || "N/A"}</div>
        </div>
    );
};

export default TaxesDetailsDialog;
