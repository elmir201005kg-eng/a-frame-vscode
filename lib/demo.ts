import "server-only";

// Evaluated on the server; the result reaches clients through ordinary page props.
export function demoModeEnabled() {
  return process.env.DEMO_MODE === "true" ||
    (process.env.DEMO_MODE !== "false" && process.env.NODE_ENV === "development");
}

export function isDemoBooking(booking: { bookingNumber: string; cabin?: { isDemo: boolean } }) {
  return booking.bookingNumber.startsWith("DEMO-") || booking.cabin?.isDemo === true;
}
