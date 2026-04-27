import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import { createUser } from "@/apis/users-service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

type AddUserModalProps = {
  onCreated?: () => void;
};

type FormState = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birthdate: string;
  roles: string;
  nationalID: string;
  bio: string;
  photo: File | null;
  nationalIDFile: File | null;
};

const initialFormState: FormState = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  birthdate: "",
  roles: "",
  nationalID: "",
  bio: "",
  photo: null,
  nationalIDFile: null,
};

const AddUserModal = ({ onCreated }: AddUserModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);

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
      formData.append('email', formState.email);
      formData.append('phone', formState.phone);
      formData.append('birthdate', formState.birthdate);
      formData.append('roles[]', formState.roles.split(",").map((role) => role.trim()).filter(Boolean).join(","));
      formData.append('nationalID', formState.nationalID);
      formData.append('bio', formState.bio);

      if (formState.photo) {
        formData.append('photo', formState.photo);
      }
      if (formState.nationalIDFile) {
        formData.append('nationalIDFile', formState.nationalIDFile);
      }

      const response = await createUser(formData as any);

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(response.message || "Utilisateur créé avec succès.");
        setFormState(initialFormState);
        setOpen(false);
        onCreated?.();
      } else {
        toast.error(response?.message || "Impossible de créer l'utilisateur.");
      }
    } catch (error) {
      toast.error("Erreur lors de la création de l'utilisateur.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-auto h-11" type="button">
          Ajouter un utilisateur
          <Plus className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl! p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>Remplissez les informations du nouvel utilisateur puis cliquez sur Créer.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                value={formState.firstname}
                onChange={handleChange}
                required
                placeholder="Prénom"
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
                required
                placeholder="Nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                required
                placeholder="Email"
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
                placeholder="Téléphone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Date de naissance</Label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                value={formState.birthdate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roles">Rôles</Label>
              <Input
                id="roles"
                name="roles"
                type="text"
                value={formState.roles}
                onChange={handleChange}
                placeholder="Ex: admin, user"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="nationalID">National ID</Label>
              <Input
                id="nationalID"
                name="nationalID"
                type="text"
                value={formState.nationalID}
                onChange={handleChange}
                placeholder="National ID"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="nationalIDFile">Fichier National ID</Label>
              <Input
                id="nationalIDFile"
                name="nationalIDFile"
                type="file"
                accept=".png, .jpg, .jpeg, .pdf"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formState.bio}
              onChange={handleChange}
              placeholder="Présentation de l'utilisateur"
              className="min-h-[120px]"
            />
          </div>

          <DialogFooter className="gap-2 px-0 pt-3">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
