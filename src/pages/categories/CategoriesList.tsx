import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCategories, deleteCategory } from "@/apis/categories-service";
import type { CategoryRequest, CategoryResponse } from "@/types/category";
import LazyWrapper from "@/components/LazyWrapper";
import CustomSelect from '@/components/shared/CustomSelect';
import SearchBox from '@/components/shared/SearchBox';
import CategoriesListTable from '@/components/tables/CategoriesListTable';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLoading } from "@/context/LoadingContext";
import Breadcrumb from "@/layouts/Breadcrumb";
import { PageLoader } from "@/loading/PageLoader";
import type { Category } from "@/types/category";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const CategoriesList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPage, setTotalPage] = useState(0);

    const { loading, setLoading } = useLoading();

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPage;

    const fetchCategories = async () => {
        setLoading(true);
        const query: CategoryRequest = { page: currentPage, limit };
        const response: CategoryResponse = await getCategories(query);
        if (response.status !== 1) {
            toast.error(response.message || "Impossible de charger les catégories.");
            setLoading(false);
            return;
        }
        const { body } = response;
        setCategories(Array.isArray(body.items) ? body.items : body.items ? [body.items] : []);
        setTotalPage(body.totalPage ?? response.totalPage ?? 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
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
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            try {
                const response = await deleteCategory(id);
                if (response && response.status >= 200 && response.status < 300) {
                    toast.success(response.message || "Catégorie supprimée avec succès.");
                    fetchCategories();
                } else {
                    toast.error(response?.message || "Impossible de supprimer la catégorie.");
                }
            } catch (error) {
                toast.error("Erreur lors de la suppression de la catégorie.");
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
            <Breadcrumb title="Liste des catégories" text="Liste des catégories" />

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
                                <CategoriesListTable
                                    categories={categories}
                                    onDelete={handleDelete}
                                    onUpdated={fetchCategories}
                                />
                                {/* Pagination */}
                                {
                                    totalPage > 1 && (
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

export default CategoriesList;