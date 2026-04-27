import { getUsers, type UserRequest, type UserResponse } from "@/apis/users-service";
import LazyWrapper from "@/components/LazyWrapper";
import CustomSelect from '@/components/shared/CustomSelect';
import SearchBox from '@/components/shared/SearchBox';
import UsersListTable from '@/components/tables/UsersListTable';
import AddUserModal from '@/pages/users/AddUserModal';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLoading } from "@/context/LoadingContext";
import Breadcrumb from "@/layouts/Breadcrumb";
import { PageLoader } from "@/loading/PageLoader";
import type { UserType } from "@/types/user";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingSkeleton from "@/loading/LoadingSkeleton";

const UsersList = () => {
    const [UserList, setUserList] = useState<UserType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPage, setTotalPage] = useState(0);

    const { loading, setLoading } = useLoading();

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPage;

    const fetchUsers = async () => {
        setLoading(true);
        const query: UserRequest = { page: currentPage, limit };
        const response: UserResponse = await getUsers(query);
        const { body } = response;
        setUserList(Array.isArray(body.items) ? body.items : body.items ? [body.items] : []);
        setTotalPage(body.totalPage || 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, limit]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    };

    const handleLimitChange = (value: string) => {
        const parsed = Number(value);
        if (!Number.isNaN(parsed) && parsed > 0) {
            setLimit(parsed);
            setCurrentPage(1);
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
                <Card className="card h-full p-0! block! border-0 overflow-hidden mb-6">
                    <CardHeader className="border-b border-neutral-200 dark:border-slate-600 py-4! px-6 flex items-center flex-wrap gap-3 justify-between">
                        <div className="flex items-center flex-wrap gap-3">
                            <span className="text-base font-medium text-neutral-500 dark:text-neutral-300 mb-0">Nombre par page</span>
                            <CustomSelect
                                placeholder="20"
                                options={["10", "20", "30", "50"]}
                                value={limit.toString()}
                                onValueChange={handleLimitChange}
                            />
                            <SearchBox />
                            <CustomSelect
                                placeholder="Status"
                                options={["Actif", "Inactif", "Désactivé"]}
                            />
                        </div>
                        <AddUserModal onCreated={() => {
                            if (currentPage === 1) {
                                fetchUsers();
                            } else {
                                setCurrentPage(1);
                            }
                        }} />
                    </CardHeader>

                    <CardContent className="card-body p-6">
                        {loading ? (
                            <PageLoader />
                            
                        ) : (
                            <>
                                <UsersListTable userList={UserList}/>
                                {/* Pagination */}
                                {
                                    totalPage >= 1 && (
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
                                    )
                                }
                               
                            </>
                        )}
                    </CardContent>

                </Card>
            </LazyWrapper>

        </>
    );
};

export default UsersList;
