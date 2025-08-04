"use server";

import { cw, cwGet } from "~/actions/cw";
import type { Ticket } from "connectwise-rest/dist/Manage/ServiceAPI";

// Main function that will be called by the webhook
export const addNoteToTicketByPhoneNumber = async ({
  from,
  body,
}: {
  from: string;
  body: string;
  to: string; // The Twilio number, can be used for logging if needed
}) => {
  // 1. Find the ConnectWise contact by their phone number
  const contacts = await cwGet<any[]>(
    `/company/contacts?conditions=communicationItems/value contains "${from}"`,
  );

  if (!contacts || contacts.length === 0) {
    throw new Error(`No contact found with phone number ${from}`);
  }

  // Use the first contact found
  const contactId = contacts[0].id;

  // 2. Find the most recent open ticket for that contact
  const tickets = await cwGet<Ticket[]>(
    `/service/tickets?conditions=contact/id=${contactId} and closedFlag=false&orderBy=id desc`,
  );

  if (!tickets || tickets.length === 0) {
    throw new Error(`No open tickets found for contact ID ${contactId}`);
  }

  // Use the most recent ticket
  const ticketId = tickets[0].id;
  const ticketSummary = tickets[0].summary;

  console.log(`Found ticket #${ticketId} ("${ticketSummary}") for contact ${contactId}`);

  // 3. Add the incoming SMS as a note to that ticket
  await cw.ServiceTicketNotes.createTicketNote(ticketId, {
    text: `--- Incoming SMS from ${from} ---\n${body}`,
    detailDescriptionFlag: true, // Makes it an internal note
    internalAnalysisFlag: false,
    resolutionFlag: false,
  });

  console.log(`Successfully added note to ticket #${ticketId}`);
};