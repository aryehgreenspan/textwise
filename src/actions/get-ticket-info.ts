"use server";

// The broken import that was here has been removed.

import { cwGet } from "~/actions/cw";

export const getTicketInfo = async (ticketId: number) => {
  const ticket = await cwGet<any>(`/service/tickets/${ticketId}`);
  return ticket;
};