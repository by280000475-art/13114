import Link from "next/link";
import { Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/create", label: "创作" },
  { href: "/cases", label: "案例" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-line bg-background/92 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-9 place-items-center rounded-lg bg-foreground text-background">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <span>MiMo CreatorOps</span>
          </Link>
          <nav className="flex items-center gap-1 rounded-lg border border-line bg-surface p-1 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-ink-soft transition hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
