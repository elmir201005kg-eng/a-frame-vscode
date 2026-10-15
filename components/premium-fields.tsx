"use client";

import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { PremiumSelect, type PremiumSelectProps } from "@/components/premium-select";
import { PremiumDateInput } from "@/components/premium-date-picker";

export type FieldFeedback = { hint?: string; error?: string };
export function PremiumInput({ className = "", error, ...props }: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return <input {...props} className={`premium-control premium-input ${className}`} aria-invalid={error || props["aria-invalid"] || undefined} />;
}
export function PremiumTextarea({ className = "", error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return <textarea {...props} className={`premium-control premium-textarea ${className}`} aria-invalid={error || props["aria-invalid"] || undefined} />;
}
export function PremiumCheckbox({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} type="checkbox" className={`premium-choice premium-checkbox ${className}`} />;
}
export function PremiumRadio({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} type="radio" className={`premium-choice premium-radio ${className}`} />;
}
export function Field({ label, hint, error, id: suppliedId, ...props }: InputHTMLAttributes<HTMLInputElement> & FieldFeedback & { label: string }) {
  const generated = useId(), id = suppliedId ?? generated;
  const described = [props["aria-describedby"], hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return <div className="product-field">
    <label htmlFor={id}>{label}</label>
    {props.type === "date"
      ? <PremiumDateInput {...props} id={id} label={label} aria-describedby={described} error={!!error} />
      : <PremiumInput {...props} id={id} aria-describedby={described} error={!!error} />}
    {hint && <small id={`${id}-hint`}>{hint}</small>}
    {error && <small id={`${id}-error`} className="premium-field-error" role="alert">{error}</small>}
  </div>;
}
export function SelectField({ label, hint, error, id: suppliedId, ...props }: Omit<PremiumSelectProps, "error"> & FieldFeedback & { label: string }) {
  const generated = useId(), id = suppliedId ?? generated;
  const described = [props["aria-describedby"], hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return <div className="product-field">
    <label htmlFor={id}>{label}</label>
    <PremiumSelect {...props} id={id} aria-describedby={described} error={!!error} />
    {hint && <small id={`${id}-hint`}>{hint}</small>}
    {error && <small id={`${id}-error`} className="premium-field-error" role="alert">{error}</small>}
  </div>;
}
export function TextAreaField({ label, hint, error, id: suppliedId, maxLength = 10000, rows = 5, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldFeedback & { label: string }) {
  const generated = useId(), id = suppliedId ?? generated;
  const described = [props["aria-describedby"], hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return <div className="product-field">
    <label htmlFor={id}>{label}</label>
    <PremiumTextarea {...props} id={id} rows={rows} maxLength={maxLength} error={!!error} aria-describedby={described} />
    {hint && <small id={`${id}-hint`}>{hint}</small>}
    {error && <small id={`${id}-error`} className="premium-field-error" role="alert">{error}</small>}
  </div>;
}
