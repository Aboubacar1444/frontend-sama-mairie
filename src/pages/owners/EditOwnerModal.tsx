import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { updateOwner } from "@/apis/owner-service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Owner } from "@/types/owner";

type EditOwnerModalProps = {
  owner: Owner;
  onUpdated?: () => void;
  children: React.ReactNode;
};

type FormState = {
  firstname: string;
  lastname: string;
  birthdate: string|null;
  phone: string;
  nationalID: string;
  nationalIDType: string;
  photo: File | null;
  nationalIDFile: File | null;
};

const EditOwnerModal = ({ owner, onUpdated, children }: EditOwnerModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    firstname: "",
    lastname: "",
    birthdate: "",
    phone: "",
    nationalID: "",
    nationalIDType: "",
    photo: null,
    nationalIDFile: null,
  });

  const IMG_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (owner) {
      setFormState({
        firstname: owner.firstname || "",
        lastname: owner.lastname || "",
        birthdate: owner.birthdate ? new Date(owner.birthdate).toISOString().split('T')[0] : null,
        phone: owner.phone || "",
        nationalID: owner.nationalID || "",
        nationalIDType: owner.nationalIDType || "",
        photo: null,
        nationalIDFile: null,
      });
    }
  }, [owner]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    if (type === 'file') {
      const fileInput = event.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      setFormState((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('firstname', formState.firstname);
      formData.append('lastname', formState.lastname);
      formData.append('phone', formState.phone);
      formData.append('nationalID', formState.nationalID);
      formData.append('nationalIDType', formState.nationalIDType);

      if (formState.birthdate) {
        formData.append('birthdate', new Date(formState.birthdate).toISOString());
      }

      if (formState.photo) {
        formData.append('photo', formState.photo);
      }
      if (formState.nationalIDFile) {
        formData.append('nationalIDFile', formState.nationalIDFile);
      }

      const response = await updateOwner(owner.id, formData);

      if (response && response.status === 1) {
        toast.success(response.message || "Propriétaire mis à jour avec succès...");
        setOpen(false);
        onUpdated?.();
      } else {
        toast.error(response?.message || "Impossible de mettre à jour le propriétaire...");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du propriétaire.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le propriétaire</DialogTitle>
          <DialogDescription>
            Modifiez les informations du propriétaire.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                value={formState.firstname}
                onChange={handleChange}
                placeholder="Prénom du propriétaire"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                value={formState.lastname}
                onChange={handleChange}
                placeholder="Nom du propriétaire"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthdate">Date de naissance</Label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                value={formState.birthdate || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formState.phone}
                onChange={handleChange}
                placeholder="Numéro de téléphone"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationalID">ID National</Label>
              <Input
                id="nationalID"
                name="nationalID"
                type="text"
                value={formState.nationalID}
                onChange={handleChange}
                placeholder="ID National"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalIDType">Type d'ID National</Label>
              <Input
                id="nationalIDType"
                name="nationalIDType"
                type="text"
                value={formState.nationalIDType}
                onChange={handleChange}
                placeholder="Type d'ID National"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              {owner.photo && (
                
                <div className="mb-2">
                  <img src={`${IMG_BASE_URL}/${owner.photo}`} alt="Photo actuelle" className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer"/>
                </div>
              )}
              <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleChange}
                placeholder="Choisissez une image"
                
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalIDFile">Fichier ID National</Label>
              {owner.nationalIDFile && (
                <div className="mb-2">
                  <p className="text-sm text-neutral-600">Fichier actuel: {owner.nationalIDFile.split('/').pop()}</p>
                </div>
              )}
              <Input
                id="nationalIDFile"
                name="nationalIDFile"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOwnerModal;