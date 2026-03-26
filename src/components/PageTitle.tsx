import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageTitleProps {
  title: string;
  bgImage?: string;
  breadcrumbs: BreadcrumbItem[];
}

export default function PageTitle({
  title,
  bgImage = "/images/about/bomach-engineering5.jpg",
  breadcrumbs,
}: PageTitleProps) {
  return (
    <section
      className="relative min-h-[300px] overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-950/90 via-secondary-900/70 to-secondary-950/90" />

      {/* Content */}
      <div className="relative flex min-h-[300px] items-center justify-center px-4 py-20">
        <AnimatedSection direction="up" className="text-center">
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            {title}
          </h1>

          {/* Decorative underline */}
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary-600" />

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="mt-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-white/70">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-primary-500"
                >
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-primary-500"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-primary-500">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </AnimatedSection>
      </div>
    </section>
  );
}
