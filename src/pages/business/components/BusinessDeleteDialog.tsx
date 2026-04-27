import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Business as BusinessType } from "@/types/business";
import { Loader2 } from "lucide-react";

type BusinessDeleteDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    business: BusinessType | null,
    isDeleting: boolean,
    onConfirm: () => void,
};

const BusinessDeleteDialog = ({
    open,
    onOpenChange,
    business,
    isDeleting,
    onConfirm,
}: BusinessDeleteDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Supprimer le business</DialogTitle>
                    <DialogDescription>
                        Cette action va supprimer {business?.name ?? "ce business"}.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button type="button" variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BusinessDeleteDialog;
