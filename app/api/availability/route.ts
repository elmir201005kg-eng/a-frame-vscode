import { NextResponse } from "next/server";
import { quoteStay } from "@/lib/booking";
import { id, InputError } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const quote = await quoteStay(
      id(params.get("cabinId")),
      params.get("checkIn") || "",
      params.get("checkOut") || "",
      Number(params.get("guests")),
    );
    return NextResponse.json(
      {
        available: true,
        nights: quote.range.nights,
        total: quote.total.toFixed(2),
        prices: quote.prices,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      { code: error instanceof InputError ? error.code : "serverError" },
      { status: error instanceof InputError ? 400 : 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
