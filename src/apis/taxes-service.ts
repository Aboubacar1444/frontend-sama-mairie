import api from "./axios-config";
import { type Taxe, type TaxePayload, type TaxeUpdatePayload } from "@/types/taxes";

export interface TaxesListRequest {
    page?: number,
    limit?: number,
    id?: number | null,
}

export interface TaxesResponse {
    status: number,
    message: string,
    body: {
        items?: Taxe[] | Taxe | null,
        currentPageNumber?: number,
        totalItemCount?: number,
        itemPerPage?: number,
        totalPage?: number,
    } | Taxe[] | Taxe | null,
}

const emptyTaxesResponse = (message = "Une erreur est survenue."): TaxesResponse => ({
    status: 0,
    message,
    body: {
        items: null,
    },
});

const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
};

const normalizeTaxesResponse = (data: unknown): TaxesResponse => {
    if (Array.isArray(data)) {
        return {
            status: 1,
            message: "",
            body: {
                items: data as Taxe[],
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
        return emptyTaxesResponse("Reponse inattendue du serveur.");
    }

    if ("status" in data && typeof data.status === "number") {
        return {
            status: data.status,
            message: typeof data.message === "string" ? data.message : "",
            body: ("body" in data ? data.body : null) as TaxesResponse["body"],
        };
    }

    if ("body" in data) {
        const message = typeof data.message === "string" ? data.message : "";

        if (Array.isArray(data.body)) {
            return {
                status: 1,
                message,
                body: {
                    items: data.body as Taxe[],
                },
            };
        }

        return {
            status: 1,
            message,
            body: data.body as TaxesResponse["body"],
        };
    }

    return {
        status: 1,
        message: "",
        body: data as Taxe,
    };
};

export const getTaxes = async (request: TaxesListRequest = {}): Promise<TaxesResponse> => {
    try {
        const response = await api.post(
            "/taxes/list",
            {
                id: request.id ?? null,
            },
            {
                params: {
                    page: request.page ?? 1,
                    limit: request.limit ?? 10,
                },
            },
        );
        return normalizeTaxesResponse(response.data);
    }
    catch (error: any) {
        return error?.response?.data
            ? normalizeTaxesResponse(error.response.data)
            : emptyTaxesResponse();
    }
};

export const createTaxe = async (payload: TaxePayload): Promise<TaxesResponse> => {
    try {
        const response = await api.post("/taxes", payload);
        return normalizeTaxesResponse(response.data);
    }
    catch (error: any) {
        return error?.response?.data
            ? normalizeTaxesResponse(error.response.data)
            : emptyTaxesResponse();
    }
};

export const updateTaxe = async (id: number, payload: TaxeUpdatePayload): Promise<TaxesResponse> => {
    try {
        const response = await api.put(`/taxes/${id}`, payload);
        return normalizeTaxesResponse(response.data);
    }
    catch (error: any) {
        return error?.response?.data
            ? normalizeTaxesResponse(error.response.data)
            : emptyTaxesResponse();
    }
};

export const deleteTaxe = async (id: number): Promise<TaxesResponse> => {
    try {
        const response = await api.delete(`/taxes/${id}`);
        return normalizeTaxesResponse(response.data);
    }
    catch (error: any) {
        return error?.response?.data
            ? normalizeTaxesResponse(error.response.data)
            : emptyTaxesResponse();
    }
};
