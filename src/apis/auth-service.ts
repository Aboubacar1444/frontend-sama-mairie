import api from "./axios-config";


export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/users/login', { email, password});
        console.log(response);
        return;
        // localStorage.setItem('token', response.data.body.meta.token);
        // TEST other api call 

        // const getCat = await api.get('/category');
        // console.log(getCat.data);
        // return response.data;
    } 
    catch (error: any) {
        return error.response.data;
    }
}

export const logout = async () => {
    const response = await api.post('/users/logout');
    if (response.data.status === 1) {
        localStorage.removeItem('token');
        return true;
    }
    return false;

};