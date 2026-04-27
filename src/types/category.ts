export type Category = {
    id: number,
    name: string,
    description: string,
    taxes: object[]
}

export type CategoryResponse = {
    status: number,
    message: string,
    body: {
        items: Category[] | Category | null,
        currentPageNumber?: number,
        totalItemCount?: number,
        itemPerPage?: number,
        totalPage?: number,
    },
    currentPageNumber?: number,
    totalItemCount?: number,
    itemPerPage?: number,
    totalPage?: number
    
}

export type CategoryRequest = {
    id?: number|null,
    name?: string,
    page?: number,
    limit?: number,
}