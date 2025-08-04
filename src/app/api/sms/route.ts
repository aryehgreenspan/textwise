import { NextResponse } from "next/server";
import { addNoteToTicketByPhoneNumber } from "~/actions/add-note-to-ticket";

// The function MUST be named 'POST' in all caps.
export async function POST(request: Request) {
  const formData = await request.formData();
  const body = formData.get("Body") as string;
  const from = formData.get("From") as string;
  const to = formData.get("To") as string;

  if (!body || !from || !to) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await addNoteToTicketByPhoneNumber({ from, body, to });

    const twilioResponse = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
    return new Response(twilioResponse, {
      headers: { "Content-Type": "text/xml" },
    });

  } catch (error) {
    console.error("Error processing incoming SMS:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}