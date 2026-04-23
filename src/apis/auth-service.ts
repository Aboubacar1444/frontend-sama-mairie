import api from "./axios-config";


export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/users/login', { email, password});
        
        console.log(response);
        
        localStorage.setItem('token', response.data.body.meta.token);
        localStorage.setItem('user', JSON.stringify(response.data.body));
       
        return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
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