import { ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { settingsAdminAction } from "@/app/actions/admin";
import { profileAction, passwordAction } from "@/app/actions/auth";
import { revokeAdminSessionsAction } from "@/app/actions/admin-workspace";
import { AdminActionForm } from "@/components/admin-action-form";
import { AdminPageHeading, type AdminContext } from "@/components/admin-workspace-ui";
import { Field } from "@/components/product-ui";
import { PremiumCheckbox } from "@/components/premium-fields";

export async function AdminSettings({ ctx }: { ctx: AdminContext }) {
  const { locale, common, user, text: { manage: t } } = ctx, formProps = { locale, common, text: t }, labels = common.labels;
  const rows = await db.siteSetting.findMany(), get = (key: string) => rows.find(row => row.key === key)?.value;
  const value = (key: string) => typeof get(key) === "string" ? String(get(key)) : "";
  return <><AdminPageHeading ctx={ctx} section="settings" /><div className="admin-management-grid">
    <section className="product-panel"><h2>{common.nav.settings}</h2><AdminActionForm action={settingsAdminAction} {...formProps}>
      <Field name="supportEmail" type="email" label={labels.supportEmail} maxLength={255} defaultValue={value("supportEmail")} /><Field name="supportPhone" type="tel" label={t.phone} maxLength={30} defaultValue={value("supportPhone")} /><Field name="address" label={t.address} maxLength={500} defaultValue={value("address")} />
      <label className="product-checkbox"><PremiumCheckbox name="bookingsEnabled" defaultChecked={get("bookingsEnabled") !== false} />{labels.bookingsEnabled}</label><label className="product-checkbox"><PremiumCheckbox name="adminNotifications" defaultChecked={get("adminNotifications") !== false} />{t.adminNotifications}</label>
    </AdminActionForm></section>
    <section className="product-panel"><h2><ShieldCheck size={19} />{t.security}</h2><p className="form-hint">{t.securityHint}</p><AdminActionForm action={passwordAction} {...formProps} confirm><Field name="currentPassword" label={labels.currentPassword} type="password" autoComplete="current-password" required minLength={10} maxLength={128} /><Field name="newPassword" label={labels.newPassword} type="password" autoComplete="new-password" required minLength={10} maxLength={128} /><Field name="confirmPassword" label={labels.confirmPassword} type="password" autoComplete="new-password" required minLength={10} maxLength={128} /></AdminActionForm><div className="admin-session-action"><AdminActionForm action={revokeAdminSessionsAction} {...formProps} confirm danger submitLabel={t.sessions} /></div></section>
    <details className="product-panel admin-profile-settings" id="profile" open={ctx.query.profile === "1"}>
      <summary>{common.nav.profile}</summary>
      <AdminActionForm action={profileAction} {...formProps}><Field name="firstName" label={labels.name} defaultValue={user.firstName} required maxLength={100} /><Field name="lastName" label={labels.lastName} defaultValue={user.lastName || ""} maxLength={100} /><Field name="phone" label={labels.phone} type="tel" defaultValue={user.phone || ""} required maxLength={30} /></AdminActionForm>
    </details>
  </div></>;
}
