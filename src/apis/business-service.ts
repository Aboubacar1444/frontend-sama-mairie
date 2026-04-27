import api from "./axios-config";
import { type Business, type BusinessPayload, type BusinessUpdatePayload } from "@/types/business";

export interface BusinessListRequest {
    page?: number,
    limit?: number,
    id?: number | null,
}

export interface BusinessResponse {
    status: number,
    message: string,
    body: {
        items?: Business[] | Business | null,
        currentPageNumber?: number,
        totalItemCount?: number,
        itemPerPage?: number,
        totalPage?: number,
    } | Business[] | Business | null,
}

const emptyBusinessResponse = (message = "Une erreur est survenue."): BusinessResponse => ({
    status: 0,
    message,
    body: {
        items: null,
    },
});

const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
};

const normalizeBusinessResponse = (data: unknown): BusinessResponse => {
    if (Array.isArray(data)) {
        return {
            status: 1,
            message: "",
            body: {
                items: data as Business[],
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
        return emptyBusinessResponse("Réponse inattendue du serveur.");
    }

    if ("status" in data && typeof data.status === "number") {
        return {
            status: data.status,
            message: typeof data.message === "string" ? data.message : "",
            body: ("body" in data ? data.body : null) as BusinessResponse["body"],
        };
    }

    if ("body" in data) {
        const message = typeof data.message === "string" ? data.message : "";

        if (Array.isArray(data.body)) {
            return {
                status: 1,
                message,
                body: {
                    items: data.body as Business[],
                },
            };
        }

        return {
            status: 1,
            message,
            body: data.body as BusinessResponse["body"],
        };
    }

    return {
        status: 1,
        message: "",
        body: data as Business,
    };
};

export const getBusinesses = async (request: BusinessListRequest = {}): Promise<BusinessResponse> => {
    try {
        const response = await api.post(
            "/business/list",
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
        return normalizeBusinessResponse(response.data);
    }
    catch (error: any) {
        return error?.response?.data
            ? normalizeBusinessResponse(error.response.data)
            : emptyBusinessResponse();
    }
};

export const createBusiness = async (payload: BusinessPayload): Promise<BusinessResponse> => {
    try {
        const response = await api.post("/business", payload);
        return normalizeBusinessResponse(response.data);
    }
    catch (error: any) {
        return error?.response?.data
            ? normalizeBusinessResponse(error.response.data)
            : emptyBusinessResponse();
    }
};

export const updateBusiness = async (id: number, payload: BusinessUpdatePayload): Promise<BusinessResponse> => {
    try {
        const response = await api.put(`/business/${id}`, payload);
        return normalizeBusinessResponse(response.data);
    }
    catch (error: any) {
        return error?.response?.data
            ? normalizeBusinessResponse(error.response.data)
            : emptyBusinessResponse();
    }
};

export const deleteBusiness = async (id: number): Promise<BusinessResponse> => {
    try {
        const response = await api.delete(`/business/${id}`);
        return normalizeBusinessResponse(response.data);
    }
    catch (error: any) {
        return error?.response?.data
            ? normalizeBusinessResponse(error.response.data)
            : emptyBusinessResponse();
    }
};
