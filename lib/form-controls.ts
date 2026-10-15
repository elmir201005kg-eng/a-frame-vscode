/** Avoid moving focus away from an earlier invalid native field. */
export function isFirstInvalidControl(input: HTMLInputElement | null) {
  if (!input?.form) return true;
  const first = Array.from(input.form.elements).find(element =>
    (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) &&
    element.willValidate && !element.validity.valid,
  );
  return first === input;
}
