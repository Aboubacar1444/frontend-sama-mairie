import type { Category } from "@/types/category";

export type BusinessOwner = {
    id: number,
    photo: string | null,
    firstname: string,
    lastname: string,
    birthdate: string | null,
    phone: string,
    nationalID: string | null,
    nationalIDType: string | null,
    nationalIDFile: string | null,
}

export type BusinessTaxe = {
    id: number,
    title: string,
    description: string,
    amount: number,
    currency: string,
    category: Category | Category[] | null,
}

export type Business = {
    id: number,
    name: string,
    description?: string | null,
    type: string,
    local_type: string | null,
    local_status: string | null,
    number_of_employee: number | null,
    creation_date: string,
    is_declared: boolean | null,
    rccm: string | null,
    nif: string | null,
    geo_coords: string | null,
    map_link: string | null,
    images: object[],
    owner: BusinessOwner | null,
    taxe: BusinessTaxe | null,
}

export type BusinessPayload = {
    name: string,
    description: string,
    type: string,
    local_type: string | null,
    local_status: string | null,
    number_of_employee: number | null,
    creation_date: string,
    is_declared: boolean,
    rccm: string | null,
    nif: string | null,
    geo_coords: string | null,
    map_link: string | null,
    taxesId: number,
    ownerId: number,
}

export type BusinessUpdatePayload = Partial<BusinessPayload>
