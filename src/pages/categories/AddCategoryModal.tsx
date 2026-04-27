import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import { createCategory } from "@/apis/categories-service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

type AddCategoryModalProps = {
  onCreated?: () => void;
};

type FormState = {
  name: string;
  description: string;
};

const initialFormState: FormState = {
  name: "",
  description: "",
};

const AddCategoryModal = ({ onCreated }: AddCategoryModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await createCategory(formState);

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(response.message || "Catégorie créée avec succès.");
        setFormState(initialFormState);
        setOpen(false);
        onCreated?.();
      } else {
        toast.error(response?.message || "Impossible de créer la catégorie.");
      }
    } catch (error) {
      toast.error("Erreur lors de la création de la catégorie.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une catégorie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
          <DialogDescription>
            Remplissez les informations de la nouvelle catégorie.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              placeholder="Nom de la catégorie"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Description de la catégorie"
              rows={3}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;