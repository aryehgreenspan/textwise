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
  // Use the full E.164 number for the search
  const queryPath = `/company/communicationItems?conditions=value="${encodeURIComponent(from)}"`;

  console.log(`Searching for communication item with query: ${queryPath}`);

  // 1. Find the communication item matching the phone number
  const commItems = await cwGet<any[]>(queryPath);

  if (!commItems || commItems.length === 0) {
    throw new Error(`No communication item found for phone number ${from}`);
  }

  // Get the contact ID from the communication item we found
  const contactId = commItems[0]?.contact?.id;

  if (!contactId) {
    throw new Error(`Communication item found, but it is not linked to a contact.`);
  }

  console.log(`Found contact ID: ${contactId} from communication item.`);

  // 2. Find the most recent open ticket for that contact
  const tickets = await cwGet<any[]>(
    `/service/tickets?conditions=contact/id=${contactId} and closedFlag=false&orderBy=id desc`,
  );

  if (!tickets || tickets.length === 0) {
    throw new Error(`No open tickets found for contact ID ${contactId}`);
  }
  const ticketId = tickets[0]!.id;

  // 3. Add the incoming SMS as a note
  await cwPost(`/service/tickets/${ticketId}/notes`, {
    text: `--- Incoming SMS from ${from} ---\n${body}`,
    detailDescriptionFlag: true,
    internalAnalysisFlag: false,
    resolutionFlag: false,
  });

  console.log(`Successfully added note to ticket #${ticketId}`);
};