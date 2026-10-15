export function AdminSkeleton({ shell = false }: { shell?: boolean }) {
  return <div className={`admin-loading${shell ? " admin-loading-shell" : ""}`} aria-busy="true">
    {shell && <div className="admin-loading-sidebar"><span className="skeleton" />{Array.from({ length: 10 }, (_, i) => <span className="skeleton" key={i} />)}</div>}
    <div className="admin-loading-main"><div className="skeleton admin-loading-title" /><div className="admin-loading-stats">{Array.from({ length: 4 }, (_, i) => <div className="skeleton" key={i} />)}</div><div className="admin-loading-charts"><div className="skeleton" /><div className="skeleton" /></div><div className="skeleton admin-loading-table" /></div>
  </div>;
}
