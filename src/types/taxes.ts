import type { Category } from "@/types/category";

export type TaxeBusiness = {
    id: number,
    name: string,
    type: string,
    local_type: string | null,
    local_status: string | null,
    number_of_employee: number | null,
    creation_date: string,
    is_declared: boolean | null,
    rccm: string | null,
    nif: string | null,
    map_link: string | null,
    images: object[],
}

export type Taxe = {
    id: number,
    title: string,
    description: string,
    amount: number,
    currency: string,
    category: Category | Category[] | null,
    businesses: TaxeBusiness[],
}

export type TaxePayload = {
    title: string,
    description: string,
    amount: number,
    categoryId?: number | null,
}

export type TaxeUpdatePayload = Partial<TaxePayload>
