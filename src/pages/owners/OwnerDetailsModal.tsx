import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Owner } from "@/types/owner";
import { User, Phone, Calendar, FileText, Hash, Building } from "lucide-react";

type OwnerDetailsModalProps = {
  owner: Owner;
  children: React.ReactNode;
};
const IMG_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000";

const OwnerDetailsModal = ({ owner, children }: OwnerDetailsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5 text-blue-500" />
            Détails du propriétaire
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur le propriétaire "{owner.firstname} {owner.lastname}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations principales */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-4 h-4" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <img src={`${IMG_BASE_URL}/${owner.photo}`} alt={`${owner.firstname} ${owner.lastname}`} className="w-16 h-16 rounded-full" referrerPolicy="no-referrer"/>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {owner.firstname} {owner.lastname}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">Propriétaire</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Prénom
                  </label>
                  <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-slate-800 p-3 rounded-md">
                    {owner.firstname}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nom
                  </label>
                  <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-slate-800 p-3 rounded-md">
                    {owner.lastname}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date de naissance
                  </label>
                  <p className="text-base text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-slate-800 p-3 rounded-md">
                    {owner.birthdate ? new Date(owner.birthdate).toLocaleDateString() : "Non spécifiée"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <p className="text-base text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-slate-800 p-3 rounded-md">
                    {owner.phone}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    ID National
                  </label>
                  <p className="text-base text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-slate-800 p-3 rounded-md">
                    {owner.nationalID || "Non spécifié"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Type d'ID National
                  </label>
                  <p className="text-base text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-slate-800 p-3 rounded-md">
                    {owner.nationalIDType || "Non spécifié"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Fichier ID National
                  </label>
                  {owner.nationalIDFile ? (
                    <a href={owner.nationalIDFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Voir le fichier
                    </a>
                  ) : (
                    <p className="text-base text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-slate-800 p-3 rounded-md">
                      Aucun fichier
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entreprises associées */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="w-4 h-4" />
                Entreprises associées
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(owner.businesses) && owner.businesses.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {owner.businesses.length} entreprise{owner.businesses.length > 1 ? 's' : ''} associée{owner.businesses.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {owner.businesses.map((business: any, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"
                      >
                        {business.name || `Entreprise ${index + 1}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                  Aucune entreprise associée
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerDetailsModal;