import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Business as BusinessType } from "@/types/business";
import type { Taxe } from "@/types/taxes";
import { Loader2 } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { formatAmount, type BusinessFormValues } from "./business-utils";

type BusinessFormDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    form: BusinessFormValues,
    taxes: Taxe[],
    editingBusiness: BusinessType | null,
    isSubmitting: boolean,
    isFetchingTaxes: boolean,
    onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    onTaxeChange: (taxesId: string) => void,
    onSubmit: (event: FormEvent<HTMLFormElement>) => void,
};

const inputClass = "border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0";
const labelClass = "text-[#4b5563] dark:text-white mb-2";

const BusinessFormDialog = ({
    open,
    onOpenChange,
    form,
    taxes,
    editingBusiness,
    isSubmitting,
    isFetchingTaxes,
    onInputChange,
    onTaxeChange,
    onSubmit,
}: BusinessFormDialogProps) => {
    const relationFieldsRequired = !editingBusiness;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[920px] max-h-[90vh] overflow-y-auto p-0">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="border-b border-neutral-200 dark:border-slate-600 p-6">
                        <DialogTitle>Modifier l'activité</DialogTitle>
                        <DialogDescription>
                            Renseignez les informations à modifier.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 grid grid-cols-12 gap-5">
                        <FormInput id="business-name" label="Nom" name="name" value={form.name} onChange={onInputChange} className="md:col-span-6 col-span-12" required />
                        <FormInput id="business-type" label="Type" name="type" value={form.type} onChange={onInputChange} className="md:col-span-6 col-span-12" required />
                        <FormInput id="business-local-type" label="Type local" name="local_type" value={form.local_type} onChange={onInputChange} className="md:col-span-6 col-span-12" />
                        <FormInput id="business-local-status" label="Statut local" name="local_status" value={form.local_status} onChange={onInputChange} className="md:col-span-6 col-span-12" />
                        <FormInput id="business-employees" label="Nombre d'employés" name="number_of_employee" value={form.number_of_employee} onChange={onInputChange} className="md:col-span-6 col-span-12" type="number" min="0" />
                        <FormInput id="business-date" label="Date de création" name="creation_date" value={form.creation_date} onChange={onInputChange} className="md:col-span-6 col-span-12" type="date" required={!editingBusiness} disabled={Boolean(editingBusiness)} />
                        <FormInput id="business-rccm" label="RCCM" name="rccm" value={form.rccm} onChange={onInputChange} className="md:col-span-6 col-span-12" />
                        <FormInput id="business-nif" label="NIF" name="nif" value={form.nif} onChange={onInputChange} className="md:col-span-6 col-span-12" />
                        <FormInput id="business-geo-coords" label="Coordonnées GPS" name="geo_coords" value={form.geo_coords} onChange={onInputChange} className="md:col-span-6 col-span-12" />
                        <FormInput id="business-map-link" label="Lien carte" name="map_link" value={form.map_link} onChange={onInputChange} className="md:col-span-6 col-span-12" type="url" />

                        <div className="md:col-span-6 col-span-12">
                            <Label htmlFor="business-taxe" className={labelClass}>Taxe</Label>
                            <Select
                                value={form.taxesId || "none"}
                                onValueChange={onTaxeChange}
                                disabled={isFetchingTaxes}
                                required={relationFieldsRequired}
                            >
                                <SelectTrigger
                                    id="business-taxe"
                                    className="w-full border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0"
                                >
                                    <SelectValue placeholder={isFetchingTaxes ? "Chargement..." : "Sélectionner"} />
                                </SelectTrigger>
                                <SelectContent translate="no">
                                    <SelectItem value="none" translate="no">Aucune taxe</SelectItem>
                                    {taxes.map((taxe) => (
                                        <SelectItem key={taxe.id} value={String(taxe.id)} translate="no">
                                            {taxe.title} - {formatAmount(taxe.amount, taxe.currency)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-12">
                            <Label htmlFor="business-description" className={labelClass}>Description</Label>
                            <Textarea
                                id="business-description"
                                name="description"
                                value={form.description}
                                onChange={onInputChange}
                                className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[120px] rounded-lg !shadow-none !ring-0"
                                placeholder="Magasin de produits électroniques"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Mettre à jour
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

type FormInputProps = {
    id: string,
    label: string,
    name: keyof BusinessFormValues,
    value: string,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    className?: string,
    type?: string,
    min?: string,
    required?: boolean,
    disabled?: boolean,
};

const FormInput = ({
    id,
    label,
    name,
    value,
    onChange,
    className,
    type = "text",
    min,
    required = false,
    disabled = false,
}: FormInputProps) => {
    return (
        <div className={className}>
            <Label htmlFor={id} className={labelClass}>{label}</Label>
            <Input
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                min={min}
                required={required}
                disabled={disabled}
                className={inputClass}
            />
        </div>
    );
};

export default BusinessFormDialog;
