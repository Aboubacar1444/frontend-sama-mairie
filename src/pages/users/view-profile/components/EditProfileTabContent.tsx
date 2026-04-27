import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { handleProfileUpdate } from './actions/handleProfileUpdate';
import AvatarUpload from './AvatarUpload';
import type { UserType } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { is } from 'date-fns/locale';
import LoadingSkeleton from '@/loading/LoadingSkeleton';
import { LoaderCircle, LoaderCircleIcon } from 'lucide-react';

const EditProfileTabContent = ({ user, refreshUser }: { user: any; refreshUser?: () => Promise<void> }) => {
    const navigate = useNavigate();
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [nationalIDFile, setNationalIDFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formatDateForInput = (value: string | undefined) => {
        if (!value) return "";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
    };

    const handlePhotoChange = (file: File | null) => {
        setPhotoFile(file);
    };

    const handleNationalIDChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setNationalIDFile(file);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const rawFormData = new FormData(e.currentTarget);
        const cleanedFormData = new FormData();

        for (const [key, value] of rawFormData.entries()) {
            if (typeof value === "string") {
                const trimmed = value.trim();
                if (trimmed === "") continue;
                cleanedFormData.append(key, trimmed);
            } else {
                cleanedFormData.append(key, value);
            }
        }

        if (photoFile) {
            cleanedFormData.set('photo', photoFile);
        }
        if (nationalIDFile) {
            cleanedFormData.set('nationalIDFile', nationalIDFile);
        }

        const response = await handleProfileUpdate(cleanedFormData);
        if (response?.status === 1) {
            await refreshUser?.();
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h6 className="text-base text-neutral-600 dark:text-neutral-200 mb-4">Profile Image</h6>
            <div className="mb-6 mt-4">
                <AvatarUpload onFileChange={handlePhotoChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-6">
                <div className="col-span-12 sm:col-span-6">
                    <div className="mb-5">
                        <Label htmlFor="firstname" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">
                            Prénom <span className="text-red-600">*</span>
                        </Label>
                        <Input name="firstname" type="text" id="firstname" placeholder="Modifier le prénom" required defaultValue={user.firstname} />
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <div className="mb-5">
                        <Label htmlFor="lastname" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">
                            Nom <span className="text-red-600">*</span>
                        </Label>
                        <Input name="lastname" type="text" id="lastname" placeholder="Modifier le nom" required defaultValue={user.lastname} />
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <div className="mb-5">
                        <Label htmlFor="email" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">
                            Email <span className="text-red-600">*</span>
                        </Label>
                        <Input name="email" type="email" id="email" placeholder="Modifier l'email" required defaultValue={user.email} />
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <div className="mb-5">
                        <Label htmlFor="phone" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">Numéro de téléphone</Label>
                        <Input name="phone" type="tel" id="phone" placeholder="Enter phone number" defaultValue={user.phone} />
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <div className="mb-5">
                        <Label htmlFor="birthdate" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">Date de naissance</Label>
                        <Input name="birthdate" type="date" id="birthdate" defaultValue={formatDateForInput(user.birthdate)} />
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <div className="mb-5">
                        <Label htmlFor="nationalID" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">National ID</Label>
                        <Input name="nationalID" id="nationalID" placeholder="Modifier National ID" defaultValue={user.nationalID}  />
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <div className="mb-5">
                        <Label htmlFor="nationalIDFile" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">Fichier National ID</Label>
                        <Input name="nationalIDFile" type="file" id="nationalIDFile" accept=".png, .jpg, .jpeg, .pdf" onChange={handleNationalIDChange} />
                    </div>
                </div>
                
                <div className="col-span-12">
                    <div className="mb-5">
                        <Label htmlFor="bio" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">Biographie</Label>
                        <Textarea name="bio" id="bio" placeholder="Write Description" defaultValue={user.bio} />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center gap-3">
                <Button type="submit" className="h-[48px] text-base px-14 py-3 rounded-lg" disabled={isSubmitting}>
                    {isSubmitting ?`Modification en cours... ` : "Modifier"}
                </Button>
            </div>
        </form>
    );
};

export default EditProfileTabContent;
