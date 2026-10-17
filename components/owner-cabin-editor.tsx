import Image from "next/image";
import Link from "@/components/navigation-link";
import { ActionForm } from "@/components/action-form";
import { PhotoUpload } from "@/components/photo-upload";
import { Field, SelectField, TextAreaField, StatusBadge } from "@/components/product-ui";
import {
  cabinAction,
  calendarAction,
  submitCabinAction,
  archiveCabinAction,
} from "@/app/actions/owner";
import { removePhotoAction } from "@/app/actions/photos";
import type { CabinRecord } from "@/lib/catalog";
import type { CommonDictionary } from "@/app/i18n/platform";
import type { Locale } from "@/app/i18n/config";
import { PremiumCheckbox } from "@/components/premium-fields";
import { PremiumDatePicker } from "@/components/premium-date-picker";
import { AdminActionForm } from "@/components/admin-action-form";
import { cabinAdminAction } from "@/app/actions/admin";
import { deleteCabinAdminAction } from "@/app/actions/admin-workspace";
import type { AdminDictionary } from "@/app/i18n/admin";

export function OwnerCabinEditor({
  cabin,
  locale,
  common,
  refs,
  admin,
}: {
  cabin?: CabinRecord;
  locale: Locale;
  common: CommonDictionary;
  refs: { regions: { id: number; name: string }[]; amenities: { id: number; name: string }[] };
  admin?: { text: AdminDictionary["manage"]; owners: { id: string; name: string }[]; categories: { id: number; name: string }[]; selectedCategories: number[] };
}) {
  const labels = common.labels;
  return (
    <div className="owner-editor-layout">
      <section className="product-panel">
        <ActionForm
          action={cabinAction}
          locale={locale}
          common={common}
          submitLabel={labels.save}
          id="cabin-editor"
        >
          <input name="cabinId" value={cabin?.id.toString() || ""} type="hidden" />
          {admin && <SelectField label={admin.text.owner} name="ownerId" required defaultValue={cabin?.ownerId.toString()}>
            {admin.owners.map(owner => <option key={owner.id} value={owner.id}>{owner.name}</option>)}
          </SelectField>}
          <Field
            label={labels.title}
            name="title"
            required
            minLength={3}
            maxLength={255}
            defaultValue={cabin?.title}
          />
          <Field
            label={labels.slug}
            name="slug"
            required
            minLength={2}
            maxLength={100}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            defaultValue={cabin?.slug}
          />
          <TextAreaField
            label={labels.description}
            name="description"
            required
            defaultValue={cabin?.description}
          />
          <details className="translation-fields">
            <summary>{common.nav.translations} · KG / EN</summary>
            <Field
              label={`${labels.title} · KG`}
              name="titleKg"
              maxLength={255}
              defaultValue={cabin?.titleKg || ""}
            />
            <TextAreaField
              label={`${labels.description} · KG`}
              name="descriptionKg"
              defaultValue={cabin?.descriptionKg || ""}
            />
            <Field
              label={`${labels.title} · EN`}
              name="titleEn"
              maxLength={255}
              defaultValue={cabin?.titleEn || ""}
            />
            <TextAreaField
              label={`${labels.description} · EN`}
              name="descriptionEn"
              defaultValue={cabin?.descriptionEn || ""}
            />
          </details>
          <SelectField
            label={labels.region}
            name="regionId"
            defaultValue={cabin?.location.regionId}
            required
          >
            <option value="">{labels.region}</option>
            {refs.regions.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </SelectField>
          <div className="form-grid-two">
            <Field
              label={labels.city}
              name="city"
              maxLength={150}
              defaultValue={cabin?.location.city || ""}
            />
            <Field
              label={labels.village}
              name="village"
              maxLength={150}
              defaultValue={cabin?.location.village || ""}
            />
          </div>
          <Field
            label={labels.address}
            name="address"
            required
            maxLength={1000}
            defaultValue={cabin?.location.address}
          />
          {admin && <div className="form-grid-two">
            <Field label={admin.text.latitude} name="latitude" type="number" min={-90} max={90} step="0.0000001" defaultValue={cabin?.location.latitude?.toString() || ""} />
            <Field label={admin.text.longitude} name="longitude" type="number" min={-180} max={180} step="0.0000001" defaultValue={cabin?.location.longitude?.toString() || ""} />
          </div>}
          <div className="form-grid-two">
            <Field
              label={labels.price}
              name="price"
              type="number"
              min={1}
              max={1000000}
              step="0.01"
              required
              defaultValue={cabin?.pricePerNight.toString() || "5000"}
            />
            <Field
              label={labels.guests}
              name="maxGuests"
              type="number"
              min={1}
              max={50}
              required
              defaultValue={cabin?.maxGuests || 2}
            />
            <Field
              label={labels.bedrooms}
              name="bedrooms"
              type="number"
              min={0}
              max={30}
              required
              defaultValue={cabin?.bedrooms ?? 1}
            />
            <Field
              label={labels.beds}
              name="beds"
              type="number"
              min={1}
              max={50}
              required
              defaultValue={cabin?.beds || 1}
            />
            <Field
              label={labels.bathrooms}
              name="bathrooms"
              type="number"
              min={0}
              max={20}
              required
              defaultValue={cabin?.bathrooms ?? 1}
            />
          </div>
          <fieldset className="checkbox-list">
            <legend>{common.nav.amenities}</legend>
            {refs.amenities.map((row) => (
              <label key={row.id}>
                <PremiumCheckbox
                  type="checkbox"
                  name="amenities"
                  value={row.id}
                  defaultChecked={cabin?.amenities.some((item) => item.amenityId === row.id)}
                />
                {row.name}
              </label>
            ))}
          </fieldset>
          {admin && <fieldset className="checkbox-list"><legend>{admin.text.categories}</legend>{admin.categories.map(row => <label key={row.id}><PremiumCheckbox name="categories" value={row.id} defaultChecked={admin.selectedCategories.includes(row.id)} />{row.name}</label>)}</fieldset>}
          <div className="form-grid-two">
            <Field
              label={labels.checkIn}
              type="time"
              name="checkInTime"
              required
              defaultValue={cabin?.checkInTime || "14:00"}
            />
            <Field
              label={labels.checkOut}
              type="time"
              name="checkOutTime"
              required
              defaultValue={cabin?.checkOutTime || "11:00"}
            />
          </div>
          <Field
            label={labels.cancellationHours}
            name="cancellationHours"
            type="number"
            min={0}
            max={720}
            defaultValue={cabin?.cancellationHours ?? 48}
            required
          />
          <TextAreaField
            label={labels.houseRules}
            name="rules"
            defaultValue={cabin?.rules
              .filter((rule) => rule.isActive)
              .map((rule) => rule.title)
              .join("\n")}
          />
          <label className="checkbox-label">
            <PremiumCheckbox name="isDemo" defaultChecked={cabin?.isDemo} />
            {labels.demo}
          </label>
        </ActionForm>
      </section>
      <aside className="owner-editor-sidebar">
        <section className="product-panel">
          <h2>{labels.status}</h2>
          <StatusBadge status={cabin?.status || "DRAFT"} common={common} />
          <p className="form-hint">{labels.publishHint}</p>
          {admin && cabin && <>
            <AdminActionForm action={cabinAdminAction} locale={locale} common={common} text={admin.text} confirm>
              <input type="hidden" name="cabinId" value={String(cabin.id)} />
              <SelectField label={labels.status} name="status" defaultValue={cabin.status}>
                {["DRAFT", "PENDING", "PUBLISHED", "BLOCKED", "ARCHIVED"].map(value => <option key={value} value={value}>{common.statuses[value as keyof typeof common.statuses]}</option>)}
              </SelectField>
            </AdminActionForm>
            <p className="form-hint">{admin.text.deleteHint}</p>
            <AdminActionForm action={deleteCabinAdminAction} locale={locale} common={common} text={admin.text} submitLabel={admin.text.delete} confirm danger><input type="hidden" name="cabinId" value={String(cabin.id)} /></AdminActionForm>
          </>}
          {!admin && cabin && ["DRAFT", "PENDING", "ARCHIVED"].includes(cabin.status) && (
            <ActionForm
              action={submitCabinAction}
              locale={locale}
              common={common}
              submitLabel={labels.submitReview}
            >
              <input name="cabinId" value={cabin.id.toString()} type="hidden" />
            </ActionForm>
          )}
          {!admin && cabin && !["BLOCKED", "ARCHIVED"].includes(cabin.status) && (
            <ActionForm
              action={archiveCabinAction}
              locale={locale}
              common={common}
              submitLabel={labels.archive}
              className="product-form archive-action"
            >
              <input name="cabinId" value={cabin.id.toString()} type="hidden" />
            </ActionForm>
          )}
          {cabin?.status === "PUBLISHED" && (
            <Link className="text-link" href={`/${locale}/cabins/${cabin.slug}`}>
              {labels.details}
            </Link>
          )}
        </section>
        {cabin && (
          <>
            <section className="product-panel">
              <h2>{labels.photos}</h2>
              <PhotoUpload cabinId={cabin.id.toString()} common={common} />
              <div className="owner-gallery">
                {cabin.images.map((image) => (
                  <div key={image.id.toString()}>
                    <Image
                      src={image.imageUrl}
                      alt={image.altText || cabin.title}
                      width={240}
                      height={170}
                      unoptimized
                    />
                    <ActionForm
                      action={removePhotoAction}
                      locale={locale}
                      common={common}
                      submitLabel={labels.removePhoto}
                      className="compact-action"
                    >
                      <input name="imageId" value={image.id.toString()} type="hidden" />
                    </ActionForm>
                  </div>
                ))}
              </div>
            </section>
            {!admin && <section className="product-panel">
              <h2>{common.labels.availability}</h2>
              <p className="form-hint">{labels.calendarManageHint}</p>
              <ActionForm action={calendarAction} locale={locale} common={common}>
                <input name="cabinId" value={cabin.id.toString()} type="hidden" />
                <PremiumDatePicker locale={locale} startName="start" endName="end" required labels={{ checkIn: labels.checkIn, checkOut: labels.checkOut }} />
                <SelectField label={labels.status} name="mode">
                  <option value="BLOCKED">{labels.blockDates}</option>
                  <option value="AVAILABLE">{labels.openDates}</option>
                  <option value="clear">{labels.resetCalendar}</option>
                </SelectField>
                <Field
                  label={`${labels.calendarPrice} · ${labels.optional}`}
                  name="price"
                  type="number"
                  min={1}
                  max={1000000}
                  step="0.01"
                />
              </ActionForm>
            </section>}
            {admin && <Link className="admin-button" href={`/${locale}/admin/calendar?cabinId=${cabin.id}`}>{admin.text.calendar}</Link>}
          </>
        )}
      </aside>
    </div>
  );
}
