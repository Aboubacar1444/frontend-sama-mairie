import type { Business as BusinessType, BusinessPayload, BusinessUpdatePayload } from "@/types/business";
import type { Category } from "@/types/category";
import { formatDateToFrench } from "@/utils/date-formatter";

export type BusinessFormValues = {
    name: string,
    description: string,
    type: string,
    local_type: string,
    local_status: string,
    number_of_employee: string,
    creation_date: string,
    is_declared: boolean,
    rccm: string,
    nif: string,
    geo_coords: string,
    map_link: string,
    taxesId: string,
    ownerId: string,
};

export const emptyBusinessForm: BusinessFormValues = {
    name: "",
    description: "",
    type: "",
    local_type: "",
    local_status: "",
    number_of_employee: "",
    creation_date: "",
    is_declared: false,
    rccm: "",
    nif: "",
    geo_coords: "",
    map_link: "",
    taxesId: "",
    ownerId: "",
};

const toNullable = (value: string): string | null => {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
};

export const toDateInputValue = (value: string | null): string => {
    if (!value) {
        return "";
    }

    return value.includes("T") ? value.split("T")[0] : value;
};

export const toBusinessPayload = (form: BusinessFormValues): BusinessPayload => {
    return {
        name: form.name.trim(),
        description: form.description.trim(),
        type: form.type.trim(),
        local_type: toNullable(form.local_type),
        local_status: toNullable(form.local_status),
        number_of_employee: form.number_of_employee ? Number(form.number_of_employee) : null,
        creation_date: form.creation_date,
        is_declared: form.is_declared,
        rccm: toNullable(form.rccm),
        nif: toNullable(form.nif),
        geo_coords: toNullable(form.geo_coords),
        map_link: toNullable(form.map_link),
        taxesId: Number(form.taxesId),
        ownerId: Number(form.ownerId),
    };
};

export const toBusinessUpdatePayload = (form: BusinessFormValues): BusinessUpdatePayload => {
    const payload: BusinessUpdatePayload = {
        name: form.name.trim(),
        type: form.type.trim(),
    };

    if (form.description.trim()) {
        payload.description = form.description.trim();
    }

    if (form.local_type.trim()) {
        payload.local_type = form.local_type.trim();
    }

    if (form.local_status.trim()) {
        payload.local_status = form.local_status.trim();
    }

    if (form.number_of_employee) {
        payload.number_of_employee = Number(form.number_of_employee);
    }

    if (form.rccm.trim()) {
        payload.rccm = form.rccm.trim();
    }

    if (form.nif.trim()) {
        payload.nif = form.nif.trim();
    }

    if (form.geo_coords.trim()) {
        payload.geo_coords = form.geo_coords.trim();
    }

    if (form.map_link.trim()) {
        payload.map_link = form.map_link.trim();
    }

    if (form.taxesId) {
        payload.taxesId = Number(form.taxesId);
    }

    return payload;
};

export const businessToForm = (business: BusinessType): BusinessFormValues => {
    return {
        name: business.name ?? "",
        description: business.description ?? "",
        type: business.type ?? "",
        local_type: business.local_type ?? "",
        local_status: business.local_status ?? "",
        number_of_employee: business.number_of_employee !== null ? String(business.number_of_employee) : "",
        creation_date: toDateInputValue(business.creation_date),
        is_declared: Boolean(business.is_declared),
        rccm: business.rccm ?? "",
        nif: business.nif ?? "",
        geo_coords: business.geo_coords ?? "",
        map_link: business.map_link ?? "",
        taxesId: business.taxe?.id ? String(business.taxe.id) : "",
        ownerId: business.owner?.id ? String(business.owner.id) : "",
    };
};

export const getBusinessTaxeCategory = (business: BusinessType): Category | null => {
    const category = business.taxe?.category;

    if (Array.isArray(category)) {
        return category[0] ?? null;
    }

    return category ?? null;
};

export const isValidBusinessForm = (form: BusinessFormValues, isUpdate = false): boolean => {
    if (isUpdate) {
        return Boolean(form.name.trim() && form.type.trim());
    }

    return Boolean(
        form.name.trim()
        && form.type.trim()
        && form.creation_date
        && form.taxesId
        && form.ownerId
    );
};

export const getOwnerName = (business: BusinessType): string => {
    return `${business.owner?.firstname ?? ""} ${business.owner?.lastname ?? ""}`.trim() || "N/A";
};

export const formatDate = (value: string | null): string => {
    if (!value) {
        return "N/A";
    }

    try {
        return formatDateToFrench(value);
    } catch {
        return value;
    }
};

export const formatAmount = (amount: number, currency: string): string => {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
};

export const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = (error as { response?: { data?: unknown } }).response;
        const data = response?.data;

        if (typeof data === "object" && data !== null) {
            if ("message" in data && typeof data.message === "string") {
                return data.message;
            }

            if ("error" in data && typeof data.error === "string") {
                return data.error;
            }
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Une erreur est survenue.";
};
