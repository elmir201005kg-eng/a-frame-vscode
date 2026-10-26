import Image from "@/components/image";
import { Plus, House, ArrowUpRight } from "lucide-react";
import Link from "@/components/navigation-link";
import { db } from "@/lib/db";
import { cabinInclude, localizedName } from "@/lib/catalog";
import { adminPage } from "@/lib/admin-period";
import { queryString } from "@/lib/admin-filters";
import { OwnerCabinEditor } from "@/components/owner-cabin-editor";
import { AdminActionForm } from "@/components/admin-action-form";
import { cabinAdminAction } from "@/app/actions/admin";
import { deleteCabinAdminAction } from "@/app/actions/admin-workspace";
import { SelectField, Money, StatusBadge } from "@/components/product-ui";
import { AdminPageHeading, AdminFilters, AdminTable, AdminPagination, localizedTitle, hidden, type AdminContext } from "@/components/admin-workspace-ui";
import type { Prisma } from "@/generated/prisma/client";

export async function AdminCabins({ ctx }: { ctx: AdminContext }) {
  const { locale, common, text: { manage: t }, query } = ctx, edit = queryString(query, "edit"), q = queryString(query, "q"), status = queryString(query, "status");
  if (edit) {
    const cabin = /^[1-9]\d{0,17}$/.test(edit) ? await db.cabin.findUnique({ where: { id: BigInt(edit) }, include: { ...cabinInclude, categories: { include: { category: true } } } }) : null;
    const [owners, regions, amenities, categories] = await Promise.all([
      db.ownerProfile.findMany({ where: { user: { isActive: true, role: "OWNER" } }, orderBy: { id: "asc" }, select: { id: true, businessName: true, user: { select: { firstName: true } } } }),
      db.region.findMany({ where: { isActive: true } }), db.amenity.findMany({ where: { isActive: true } }), db.category.findMany({ where: { isActive: true } }),
    ]);
    return <><AdminPageHeading ctx={ctx} section="cabins"><Link className="admin-button" href={`/${locale}/admin/cabins`}>{t.back}</Link></AdminPageHeading>
      {edit !== "new" && !cabin ? <p className="product-notice">{common.errors.notFound}</p> : !owners.length ? <p className="product-notice">{t.noOwners}</p> : <OwnerCabinEditor cabin={cabin || undefined} locale={locale} common={common}
        refs={{ regions: regions.map(row => ({ id: row.id, name: localizedName(row, locale) })), amenities: amenities.map(row => ({ id: row.id, name: localizedName(row, locale) })) }}
        admin={{ text: t, owners: owners.map(row => ({ id: String(row.id), name: row.businessName || row.user.firstName })), categories: categories.map(row => ({ id: row.id, name: localizedName(row, locale) })), selectedCategories: cabin?.categories.map(row => row.categoryId) || [] }} />}</>;
  }
  const where: Prisma.CabinWhereInput = {
    ...(q ? { OR: ["title", "titleKg", "titleEn"].map(key => ({ [key]: { contains: q, mode: "insensitive" } })) } : {}),
    ...(["DRAFT", "PENDING", "PUBLISHED", "BLOCKED", "ARCHIVED"].includes(status) ? { status: status as Prisma.EnumCabinStatusFilter["equals"] } : {}),
  };
  const count = await db.cabin.count({ where }), page = Math.min(adminPage(query), Math.max(1, Math.ceil(count / 20)));
  const rows = await db.cabin.findMany({ where, take: 20, skip: (page - 1) * 20, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    include: { location: { include: { region: true } }, owner: { select: { businessName: true, user: { select: { firstName: true } } } }, images: { take: 1, orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }] }, _count: { select: { bookings: true } } } });
  return <><AdminPageHeading ctx={ctx} section="cabins"><Link className="admin-button admin-button-gold" href={`/${locale}/admin/cabins?edit=new`}><Plus size={16} />{common.labels.addCabin}</Link></AdminPageHeading>
    <AdminFilters ctx={ctx} section="cabins" statuses={["DRAFT", "PENDING", "PUBLISHED", "BLOCKED", "ARCHIVED"]} />
    <AdminTable headings={[common.nav.cabins, common.labels.region, t.owner, common.labels.price, common.labels.status, t.actions]} empty={!rows.length} caption={common.labels.empty}>
      {rows.map(row => <tr className="admin-record" key={String(row.id)}><td><div className="admin-property-cell"><span className="admin-property-thumbnail">{row.images[0] ? <Image src={row.images[0].imageUrl} alt="" width={54} height={54} unoptimized /> : <House size={22} />}</span><div><Link href={`/${locale}/admin/cabins?edit=${row.id}`}>{localizedTitle(row, locale)}</Link><small>#{String(row.id)} · {row.maxGuests} {common.labels.guests}{row.isDemo ? ` · ${common.labels.demo}` : ""}</small></div></div></td>
        <td>{localizedName(row.location.region, locale)}</td><td>{row.owner.businessName || row.owner.user.firstName}</td><td><Money amount={String(row.pricePerNight)} locale={locale} common={common} /></td><td><StatusBadge status={row.status} common={common} /></td><td><details className="admin-row-details"><summary>{t.actions}</summary><div className="admin-row-actions"><Link className="admin-button" href={`/${locale}/admin/cabins?edit=${row.id}`}>{common.labels.edit}<ArrowUpRight size={14} /></Link>
          <AdminActionForm action={cabinAdminAction} locale={locale} common={common} text={t} confirm>{hidden("cabinId", row.id)}<SelectField label={common.labels.status} name="status" defaultValue={row.status}>{["DRAFT", "PENDING", "PUBLISHED", "BLOCKED", "ARCHIVED"].map(value => <option key={value} value={value}>{common.statuses[value as keyof typeof common.statuses]}</option>)}</SelectField></AdminActionForm>
          {!row._count.bookings && <AdminActionForm action={deleteCabinAdminAction} locale={locale} common={common} text={t} confirm danger submitLabel={t.delete}>{hidden("cabinId", row.id)}</AdminActionForm>}</div></details></td></tr>)}
    </AdminTable><AdminPagination ctx={ctx} section="cabins" count={count} page={page} /></>;
}
