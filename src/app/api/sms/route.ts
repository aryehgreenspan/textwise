import { NextResponse } from "next/server";
import { addNoteToTicketByPhoneNumber } from "~/actions/add-note-to-ticket";

export async function POST(request: Request) {
  const formData = await request.formData();
  const body = formData.get("Body") as string;
  const from = formData.get("From") as string;
  const to = formData.get("To") as string;

  if (!body || !from || !to) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // This action will look up the contact by their phone number ('from')
    // and add the message body as a note to their most recent open ticket.
    await addNoteToTicketByPhoneNumber({ from, body, to });

    // Respond to Twilio to acknowledge receipt
    const twilioResponse = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
    return new Response(twilioResponse, {
      headers: { "Content-Type": "text/xml" },
    });

  } catch (error) {
    console.error("Error processing incoming SMS:", error);
    // Let Twilio know something went wrong, but don't reveal internal errors.
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}