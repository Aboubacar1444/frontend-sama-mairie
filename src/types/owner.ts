export type Owner = {
    id: number,
    photo: string,
    firstname: string,
    lastname: string,
    birthdate: string | null,
    nationalID: string | null,
    nationalIDType: string | null,
    nationalIDFile: string | null,
    phone: string,
    businesses: any[],
}