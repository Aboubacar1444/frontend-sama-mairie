import api from "./axios-config";
import { type UserType } from "@/types/user";

export interface UserResponse {
    status: number,
    message: string,
    body: {
       items: UserType[] | UserType | null,
       currentPageNumber?: number,
       totalItemCount?: number,
       itemPerPage?: number,
       totalPage?: number,
    }
    
}
export interface UserRequest {
    page?: number
    limit?: number
    id?: number,
}
export const getUsers = async (request: UserRequest): Promise<UserResponse> => {
    try {
        const response = await api.post(`/users/list?page=${request.page || 1}&limit=${request.limit || 20}`, request);
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}

export const getUserById = async (request: UserRequest): Promise<UserResponse> => {
    try {
        const response = await api.post(`/users/list?${request.page || 1}&limit=${request.limit || 1}`, { id: request.id });
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}

export const createUser = async (userData: Partial<UserType>): Promise<UserResponse> => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}

export const updateUser = async (id: number, userData: Partial<UserType> | FormData): Promise<UserResponse> => {
    try {
        const response = await api.put(`/users/${id}`, userData, {
            headers: userData instanceof FormData ? {
                'Content-Type': 'multipart/form-data',
            } : undefined,
        });
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}

export const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<UserResponse> => {
    try {
        const response = await api.post('/users/change-password', data);
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}