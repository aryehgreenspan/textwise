"use server";

import { ConnectWise } from "connectwise-rest";

// This checks if the required environment variables are set.
if (
  !process.env.CW_COMPANY_URL ||
  !process.env.CW_CLIENT_ID ||
  !process.env.CW_PRIVATE_KEY
) {
  throw new Error("ConnectWise credentials are not set in environment variables.");
}

// This initializes the ConnectWise client with your credentials.
// It is the 'cw' object that other files need to import.
export const cw = new ConnectWise({
  companyUrl: process.env.CW_COMPANY_URL,
  clientId: process.env.CW_CLIENT_ID,
  privateKey: process.env.CW_PRIVATE_KEY,
});

// This is a helper function for making generic API GET requests.
export async function cwGet<T>(path: string): Promise<T> {
  const response = await cw.api(path, "GET");
  return response.data as T;
}