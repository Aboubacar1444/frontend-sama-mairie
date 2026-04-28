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
                "inline-flex items-center justify-center px-3 py-1.5 rounded text-sm font-medium border whitespace-nowrap",
                isDeclared
                    ? "bg-green-600/15 text-green-600 border-green-600"
                    : "bg-red-600/15 text-red-600 border-red-600",
            )}
        >
            {isDeclared ? "Déclaré" : "Non déclaré"}
        </span>
    );
};

export default BusinessStatusBadge;
