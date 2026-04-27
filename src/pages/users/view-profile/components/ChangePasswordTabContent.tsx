import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { changePassword } from '@/apis/users-service';
import { toast } from 'react-toastify';

const ChangePasswordTabContent = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const currentPassword = formData.get("current-password") as string;
        const newPassword = formData.get("new-password") as string;
        const confirmPassword = formData.get("confirm-password") as string;

        if (newPassword !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await changePassword({ currentPassword, newPassword });
            if (response.status === 1) {
                toast.success(response.message);
                e.currentTarget.reset();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Erreur lors du changement de mot de passe.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Current Password Field */}
            <div className="mb-5">
                <Label htmlFor="current-password" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">
                    Mot de passe actuel <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                    <Input
                        name="current-password"
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Mot de passe actuel"
                        className="ps-5 pe-12 h-[48px] rounded-lg border border-neutral-300 dark:border-slate-700 focus:border-primary dark:focus:border-primary focus-visible:border-primary !shadow-none !ring-0"
                        required
                    />
                    <Button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 !p-0 bg-transparent hover:bg-transparent text-muted-foreground h-[unset]"
                    >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                </div>
            </div>
            {/* New Password Field */}
            <div className="mb-5">
                <Label htmlFor="new-password" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">
                    Nouveau mot de passe <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                    <Input
                        name="new-password"
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Entrez le nouveau mot de passe"
                        className="ps-5 pe-12 h-[48px] rounded-lg border border-neutral-300 dark:border-slate-700 focus:border-primary dark:focus:border-primary focus-visible:border-primary !shadow-none !ring-0"
                        required
                    />
                    <Button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 !p-0 bg-transparent hover:bg-transparent text-muted-foreground h-[unset]"
                    >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-5">
                <Label htmlFor="confirm-password" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">
                    Confirmer le mot de passe <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                    <Input
                        name="confirm-password"
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmer le mot de passe"
                        className="ps-5 pe-12 h-[48px] rounded-lg border border-neutral-300 dark:border-slate-700 focus:border-primary dark:focus:border-primary focus-visible:border-primary !shadow-none !ring-0"
                        required
                    />
                    <Button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 !p-0 bg-transparent hover:bg-transparent text-muted-foreground h-[unset]"
                    >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                </div>
                <div className="flex items-end justify-end gap-3 py-9 ">
                    
                    <Button type="submit" className="h-[48px] text-base px-14 py-3 rounded-lg" disabled={isLoading}>
                        {isLoading ? "Modification..." : "Modifier"}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ChangePasswordTabContent;
