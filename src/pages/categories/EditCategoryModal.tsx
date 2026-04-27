import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { updateCategory } from "@/apis/categories-service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import type { Category } from "@/types/category";

type EditCategoryModalProps = {
  category: Category;
  onUpdated?: () => void;
  children: React.ReactNode;
};

type FormState = {
  name: string;
  description: string;
};

const EditCategoryModal = ({ category, onUpdated, children }: EditCategoryModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormState({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await updateCategory(category.id, formState);

      if (response && response.status >= 200 && response.status < 300) {
        toast.success(response.message || "Catégorie mise à jour avec succès...");
        setOpen(false);
        onUpdated?.();
      } else {
        toast.error(response?.message || "Impossible de mettre à jour la catégorie...");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la catégorie.");
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
          <DialogTitle>Modifier la catégorie</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la catégorie.
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
              {isSaving ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;