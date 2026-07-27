import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { H3 } from "@/components/ui/typography";

export function CountryDetailSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="border-border flex flex-col gap-3 border-t pt-6">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="text-primary size-5" aria-hidden />}
        <H3>{title}</H3>
      </div>
      {children}
    </div>
  );
}
