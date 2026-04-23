import api from "./axios-config";
import { type UserType } from "@/types/user";

export interface UserResponse {
    status: number,
    message: string,
    body: UserType | UserType[] | null,
    meta?: {
        token?: string
    }
}
export const getUsers = async (): Promise<UserResponse> => {
    try {
        const response = await api.get('/users');
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}

export const getUserById = async (id: number): Promise<UserResponse> => {
    try {
        const response = await api.get(`/users/${id}`);
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

export const updateUser = async (id: number, userData: Partial<UserType>): Promise<UserResponse> => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}