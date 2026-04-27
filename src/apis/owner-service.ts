import api from "./axios-config";
import type {  Owner, OwnerRequest, OwnerResponse } from "@/types/owner";

export const getOwners = async (request: OwnerRequest): Promise<OwnerResponse> => { 
    try {
        const response = await api.post(`/owner/list?page=${request.page || 1}&limit=${request.limit || 20}`, request);
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}

export const getOwnerById = async (request: OwnerRequest): Promise<OwnerResponse> => {
    try {
        const response = await api.post(`/owner/list?page=${request.page || 1}&limit=${request.limit || 1}`, { id: request.id });
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
    
}

export const updateOwner = async (id: number, ownerData: Partial<Owner> | FormData): Promise<OwnerResponse> => {
    try {
        const response = await api.put(`/owner/${id}`, ownerData, {
            headers: ownerData instanceof FormData ? {
                'Content-Type': 'multipart/form-data',
            } : undefined,
        });
        return response.data;
    }catch(error: any) {
        return error.response.data
    }
}

export const deleteOwner = async (id: number): Promise<OwnerResponse> => {
    const response = await api.delete (`/owner/${id}`);
    return response.data;
}