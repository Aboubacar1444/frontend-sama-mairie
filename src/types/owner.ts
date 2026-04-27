export type Owner = {
    id: number,
    photo: string,
    firstname: string,
    lastname: string,
    birthdate: string | null,
    nationalID: string | null,
    nationalIDType: string | null,
    nationalIDFile: string | null,
    phone: string,
    businesses: any[],
}

export type OwnerResponse = {
    status: number,
    message: string,
    body: {
        items: Owner[] | Owner | null,
        currentPageNumber?: number,
        totalItemCount?: number,
        itemPerPage?: number,
        totalPage?: number,
    },
    currentPageNumber?: number,
    totalItemCount?: number,
    itemPerPage?: number,
    totalPage?: number,
}

export type OwnerRequest = {
    id?:number,
    phone?: string,
    nationalID?: string,
    page?: number,
    limit?: number,
}