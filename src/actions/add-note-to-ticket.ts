"use server";

import { cwGet, cwPost } from "~/actions/cw";

export const addNoteToTicketByPhoneNumber = async ({
  from,
  body,
}: {
  from: string;
  body: string;
  to: string;
}) => {
  // 1. Find the ConnectWise contact by their phone number
  // The 'from' variable is now URL encoded to handle special characters like '+'
  const contacts = await cwGet<any[]>(
    `/company/contacts?conditions=communicationItems/value contains "${encodeURIComponent(from)}"`,
  );

  if (!contacts || contacts.length === 0) {
    throw new Error(`No contact found with phone number ${from}`);
  }
  const contactId = contacts[0]!.id;

  // 2. Find the most recent open ticket for that contact
  const tickets = await cwGet<any[]>(
    `/service/tickets?conditions=contact/id=${contactId} and closedFlag=false&orderBy=id desc`,
  );

  if (!tickets || tickets.length === 0) {
    throw new Error(`No open tickets found for contact ID ${contactId}`);
  }
  const ticketId = tickets[0]!.id;

  // 3. Add the incoming SMS as a note using our custom cwPost function
  await cwPost(`/service/tickets/${ticketId}/notes`, {
    text: `--- Incoming SMS from ${from} ---\n${body}`,
    detailDescriptionFlag: true,
    internalAnalysisFlag: false,
    resolutionFlag: false,
  });

  console.log(`Successfully added note to ticket #${ticketId}`);
};