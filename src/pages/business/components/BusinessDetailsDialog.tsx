import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Business as BusinessType } from "@/types/business";
import type { ReactNode } from "react";
import BusinessStatusBadge from "./BusinessStatusBadge";
import { formatAmount, formatDate, getBusinessTaxeCategory, getOwnerName } from "./business-utils";

type BusinessDetailsDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    business: BusinessType | null,
};

const BusinessDetailsDialog = ({
    open,
    onOpenChange,
    business,
}: BusinessDetailsDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[860px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Détails de l'activité</DialogTitle>
                    <DialogDescription>
                        
                    </DialogDescription>
                </DialogHeader>

                {business && (
                    <div className="space-y-5">
                        <DetailSection title="Informations de l'activité">
                            <DetailItem label="Nom" value={business.name} />
                            <DetailItem label="Type" value={business.type} />
                            <DetailItem label="Type local" value={business.local_type} />
                            <DetailItem label="Statut local" value={business.local_status} />
                            <DetailItem label="Contribuable" value={getOwnerName(business)} />
                            <DetailItem label="Téléphone" value={business.owner?.phone} />
                            <DetailItem label="RCCM" value={business.rccm} />
                            <DetailItem label="NIF" value={business.nif} />
                            <DetailItem label="Coordonnées GPS" value={business.geo_coords} />
                            <DetailItem
                                label="Lien carte"
                                value={business.map_link ? (
                                    <a href={business.map_link} target="_blank" rel="noreferrer" className="text-primary">
                                        Ouvrir la carte
                                    </a>
                                ) : null}
                            />
                            <DetailItem label="Date de création" value={formatDate(business.creation_date)} />
                            <DetailItem label="Déclaration" value={<BusinessStatusBadge isDeclared={business.is_declared} />} />
                        </DetailSection>

                        <DetailSection title="Taxe associée">
                            {business.taxe ? (
                                <>
                                    <DetailItem label="Titre" value={business.taxe.title} />
                                    <DetailItem label="Montant" value={formatAmount(business.taxe.amount, business.taxe.currency)} />
                                    <DetailItem label="Catégorie" value={getBusinessTaxeCategory(business)?.name} />
                                    <DetailItem label="Description" value={business.taxe.description} className="md:col-span-12" />
                                </>
                            ) : (
                                <div className="col-span-12 rounded-lg border border-dashed border-neutral-200 dark:border-slate-600 p-4 text-center text-neutral-500 dark:text-neutral-300">
                                    Aucune taxe associée.
                                </div>
                            )}
                        </DetailSection>
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

const DetailSection = ({ title, children }: { title: string, children: ReactNode }) => {
    return (
        <section className="rounded-lg border border-neutral-200 dark:border-slate-600 p-4">
            <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">{title}</h3>
            <div className="grid grid-cols-12 gap-4">
                {children}
            </div>
        </section>
    );
};

const DetailItem = ({ label, value, className }: DetailItemProps) => {
    return (
        <div className={`md:col-span-6 col-span-12 rounded-lg bg-neutral-50 dark:bg-slate-800/60 p-4 ${className ?? ""}`}>
            <p className="text-sm text-neutral-500 dark:text-neutral-300 mb-1">{label}</p>
            <div className="font-medium text-neutral-900 dark:text-white break-words">{value || "N/A"}</div>
        </div>
    );
};

export default BusinessDetailsDialog;
