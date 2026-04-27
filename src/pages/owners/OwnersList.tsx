import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getOwners, deleteOwner } from "@/apis/owner-service";
import type { OwnerRequest, OwnerResponse } from "@/types/owner";
import LazyWrapper from "@/components/LazyWrapper";
import CustomSelect from '@/components/shared/CustomSelect';
import SearchBox from '@/components/shared/SearchBox';
import OwnersListTable from '@/components/tables/OwnersListTable';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLoading } from "@/context/LoadingContext";
import Breadcrumb from "@/layouts/Breadcrumb";
import { PageLoader } from "@/loading/PageLoader";
import type { Owner } from "@/types/owner";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const OwnersList = () => {
    const [owners, setOwners] = useState<Owner[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPage, setTotalPage] = useState(0);

    const { loading, setLoading } = useLoading();

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPage;

    const fetchOwners = async () => {
        setLoading(true);
        const query: OwnerRequest = { page: currentPage, limit };
        const response: OwnerResponse = await getOwners(query);
        const { body } = response;
        setOwners(Array.isArray(body.items) ? body.items : body.items ? [body.items] : []);
        setTotalPage(body.totalPage ?? response.totalPage ?? 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchOwners();
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

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce propriétaire ?')) {
            try {
                const response = await deleteOwner(id);
                if (response && response.status >= 200 && response.status < 300) {
                    toast.success(response.message || "Propriétaire supprimé avec succès.");
                    fetchOwners();
                } else {
                    toast.error(response?.message || "Impossible de supprimer le propriétaire.");
                }
            } catch (error) {
                toast.error("Erreur lors de la suppression du propriétaire.");
            }
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
            <Breadcrumb title="Liste des propriétaires" text="Liste des propriétaires" />

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
                    </CardHeader>

                    <CardContent className="card-body p-6">
                        {loading ? (
                            <PageLoader />
                        ) : (
                            <>
                                <OwnersListTable owners={owners} onDelete={handleDelete} onUpdated={fetchOwners} />
                                {totalPage > 1 && (
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
                                            {generatePageNumbers().map((page) => (
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
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </LazyWrapper>
        </>
    );
};

export default OwnersList;