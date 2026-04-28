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
import type { Category } from "@/types/category";
import type { Taxe } from "@/types/taxes";
import { Loader2 } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import type { TaxeFormValues } from "./taxes-utils";

type TaxesFormDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    form: TaxeFormValues,
    categories: Category[],
    editingTaxe: Taxe | null,
    isSubmitting: boolean,
    isFetchingCategories: boolean,
    onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    onCategoryChange: (categoryId: string) => void,
    onSubmit: (event: FormEvent<HTMLFormElement>) => void,
};

const inputClass = "border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0";
const labelClass = "text-[#4b5563] dark:text-white mb-2";

const TaxesFormDialog = ({
    open,
    onOpenChange,
    form,
    categories,
    editingTaxe,
    isSubmitting,
    isFetchingCategories,
    onInputChange,
    onCategoryChange,
    onSubmit,
}: TaxesFormDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[760px] max-h-[90vh] overflow-y-auto p-0">
                <form onSubmit={onSubmit}>
                    <DialogHeader className="border-b border-neutral-200 dark:border-slate-600 p-6">
                        <DialogTitle>{editingTaxe ? "Modifier la taxe" : "Creer une taxe"}</DialogTitle>
                        <DialogDescription>
                            Renseignez les informations attendues pour la creation de la taxe.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 grid grid-cols-12 gap-5">
                        <FormInput id="taxe-title" label="Titre" name="title" value={form.title} onChange={onInputChange} className="md:col-span-6 col-span-12" required />
                        <FormInput id="taxe-amount" label="Montant" name="amount" value={form.amount} onChange={onInputChange} className="md:col-span-6 col-span-12" type="number" min="0" required />

                        <div className="col-span-12">
                            <Label htmlFor="taxe-category" className={labelClass}>Categorie</Label>
                            <Select
                                value={form.categoryId || "none"}
                                onValueChange={onCategoryChange}
                                disabled={isFetchingCategories}
                            >
                                <SelectTrigger
                                    id="taxe-category"
                                    className="w-full border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0"
                                >
                                    <SelectValue placeholder={isFetchingCategories ? "Chargement des categories..." : "Selectionner une categorie"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucune categorie</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-12">
                            <Label htmlFor="taxe-description" className={labelClass}>Description</Label>
                            <Textarea
                                id="taxe-description"
                                name="description"
                                value={form.description}
                                onChange={onInputChange}
                                className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[120px] rounded-lg !shadow-none !ring-0"
                                placeholder="Description de la taxe"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {editingTaxe ? "Mettre a jour" : "Creer"}
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
    name: keyof TaxeFormValues,
    value: string,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    className?: string,
    type?: string,
    min?: string,
    required?: boolean,
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
                className={inputClass}
            />
        </div>
    );
};

export default TaxesFormDialog;
