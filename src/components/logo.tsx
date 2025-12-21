import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image src="https://i.imgur.com/xZVq78X.png" alt="RUIMUN Logo" width={100} height={100} className="h-10 w-auto" />
      <span className="font-headline font-bold text-xl tracking-tight text-primary">
        RUIMUN
      </span>
    </Link>
  );
}
