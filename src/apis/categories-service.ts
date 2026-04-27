import api from "./axios-config";
import type { Category } from "@/types/category";

export interface CategoriesListRequest {
    page?: number,
    limit?: number,
    id?: number | null,
}

export interface CategoriesResponse {
    status: number,
    message: string,
    body: {
        items?: Category[] | Category | null,
        currentPageNumber?: number,
        totalItemCount?: number,
        itemPerPage?: number,
        totalPage?: number,
    } | Category[] | Category | null,
}

const emptyCategoriesResponse = (message = "Une erreur est survenue."): CategoriesResponse => ({
    status: 0,
    message,
    body: {
        items: null,
    },
});

const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
};

const normalizeCategoriesResponse = (data: unknown): CategoriesResponse => {
    if (Array.isArray(data)) {
        return {
            status: 1,
            message: "",
            body: {
                items: data as Category[],
            },
        };
    }

    if (data === null || data === undefined || data === "") {
        return {
            status: 1,
            message: "",
            body: {
                items: null,
            },
        };
    }

    if (!isObject(data)) {
        return emptyCategoriesResponse("Reponse inattendue du serveur.");
    }

    if ("status" in data && typeof data.status === "number") {
        return {
            status: data.status,
            message: typeof data.message === "string" ? data.message : "",
            body: ("body" in data ? data.body : null) as CategoriesResponse["body"],
        };
    }

    if ("body" in data) {
        const message = typeof data.message === "string" ? data.message : "";

        if (Array.isArray(data.body)) {
            return {
                status: 1,
                message,
                body: {
                    items: data.body as Category[],
                },
            };
        }

        return {
            status: 1,
            message,
            body: data.body as CategoriesResponse["body"],
        };
    }

    return {
        status: 1,
        message: "",
        body: data as Category,
    };
};

export const getCategories = async (request: CategoriesListRequest = {}): Promise<CategoriesResponse> => {
    try {
        const response = await api.get("/category", {
            params: request.id ? { id: request.id } : undefined,
        });
        return normalizeCategoriesResponse(response.data);
    }
    catch (error: any) {
        return error?.response?.data
            ? normalizeCategoriesResponse(error.response.data)
            : emptyCategoriesResponse();
    }
};
