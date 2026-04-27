import { cn } from "@/lib/utils";

type BusinessStatusBadgeProps = {
    isDeclared: boolean | null,
};

const BusinessStatusBadge = ({ isDeclared }: BusinessStatusBadgeProps) => {
    return (
        <span
            className={cn(
                "px-3 py-1.5 rounded text-sm font-medium border",
                isDeclared
                    ? "bg-green-600/15 text-green-600 border-green-600"
                    : "bg-gray-600/15 text-gray-600 dark:text-white border-gray-400",
            )}
        >
            {isDeclared ? "Déclaré" : "Non déclaré"}
        </span>
    );
};

export default BusinessStatusBadge;
