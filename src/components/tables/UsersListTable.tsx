
import { Button } from "@/components/ui/button";
import {type UserType} from "@/types/user";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { formatDateToFrench } from "@/utils/date-formatter";
import { Link, useNavigate } from "react-router-dom";



const IMG_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000";

export default function UsersListTable({userList}: {userList?: UserType[]}) {
    const navigate = useNavigate();
    return (
        <Table className="w-full  border-spacing-0.1 border-separate border-neutral-300 dark:border-slate-600"  >
            <TableHeader>
                <TableRow className="bg-neutral-200 dark:bg-slate-700 text-center">
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg w-[80px]">Nº</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 rounded-tl-lg w-[80px]">Photo</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Prénom & Nom</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Email</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Nº. Téléphone</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Date de naissance</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Fonction</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600 ">Statut</TableHead>
                    <TableHead className="px-4 h-12 text-center bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 first:border-s last:border-e dark:border-slate-600  rounded-tr-lg">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userList?.map((user, index) => {
                    const isLast = index === userList.length - 1;
                    return (
                        <TableRow key={user.id}>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.id}
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    {
                                        user.photo ? (
                                            <img
                                                src={IMG_BASE_URL + "/" + user.photo}
                                                alt={user.firstname + " " + user.lastname}
                                                className="w-10 h-10 rounded-full object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"></div>
                                        )
                                    }
                                </div>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.firstname + " " + user.lastname}</TableCell>
                            
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.email}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.phone}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.birthdate && formatDateToFrench(user.birthdate)}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >{user.roles[0]}</TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <span
                                    className={`px-3 py-1.5 rounded text-sm font-medium border ${user.status === "Active"
                                        ? "bg-green-600/15 text-green-600 border-green-600"
                                        : user.status === "Inactif" 
                                        ? "bg-gray-600/15 text-gray-600 dark:text-white border-gray-400"
                                        : "bg-red-600/15 text-red-600 border-red-600"
                                        }`}
                                >
                                    {user.status}
                                </span>
                            </TableCell>
                            <TableCell
                                className={`py-4 px-4 border-b text-center first:border-s last:border-e border-neutral-200 dark:border-slate-600 ${isLast ? "rounded-bl-lg" : ""
                                    }`}
                            >
                                <div className="flex justify-center gap-2">
                                    <Button size="icon" variant="ghost" className="rounded-[50%] text-blue-500 bg-primary/10"
                                        onClick={() => navigate(`/view-profile/${user.id}`)}
                                    >
                                        <Eye className="w-5 h-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="rounded-[50%] text-green-600 bg-green-600/10">
                                        <Edit className="w-5 h-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="rounded-[50%] text-red-500 bg-red-500/10">
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );
}
