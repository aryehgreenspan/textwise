"use server";

import ConnectWise from "connectwise-rest";

if (
  !process.env.CW_COMPANY_URL ||
  !process.env.CW_CLIENT_ID ||
  !process.env.CW_PRIVATE_KEY
) {
  throw new Error("ConnectWise credentials are not set in environment variables.");
}

// The fix is here: we use 'new ConnectWise.default'
export const cw = new (ConnectWise as any).default({
  companyUrl: process.env.CW_COMPANY_URL,
  clientId: process.env.CW_CLIENT_ID,
  privateKey: process.env.CW_PRIVATE_KEY,
});

// Helper function for GET requests
export async function cwGet<T>(path: string): Promise<T> {
  const response = await cw.api(path, "GET");
  return response.data as T;
}

// Helper function for POST requests
export async function cwPost<T>(path:string, body: any): Promise<T> {
  const response = await cw.api(path, "POST", body);
  return response.data as T;
}