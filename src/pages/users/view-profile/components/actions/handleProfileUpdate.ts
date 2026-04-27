import { updateUser, type UserResponse } from '@/apis/users-service';
import { toast } from 'react-toastify';

export async function handleProfileUpdate(formData: FormData): Promise<UserResponse | null> {
    const userId = parseInt(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").id : "0");

    if (!userId) {
        toast.error("Utilisateur non trouvé.");
        return null;
    }

    try {
        const response = await updateUser(userId, formData);
        if (response.status === 1) {
            toast.success(response.message);
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const updatedData = Object.fromEntries(
                Array.from(formData.entries()).filter(
                    ([key, value]) => typeof value === "string" && value.trim() !== ""
                )
            );
            localStorage.setItem("user", JSON.stringify({ ...storedUser, ...updatedData }));
        } else {
            toast.error(response.message);
        }
        return response;
    } catch (error) {
        toast.error("Erreur lors de la mise à jour du profil.");
        return null;
    }
}
