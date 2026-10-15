export function LoadingSkeleton({ variant = "page" }: { variant?: "page" | "catalog" | "cabin" | "home" | "header" }) {
  if (variant === "header") return <header className="site-header" aria-busy="true"><div className="header-inner section-shell skeleton-header" aria-hidden="true"><span className="skeleton skeleton-logo" /><span className="skeleton skeleton-nav" /></div></header>;
  return <div className={`loading-skeleton skeleton-${variant}`} role="status" aria-busy="true" aria-label="A-FRAME KG · …">
    <div aria-hidden="true">
      <div className="skeleton-heading"><span className="skeleton skeleton-kicker" /><span className="skeleton skeleton-title" /><span className="skeleton skeleton-copy" /></div>
      {variant === "cabin" || variant === "home" ? <><div className="skeleton skeleton-cover" /><div className="skeleton-columns"><div className="skeleton skeleton-panel" /><div className="skeleton skeleton-panel" /></div></> : <div className={variant === "catalog" ? "catalog-page-layout" : "skeleton-columns"}>
        {variant === "catalog" && <div className="skeleton skeleton-panel skeleton-filter" />}
        <div className={variant === "catalog" ? "cabin-grid" : "skeleton-records"}>
          {Array.from({ length: variant === "catalog" ? 6 : 3 }, (_, index) => <div className="skeleton skeleton-panel" key={index} />)}
        </div>
      </div>}
    </div>
  </div>;
}
