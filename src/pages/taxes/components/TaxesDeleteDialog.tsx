import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Taxe } from "@/types/taxes";
import { Loader2 } from "lucide-react";

type TaxesDeleteDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    taxe: Taxe | null,
    isDeleting: boolean,
    onConfirm: () => void,
};

const TaxesDeleteDialog = ({
    open,
    onOpenChange,
    taxe,
    isDeleting,
    onConfirm,
}: TaxesDeleteDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Supprimer la taxe</DialogTitle>
                    <DialogDescription>
                        Cette action va supprimer {taxe?.title ?? "cette taxe"}.
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

export default TaxesDeleteDialog;
