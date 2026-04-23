import api from "./axios-config";
import axios from "axios";


export const login = async (email: string, password: string) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const data = { username: email, password: password };
    
    const response = await axios.post(`${BASE_URL}/login_check`, data);

    if(response.data.status === 1){
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        
    }
           
    return response.data;
    
}

export const logout = async () => {
    const response = await api.post('/users/logout');
    if (response.data.status === 1) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return response.data;
    }
    return response.data;

};