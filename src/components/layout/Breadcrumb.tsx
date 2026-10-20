import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="pt-24 pb-3 border-b border-[var(--color-border)]"
      style={{ background: 'var(--color-bg-secondary)' }}
    >
      <div className="container-site">
        <ol
          className="flex items-center flex-wrap gap-1 text-xs text-[var(--color-text-muted)]"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-[var(--color-gold-400)] transition-colors"
              itemProp="item"
            >
              <Home size={12} aria-hidden="true" />
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>

          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-1"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <ChevronRight size={12} aria-hidden="true" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--color-gold-400)] transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  className="text-[var(--color-text-secondary)]"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(idx + 2)} />
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
