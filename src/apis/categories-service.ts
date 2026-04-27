import api from "./axios-config";
import type { Category,  CategoryRequest, CategoryResponse } from "@/types/category";

export const getCategories = async (request: CategoryRequest): Promise<CategoryResponse> => {
    try {
        const response = await api.post(`/category/list?page=${request.page}&limit=${request.limit}`, request);
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}

export const getCategoryById = async (request: CategoryRequest): Promise<CategoryResponse> => {
    try {
        const response = await api.post(`/category/list?page=${request.page || 1}&limit=${request.limit || 1}`, { id: request.id });
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}

export const createCategory = async (categoryData: Partial<Category>): Promise<CategoryResponse> => {
    try {
        const response = await api.post('/category', categoryData);
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}

export const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<CategoryResponse> => {
    try {
        const response = await api.put(`/category/${id}`, categoryData);
        return response.data;
    }catch(error: any) {
        return error.response.data
    }
}

export const deleteCategory = async (id: number): Promise<CategoryResponse> => {
    try {
        const response = await api.delete(`/category/${id}`);
        return response.data;
    }catch (error: any) {
        return error.response.data;
    }
}
