import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/types/category";
import { Tag, FileText, Hash, Layers } from "lucide-react";

type CategoryDetailsModalProps = {
  category: Category;
  children: React.ReactNode;
};

const CategoryDetailsModal = ({ category, children }: CategoryDetailsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Tag className="w-5 h-5 text-blue-500" />
            Détails de la catégorie
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur la catégorie "{category.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations principales */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-4 h-4" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Nom de la catégorie
                  </label>
                  <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-slate-800 p-3 rounded-md">
                    {category.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Identifiant
                  </label>
                  <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-slate-800 p-3 rounded-md">
                    #{category.id}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <div className="bg-neutral-50 dark:bg-slate-800 p-4 rounded-md min-h-[60px]">
                  <p className="text-base text-neutral-900 dark:text-neutral-100">
                    {category.description || (
                      <span className="text-neutral-500 dark:text-neutral-400 italic">
                        Aucune description fournie
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Taxes associées */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="w-4 h-4" />
                Taxes associées
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(category.taxes) && category.taxes.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {category.taxes.length} taxe{category.taxes.length > 1 ? 's' : ''} associée{category.taxes.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.taxes.map((tax, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"
                      >
                        {tax.name || `Taxe ${index + 1}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Layers className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Aucune taxe associée à cette catégorie
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Métadonnées */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Métadonnées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-neutral-600 dark:text-neutral-300">ID unique:</span>
                  <p className="font-mono text-neutral-900 dark:text-neutral-100 mt-1">{category.id}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600 dark:text-neutral-300">Nombre de taxes:</span>
                  <p className="text-neutral-900 dark:text-neutral-100 mt-1">
                    {Array.isArray(category.taxes) ? category.taxes.length : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetailsModal;