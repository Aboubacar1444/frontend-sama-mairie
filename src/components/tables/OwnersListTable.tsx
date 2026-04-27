import { Button } from "@/components/ui/button";
import type { Owner } from "@/types/owner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import EditOwnerModal from "@/pages/owners/EditOwnerModal";
import OwnerDetailsModal from "@/pages/owners/OwnerDetailsModal";

interface OwnersListTableProps {
    owners: Owner[];
    onDelete: (id: number) => void;
    onUpdated: () => void;
}
const IMG_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000";

export default function OwnersListTable({ owners, onDelete, onUpdated }: OwnersListTableProps) {
    return (
        <Table className="w-full border-spacing-0.1 border-separate border-neutral-300 dark:border-slate-600">
            <TableHeader>
                <TableRow className="bg-neutral-200 dark:bg-slate-700 text-center">
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg w-20">Nº</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Photo</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Prénom</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Nom</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600">Téléphone</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tr-lg">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {owners.map((owner, index) => {
                    const isLast = index === owners.length - 1;
                    return (
                        <TableRow key={owner.id}>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""}`}
                            >
                                {owner.id}
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600`}
                            >
                                <img src={IMG_BASE_URL + "/" +owner.photo} alt={`${owner.firstname} ${owner.lastname}`} className="w-10 h-10 rounded-full mx-auto" referrerPolicy="no-referrer"/>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600`}
                            >
                                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {owner.firstname}
                                </div>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600`}
                            >
                                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {owner.lastname}
                                </div>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600`}
                            >
                                <div className="text-neutral-600 dark:text-neutral-300">
                                    {owner.phone}
                                </div>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-br-lg" : ""}`}
                            >
                                <div className="flex justify-center gap-2">
                                    <OwnerDetailsModal owner={owner}>
                                        <Button size="icon" variant="ghost" className="rounded-[50%] text-blue-500 bg-primary/10 hover:bg-primary/20">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </OwnerDetailsModal>
                                    <EditOwnerModal owner={owner} onUpdated={onUpdated}>
                                        <Button size="icon" variant="ghost" className="rounded-[50%] text-green-500 bg-green-500/10 hover:bg-green-500/20">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </EditOwnerModal>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="rounded-[50%] text-red-500 bg-red-500/10 hover:bg-red-500/20"
                                        onClick={() => onDelete(owner.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}