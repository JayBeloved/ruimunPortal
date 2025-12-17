import { cn } from "@/lib/utils";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("font-headline font-bold text-xl tracking-tight text-primary", className)}>
      RUIMUN &apos;26
    </Link>
  );
}
