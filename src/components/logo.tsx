import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image src="https://i.imgur.com/xZVq78X.png" alt="RUIMUN Logo" width={40} height={40} className="h-8 w-auto" />
      <span className="font-headline font-bold text-xl tracking-tight text-primary">
        RUIMUN &apos;26
      </span>
    </Link>
  );
}
