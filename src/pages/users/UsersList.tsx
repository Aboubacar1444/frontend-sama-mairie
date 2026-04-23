import { getUsers, type UserRequest, type UserResponse } from "@/apis/users-service";
import LazyWrapper from "@/components/LazyWrapper";
import CustomSelect from '@/components/shared/CustomSelect';
import SearchBox from '@/components/shared/SearchBox';
import UsersListTable from '@/components/tables/UsersListTable';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLoading } from "@/context/LoadingContext";
import Breadcrumb from "@/layouts/Breadcrumb";
import { cn } from "@/lib/utils";
import type { UserType } from "@/types/user";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const UsersList = () => {
    const [UserList, setUserList] = useState<UserType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(20);
    const [totalPage, setTotalPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState<UserRequest>({});

    const { setLoading } = useLoading();

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPage;

    const fetchUsers = async () => {
        setLoading(true);
        const query: UserRequest = { ...searchQuery, page: currentPage };
        const response: UserResponse = await getUsers(query);
        const { status, message, body  } = response;
        setUserList(Array.isArray(body.items) ? body.items : body.items ? [body.items] : []);
        setTotalItemCount(body.totalItemCount || 0);
        setItemPerPage(body.itemPerPage || 20);
        setTotalPage(body.totalPage || 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchQuery]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPage, currentPage + 2);
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

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
                                    <button
                                        className={`page-link font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] ${hasPrevious ? 'bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                        onClick={() => handlePageChange(1)}
                                        disabled={!hasPrevious}
                                    >
                                        <ChevronsLeft className="w-6" />
                                    </button>
                                </li>
                                <li className="page-item">
                                    <button
                                        className={`page-link font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] ${hasPrevious ? 'bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!hasPrevious}
                                    >
                                        <ChevronLeft className="w-6" />
                                    </button>
                                </li>
                                {generatePageNumbers().map(page => (
                                    <li key={page} className="page-item">
                                        <button
                                            className={`page-link font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] ${page === currentPage ? 'bg-primary dark:bg-primary text-white' : 'bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white'}`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <button
                                        className={`page-link font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] ${hasNext ? 'bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!hasNext}
                                    >
                                        <ChevronRight className="w-6" />
                                    </button>
                                </li>
                                <li className="page-item">
                                    <button
                                        className={`page-link font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] ${hasNext ? 'bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                        onClick={() => handlePageChange(totalPage)}
                                        disabled={!hasNext}
                                    >
                                        <ChevronsRight className="w-6" />
                                    </button>
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