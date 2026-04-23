import LazyWrapper from "@/components/LazyWrapper";
import CustomSelect from '@/components/shared/CustomSelect';
import SearchBox from '@/components/shared/SearchBox';
import UsersListTable from '@/components/tables/UsersListTable';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Breadcrumb from "@/layouts/Breadcrumb";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { type UserType } from "@/types/user";
import { getUsers, type UserResponse } from "@/apis/users-service";
import { useLoading } from "@/context/LoadingContext";

const UsersList = () => {
    const [UserList, setUserList] = useState<UserType[]>([]);
    const { setLoading } = useLoading();
    const fetchUsers = async () => {
        setLoading(true);
        const response: UserResponse = await getUsers();
        const { status, message, body  } = response;
        setUserList(Array.isArray(body) ? body : body ? [body] : []);
        setLoading(false);
    };

    useEffect( () => {
        fetchUsers();
    }, []);

    return (
        <>
            <Breadcrumb title="Liste des utilisateurs" text="Liste des utilisateurs" />

            <LazyWrapper>
                <Card className="card h-full !p-0 !block border-0 overflow-hidden mb-6">
                    <CardHeader className="border-b border-neutral-200 dark:border-slate-600 !py-4 px-6 flex items-center flex-wrap gap-3 justify-between">
                        <div className="flex items-center flex-wrap gap-3">
                            <span className="text-base font-medium text-neutral-500 dark:text-neutral-300 mb-0">Nombre par page</span>
                            <CustomSelect
                                placeholder="20"
                                options={["10", "20", "30", "50"]}
                            />
                            <SearchBox />
                            <CustomSelect
                                placeholder="Status"
                                options={["Actif", "Inactif", "Désactivé"]}
                            />
                        </div>
                        <Button className={cn(`w-auto h-11`)} asChild>
                            <Link to="#">  
                                Ajouter un utilisateur <Plus className="w-5 h-5" />
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent className="card-body p-6">
                        <UsersListTable userList={UserList}/> 
                        {/* Pagination */}
                        <div className="mt-5 flex flex-row-reverse gap-2">
                            <ul className="pagination flex flex-wrap items-center gap-2 justify-center">
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px]" to="#">
                                    <ChevronsLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px]" to="#">
                                    <ChevronLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px]" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link  font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] bg-primary dark:bg-primary text-white" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px]" to="#">4</Link>
                            </li>
                            
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px]" to="#">
                                    <ChevronRight className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px]" to="#">
                                    <ChevronsRight className="w-6" />
                                </Link>
                            </li>
                        </ul>
                        </div>  
                    </CardContent>

                </Card>
            </LazyWrapper>

        </>
    );
};

export default UsersList;