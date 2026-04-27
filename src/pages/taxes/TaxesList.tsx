import { getCategories, type CategoriesResponse } from "@/apis/categories-service";
import { createTaxe, deleteTaxe, getTaxes, updateTaxe, type TaxesResponse } from "@/apis/taxes-service";
import LazyWrapper from "@/components/LazyWrapper";
import TaxesListTable from "@/components/tables/TaxesListTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLoading } from "@/context/LoadingContext";
import Breadcrumb from "@/layouts/Breadcrumb";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { Taxe } from "@/types/taxes";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Plus,
    Search,
} from "lucide-react";
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import TaxesDeleteDialog from "./components/TaxesDeleteDialog";
import TaxesDetailsDialog from "./components/TaxesDetailsDialog";
import TaxesFormDialog from "./components/TaxesFormDialog";
import {
    emptyTaxeForm,
    isValidTaxeForm,
    hasTaxeCategory,
    getTaxeCategory,
    taxeToForm,
    toTaxePayload,
    toTaxeUpdatePayload,
    type TaxeFormValues,
} from "./components/taxes-utils";

const getTaxesItems = (response: TaxesResponse): Taxe[] => {
    const { body } = response;

    if (Array.isArray(body)) {
        return body;
    }

    if (!body) {
        return [];
    }

    if (typeof body === "object" && "items" in body) {
        const items = body.items;
        return Array.isArray(items) ? items : items ? [items] : [];
    }

    return [body as Taxe];
};

const getTaxesPagination = (response: TaxesResponse) => {
    const { body } = response;

    if (body && typeof body === "object" && !Array.isArray(body) && "items" in body) {
        return {
            currentPageNumber: body.currentPageNumber ?? 1,
            itemPerPage: body.itemPerPage ?? 10,
            totalPage: body.totalPage ?? 0,
        };
    }

    return {
        currentPageNumber: 1,
        itemPerPage: 10,
        totalPage: 0,
    };
};

const getCategoriesItems = (response: CategoriesResponse): Category[] => {
    const { body } = response;

    if (Array.isArray(body)) {
        return body;
    }

    if (!body) {
        return [];
    }

    if (typeof body === "object" && "items" in body) {
        const items = body.items;
        return Array.isArray(items) ? items : items ? [items] : [];
    }

    return [body as Category];
};

const TaxesList = () => {
    const [taxes, setTaxes] = useState<Taxe[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [itemPerPage, setItemPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [isFetchingCategories, setIsFetchingCategories] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [form, setForm] = useState<TaxeFormValues>(emptyTaxeForm);
    const [editingTaxe, setEditingTaxe] = useState<Taxe | null>(null);
    const [selectedTaxe, setSelectedTaxe] = useState<Taxe | null>(null);
    const [taxeToDelete, setTaxeToDelete] = useState<Taxe | null>(null);

    const { setLoading } = useLoading();

    const refreshTaxes = useCallback(async () => {
        setLoading(true);
        setIsFetching(true);

        try {
            const response = await getTaxes({
                page: currentPage,
                limit: itemPerPage,
                id: null,
            });

            if (response.status === 1) {
                setTaxes(getTaxesItems(response));
                const pagination = getTaxesPagination(response);
                setCurrentPage(pagination.currentPageNumber);
                setTotalPage(pagination.totalPage);
            } else {
                setTaxes([]);
                setTotalPage(0);
                toast.error(response.message || "Impossible de charger les taxes.");
            }
        } catch {
            setTaxes([]);
            setTotalPage(0);
            toast.error("Impossible de charger les taxes.");
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    }, [currentPage, itemPerPage, setLoading]);

    useEffect(() => {
        void refreshTaxes();
    }, [refreshTaxes]);

    const refreshCategories = useCallback(async () => {
        setIsFetchingCategories(true);

        try {
            const response = await getCategories({
                page: 1,
                limit: 100,
                id: null,
            });

            if (response.status === 1) {
                setCategories(getCategoriesItems(response));
            } else {
                setCategories([]);
                toast.error(response.message || "Impossible de charger les categories.");
            }
        } catch {
            setCategories([]);
            toast.error("Impossible de charger les categories.");
        } finally {
            setIsFetchingCategories(false);
        }
    }, []);

    useEffect(() => {
        void refreshCategories();
    }, [refreshCategories]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, itemPerPage]);

    const filteredTaxes = taxes.filter((taxe) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const searchableValue = [
            taxe.title,
            taxe.description,
            taxe.currency,
            getTaxeCategory(taxe)?.name,
            String(taxe.amount),
        ].join(" ").toLowerCase();
        const matchesSearch = normalizedSearch ? searchableValue.includes(normalizedSearch) : true;

        if (!matchesSearch) {
            return false;
        }

        if (statusFilter === "with_category") {
            return hasTaxeCategory(taxe);
        }

        if (statusFilter === "without_category") {
            return !hasTaxeCategory(taxe);
        }

        if (statusFilter === "with_businesses") {
            return taxe.businesses.length > 0;
        }

        if (statusFilter === "without_businesses") {
            return taxe.businesses.length === 0;
        }

        return true;
    });

    useEffect(() => {
        if (totalPage > 0 && currentPage > totalPage) {
            setCurrentPage(totalPage);
        }
    }, [currentPage, totalPage]);

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPage;

    const resetForm = () => {
        setForm(emptyTaxeForm);
        setEditingTaxe(null);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handleCategoryChange = (categoryId: string) => {
        setForm((currentForm) => ({
            ...currentForm,
            categoryId: categoryId === "none" ? "" : categoryId,
        }));
    };

    const handleCreateClick = () => {
        resetForm();
        setIsFormOpen(true);
    };

    const handleEditClick = (taxe: Taxe) => {
        setEditingTaxe(taxe);
        setForm(taxeToForm(taxe));
        setIsFormOpen(true);
    };

    const handleDetailsClick = (taxe: Taxe) => {
        setSelectedTaxe(taxe);
        setIsDetailsOpen(true);
    };

    const handleDeleteClick = (taxe: Taxe) => {
        setTaxeToDelete(taxe);
        setIsDeleteOpen(true);
    };

    const handleFormOpenChange = (open: boolean) => {
        setIsFormOpen(open);

        if (!open) {
            resetForm();
        }
    };

    const handleDetailsOpenChange = (open: boolean) => {
        setIsDetailsOpen(open);

        if (!open) {
            setSelectedTaxe(null);
        }
    };

    const handleDeleteOpenChange = (open: boolean) => {
        setIsDeleteOpen(open);

        if (!open) {
            setTaxeToDelete(null);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValidTaxeForm(form)) {
            toast.error("Renseignez au minimum le titre et le montant.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = editingTaxe
                ? await updateTaxe(editingTaxe.id, toTaxeUpdatePayload(form))
                : await createTaxe(toTaxePayload(form));

            if (response.status !== 1) {
                toast.error(response.message || "L'operation a echoue.");
                return;
            }

            if (editingTaxe) {
                toast.success(response.message || "Taxe modifiee avec succes.");
            } else {
                toast.success(response.message || "Taxe creee avec succes.");
            }

            handleFormOpenChange(false);
            await refreshTaxes();
        } catch {
            toast.error("L'operation a echoue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!taxeToDelete) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await deleteTaxe(taxeToDelete.id);

            if (response.status !== 1) {
                toast.error(response.message || "La suppression a echoue.");
                return;
            }

            toast.success(response.message || "Taxe supprimee avec succes.");
            handleDeleteOpenChange(false);
            await refreshTaxes();
        } catch {
            toast.error("La suppression a echoue.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    };

    const generatePageNumbers = () => {
        const pages: number[] = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPage, currentPage + 2);

        for (let page = start; page <= end; page += 1) {
            pages.push(page);
        }

        return pages;
    };

    return (
        <>
            <Breadcrumb title="Liste des taxes" text="Taxes" />

            <LazyWrapper>
                <Card className="card h-full !p-0 !block border-0 overflow-hidden mb-6">
                    <CardHeader className="border-b border-neutral-200 dark:border-slate-600 !py-4 px-6 flex items-center flex-wrap gap-3 justify-between">
                        <div className="flex items-center flex-wrap gap-3">
                            <span className="text-base font-medium text-neutral-500 dark:text-neutral-300 mb-0">Nombre par page</span>

                            <Select value={String(itemPerPage)} onValueChange={(value) => setItemPerPage(Number(value))}>
                                <SelectTrigger className="min-w-[88px] focus-visible:shadow-none focus-visible:ring-0 font-medium dark:bg-slate-700 text-neutral-900 dark:text-white border border-slate-300 dark:border-slate-500 data-[placeholder]:text-neutral-900">
                                    <SelectValue placeholder="10" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="30">30</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>

                            <InputGroup className="border border-neutral-300 dark:border dark:border-slate-600 !bg-transparent shadow-none md:flex hidden max-w-[280px]">
                                <InputGroupInput
                                    placeholder="Rechercher une taxe..."
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                            </InputGroup>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="min-w-[170px] focus-visible:shadow-none focus-visible:ring-0 font-medium dark:bg-slate-700 text-neutral-900 dark:text-white border border-slate-300 dark:border-slate-500 data-[placeholder]:text-neutral-900">
                                    <SelectValue placeholder="Filtre" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    <SelectItem value="with_category">Avec categorie</SelectItem>
                                    <SelectItem value="without_category">Sans categorie</SelectItem>
                                    <SelectItem value="with_businesses">Avec businesses</SelectItem>
                                    <SelectItem value="without_businesses">Sans businesses</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className={cn("w-auto h-11")} onClick={handleCreateClick}>
                            Ajouter une taxe <Plus className="w-5 h-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="card-body p-6">
                        <TaxesListTable
                            taxeList={filteredTaxes}
                            isLoading={isFetching}
                            onDetailsClick={handleDetailsClick}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                        />

                        {totalPage > 0 && (
                            <div className="mt-5 flex flex-row-reverse gap-2">
                                <ul className="pagination flex flex-wrap items-center gap-2 justify-center">
                                    <li className="page-item">
                                        <button
                                            className={`page-link font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] ${hasPrevious ? "bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                                            onClick={() => handlePageChange(1)}
                                            disabled={!hasPrevious}
                                        >
                                            <ChevronsLeft className="w-6" />
                                        </button>
                                    </li>
                                    <li className="page-item">
                                        <button
                                            className={`page-link font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] ${hasPrevious ? "bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={!hasPrevious}
                                        >
                                            <ChevronLeft className="w-6" />
                                        </button>
                                    </li>

                                    {generatePageNumbers().map((page) => (
                                        <li key={page} className="page-item">
                                            <button
                                                className={`page-link font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] ${page === currentPage ? "bg-primary dark:bg-primary text-white" : "bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white"}`}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))}

                                    <li className="page-item">
                                        <button
                                            className={`page-link font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] ${hasNext ? "bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={!hasNext}
                                        >
                                            <ChevronRight className="w-6" />
                                        </button>
                                    </li>
                                    <li className="page-item">
                                        <button
                                            className={`page-link font-medium rounded-lg border-0 flex items-center justify-center h-[38px] w-[38px] ${hasNext ? "bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                                            onClick={() => handlePageChange(totalPage)}
                                            disabled={!hasNext}
                                        >
                                            <ChevronsRight className="w-6" />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </LazyWrapper>

            <TaxesFormDialog
                open={isFormOpen}
                onOpenChange={handleFormOpenChange}
                form={form}
                categories={categories}
                editingTaxe={editingTaxe}
                isSubmitting={isSubmitting}
                isFetchingCategories={isFetchingCategories}
                onInputChange={handleInputChange}
                onCategoryChange={handleCategoryChange}
                onSubmit={handleSubmit}
            />

            <TaxesDetailsDialog
                open={isDetailsOpen}
                onOpenChange={handleDetailsOpenChange}
                taxe={selectedTaxe}
            />

            <TaxesDeleteDialog
                open={isDeleteOpen}
                onOpenChange={handleDeleteOpenChange}
                taxe={taxeToDelete}
                isDeleting={isDeleting}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};

export default TaxesList;
