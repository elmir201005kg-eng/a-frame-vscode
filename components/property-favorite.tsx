"use client";
import { useSafeAction } from "@/components/use-safe-action";
import { PendingButton } from "@/components/pending-button";
import { favoriteAction } from "@/app/actions/traveler";
import { Icon } from "@/components/icon";
import type { CommonDictionary } from "@/app/i18n/platform";
import type { Locale } from "@/app/i18n/config";

export function PropertyFavorite({
  cabinId,
  active,
  locale,
  common,
  next,
}: {
  cabinId: string;
  active: boolean;
  locale: Locale;
  common: CommonDictionary;
  next: string;
}) {
  const [state, action, pending] = useSafeAction(favoriteAction, {});
  return (
    <form action={action} className="property-favorite" aria-busy={pending}>
      <input name="cabinId" value={cabinId} type="hidden" />
      <input name="locale" value={locale} type="hidden" />
      <input name="next" value={next} type="hidden" />
      <input name="active" value={active ? "0" : "1"} type="hidden" />
      <PendingButton
        className={`favorite-button${active ? " is-favorite" : ""}`}
        pending={pending}
        aria-pressed={active}
        aria-label={active ? common.labels.removeFavorite : common.labels.addFavorite}
        type="submit"
      >
        {!pending && <Icon name="heart" size={19} />}
      </PendingButton>
      {state.code && !pending && (
        <span className="favorite-error" role="alert">
          {common.errors[state.code as keyof typeof common.errors] || common.errors.serverError}
        </span>
      )}
    </form>
  );
}
