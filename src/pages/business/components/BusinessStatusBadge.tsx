import { cn } from "@/lib/utils";

type BusinessStatusBadgeProps = {
    isDeclared: boolean | null,
};

const BusinessStatusBadge = ({ isDeclared }: BusinessStatusBadgeProps) => {
    return (
        <span
            aria-label={isDeclared ? "Déclaré" : "Non déclaré"}
            title={isDeclared ? "Déclaré" : "Non déclaré"}
            className={cn(
                "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap",
                isDeclared
                    ? "bg-green-600/10 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800"
                    : "bg-red-600/10 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800",
            )}
        >
            {isDeclared ? "Déclaré" : "Non déclaré"}
        </span>
    );
};

export default BusinessStatusBadge;
