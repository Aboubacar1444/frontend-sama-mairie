import type { Category } from "@/types/category";
import type { Taxe, TaxePayload, TaxeUpdatePayload } from "@/types/taxes";
import { formatDateToFrench } from "@/utils/date-formatter";

export type TaxeFormValues = {
    title: string,
    description: string,
    amount: string,
    categoryId: string,
};

export const emptyTaxeForm: TaxeFormValues = {
    title: "",
    description: "",
    amount: "",
    categoryId: "",
};

export const taxeToForm = (taxe: Taxe): TaxeFormValues => {
    const category = getTaxeCategory(taxe);

    return {
        title: taxe.title ?? "",
        description: taxe.description ?? "",
        amount: taxe.amount !== null && taxe.amount !== undefined ? String(taxe.amount) : "",
        categoryId: category?.id ? String(category.id) : "",
    };
};

export const toTaxePayload = (form: TaxeFormValues): TaxePayload => {
    const payload: TaxePayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
    };

    if (form.categoryId) {
        payload.categoryId = Number(form.categoryId);
    }

    return payload;
};

export const toTaxeUpdatePayload = (form: TaxeFormValues): TaxeUpdatePayload => {
    const payload: TaxeUpdatePayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
    };

    if (form.categoryId) {
        payload.categoryId = Number(form.categoryId);
    }

    return payload;
};

export const isValidTaxeForm = (form: TaxeFormValues): boolean => {
    return Boolean(
        form.title.trim()
        && form.amount
        && !Number.isNaN(Number(form.amount))
    );
};

export const formatAmount = (amount: number, currency: string): string => {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
};

export const formatBusinessCount = (count: number): string => {
    return `${count} business`;
};

export const getTaxeCategory = (taxe: Taxe): Category | null => {
    if (Array.isArray(taxe.category)) {
        return taxe.category[0] ?? null;
    }

    return taxe.category ?? null;
};

export const hasTaxeCategory = (taxe: Taxe): boolean => {
    return Boolean(getTaxeCategory(taxe));
};

export const formatCategoryName = (taxe: Taxe): string => {
    return getTaxeCategory(taxe)?.name ?? "N/A";
};

export const formatCreatedLikeDate = (value: string | null): string => {
    if (!value) {
        return "N/A";
    }

    try {
        return formatDateToFrench(value);
    } catch {
        return value;
    }
};
