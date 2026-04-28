import { deleteBusiness, getBusinesses, updateBusiness, type BusinessResponse } from "@/apis/business-service";
import { getTaxes, type TaxesResponse } from "@/apis/taxes-service";
import LazyWrapper from "@/components/LazyWrapper";
import BusinessListTable from "@/components/tables/BusinessListTable";
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
import type { Business as BusinessType } from "@/types/business";
import type { Taxe } from "@/types/taxes";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
} from "lucide-react";
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import BusinessDeleteDialog from "./components/BusinessDeleteDialog";
import BusinessDetailsDialog from "./components/BusinessDetailsDialog";
import BusinessFormDialog from "./components/BusinessFormDialog";
import {
    businessToForm,
    emptyBusinessForm,
    getOwnerName,
    getErrorMessage,
    isValidBusinessForm,
    toBusinessUpdatePayload,
    type BusinessFormValues,
} from "./components/business-utils";

const getBusinessItems = (response: BusinessResponse): BusinessType[] => {
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

    return [body as BusinessType];
};

const getBusinessPagination = (response: BusinessResponse) => {
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

const BusinessList = () => {
    const [businesses, setBusinesses] = useState<BusinessType[]>([]);
    const [taxes, setTaxes] = useState<Taxe[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [itemPerPage, setItemPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [isFetchingTaxes, setIsFetchingTaxes] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [updatingDeclaredIds, setUpdatingDeclaredIds] = useState<number[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [form, setForm] = useState<BusinessFormValues>(emptyBusinessForm);
    const [editingBusiness, setEditingBusiness] = useState<BusinessType | null>(null);
    const [selectedBusiness, setSelectedBusiness] = useState<BusinessType | null>(null);
    const [businessToDelete, setBusinessToDelete] = useState<BusinessType | null>(null);

    const { setLoading } = useLoading();

    const refreshBusinesses = useCallback(async () => {
        setLoading(true);
        setIsFetching(true);

        try {
            const response = await getBusinesses({
                page: currentPage,
                limit: itemPerPage,
                id: null,
            });

            if (response.status === 1) {
                setBusinesses(getBusinessItems(response));
                const pagination = getBusinessPagination(response);
                setCurrentPage(pagination.currentPageNumber);
                setTotalPage(pagination.totalPage);
            } else {
                setBusinesses([]);
                setTotalPage(0);
                toast.error(response.message || "Impossible de charger les business.");
            }
        } catch {
            setBusinesses([]);
            setTotalPage(0);
            toast.error("Impossible de charger les business.");
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    }, [currentPage, itemPerPage, setLoading]);

    useEffect(() => {
        void refreshBusinesses();
    }, [refreshBusinesses]);

    const refreshTaxes = useCallback(async () => {
        setIsFetchingTaxes(true);

        try {
            const response = await getTaxes({
                page: 1,
                limit: 100,
                id: null,
            });

            if (response.status === 1) {
                setTaxes(getTaxesItems(response));
            } else {
                setTaxes([]);
                toast.error(response.message || "Impossible de charger les taxes.");
            }
        } catch {
            setTaxes([]);
            toast.error("Impossible de charger les taxes.");
        } finally {
            setIsFetchingTaxes(false);
        }
    }, []);

    useEffect(() => {
        void refreshTaxes();
    }, [refreshTaxes]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, itemPerPage]);

    const filteredBusinesses = businesses.filter((business) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const searchableValue = [
            business.name,
            business.type,
            business.local_type,
            business.local_status,
            business.rccm,
            business.nif,
            business.owner?.phone,
            getOwnerName(business),
            business.taxe?.title,
        ].join(" ").toLowerCase();
        const matchesSearch = normalizedSearch ? searchableValue.includes(normalizedSearch) : true;

        if (!matchesSearch) {
            return false;
        }

        if (statusFilter === "declared") {
            return Boolean(business.is_declared);
        }

        if (statusFilter === "not_declared") {
            return !business.is_declared;
        }

        if (statusFilter === "with_taxe") {
            return Boolean(business.taxe);
        }

        if (statusFilter === "without_taxe") {
            return !business.taxe;
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
        setForm(emptyBusinessForm);
        setEditingBusiness(null);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handleTaxeChange = (taxesId: string) => {
        setForm((currentForm) => ({
            ...currentForm,
            taxesId: taxesId === "none" ? "" : taxesId,
        }));
    };

    const handleEditClick = (business: BusinessType) => {
        setEditingBusiness(business);
        setForm(businessToForm(business));
        setIsFormOpen(true);
    };

    const handleDetailsClick = (business: BusinessType) => {
        setSelectedBusiness(business);
        setIsDetailsOpen(true);
    };

    const handleDeleteClick = (business: BusinessType) => {
        setBusinessToDelete(business);
        setIsDeleteOpen(true);
    };

    const handleDeclaredToggle = async (business: BusinessType, checked: boolean) => {
        setUpdatingDeclaredIds((currentIds) => [...currentIds, business.id]);
        setBusinesses((currentBusinesses) => currentBusinesses.map((currentBusiness) => (
            currentBusiness.id === business.id
                ? { ...currentBusiness, is_declared: checked }
                : currentBusiness
        )));

        try {
            const response = await updateBusiness(business.id, { is_declared: checked });

            if (response.status !== 1) {
                setBusinesses((currentBusinesses) => currentBusinesses.map((currentBusiness) => (
                    currentBusiness.id === business.id
                        ? { ...currentBusiness, is_declared: business.is_declared }
                        : currentBusiness
                )));
                toast.error(response.message || "Le changement de statut a echoue.");
                return;
            }

            toast.success(response.message || "Statut du business mis a jour.");
        } catch (error) {
            setBusinesses((currentBusinesses) => currentBusinesses.map((currentBusiness) => (
                currentBusiness.id === business.id
                    ? { ...currentBusiness, is_declared: business.is_declared }
                    : currentBusiness
            )));
            toast.error(getErrorMessage(error));
        } finally {
            setUpdatingDeclaredIds((currentIds) => currentIds.filter((id) => id !== business.id));
        }
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
            setSelectedBusiness(null);
        }
    };

    const handleDeleteOpenChange = (open: boolean) => {
        setIsDeleteOpen(open);

        if (!open) {
            setBusinessToDelete(null);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!editingBusiness) {
            toast.error("La creation de business n'est pas disponible dans cette application.");
            return;
        }

        if (!isValidBusinessForm(form, true)) {
            toast.error("Renseignez au minimum le nom et le type.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await updateBusiness(editingBusiness.id, toBusinessUpdatePayload(form));

            if (response.status !== 1) {
                toast.error(response.message || "L'operation a echoue.");
                return;
            }

            toast.success(response.message || "Business modifie avec succes.");

            handleFormOpenChange(false);
            await refreshBusinesses();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!businessToDelete) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await deleteBusiness(businessToDelete.id);

            if (response.status !== 1) {
                toast.error(response.message || "La suppression a echoue.");
                return;
            }

            toast.success(response.message || "Business supprime avec succes.");
            handleDeleteOpenChange(false);
            await refreshBusinesses();
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
            <Breadcrumb title="Liste des activités" text="Activités" />

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
                                    placeholder="Rechercher une activité..."
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                            </InputGroup>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="min-w-[160px] focus-visible:shadow-none focus-visible:ring-0 font-medium dark:bg-slate-700 text-neutral-900 dark:text-white border border-slate-300 dark:border-slate-500 data-[placeholder]:text-neutral-900">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    <SelectItem value="declared">Declares</SelectItem>
                                    <SelectItem value="not_declared">Non declares</SelectItem>
                                    <SelectItem value="with_taxe">Avec taxe</SelectItem>
                                    <SelectItem value="without_taxe">Sans taxe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="card-body p-6">
                        <BusinessListTable
                            businessList={filteredBusinesses}
                            isLoading={isFetching}
                            onDetailsClick={handleDetailsClick}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                            onDeclaredToggle={handleDeclaredToggle}
                            updatingDeclaredIds={updatingDeclaredIds}
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

            <BusinessFormDialog
                open={isFormOpen}
                onOpenChange={handleFormOpenChange}
                form={form}
                taxes={taxes}
                editingBusiness={editingBusiness}
                isSubmitting={isSubmitting}
                isFetchingTaxes={isFetchingTaxes}
                onInputChange={handleInputChange}
                onTaxeChange={handleTaxeChange}
                onSubmit={handleSubmit}
            />

            <BusinessDetailsDialog
                open={isDetailsOpen}
                onOpenChange={handleDetailsOpenChange}
                business={selectedBusiness}
            />

            <BusinessDeleteDialog
                open={isDeleteOpen}
                onOpenChange={handleDeleteOpenChange}
                business={businessToDelete}
                isDeleting={isDeleting}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};

export default BusinessList;
