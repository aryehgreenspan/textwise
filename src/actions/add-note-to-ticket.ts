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
  // Let's create a version of the phone number without the country code for testing
  // e.g., '+15551234567' becomes '5551234567'
  const plainPhoneNumber = from.startsWith('+1') ? from.substring(2) : from;

  const queryPath = `/company/contacts?conditions=communicationItems/value="${plainPhoneNumber}"`;

  // Log the exact query we are about to send
  console.log(`Searching for contact with query: ${queryPath}`);
  
  // 1. Find the ConnectWise contact by their phone number using an EXACT match
  const contacts = await cwGet<any[]>(queryPath);

  if (!contacts || contacts.length === 0) {
    throw new Error(`No contact found with phone number ${from} (searched for ${plainPhoneNumber})`);
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