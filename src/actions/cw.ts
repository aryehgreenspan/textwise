"use server";

const companyUrl = process.env.CW_COMPANY_URL!;
const clientId = process.env.CW_CLIENT_ID!;
const privateKey = process.env.CW_PRIVATE_KEY!;

// Create the authorization header required by the ConnectWise API
const credentials = `${clientId}+${privateKey}`;
const encodedCredentials = Buffer.from(credentials).toString("base64");
const headers = {
  Authorization: `Basic ${encodedCredentials}`,
  "Content-Type": "application/json",
  "X-CW-Integration-Version": "1.0",
  "X-CW-Integration-Description": "TextWise Pod",
};

// Our own custom helper for GET requests
export async function cwGet<T>(path: string): Promise<T> {
  const response = await fetch(`https://${companyUrl}/v4_6_release/apis/3.0${path}`, {
    method: "GET",
    headers,
  });
  if (!response.ok) {
    throw new Error(`ConnectWise API Error: ${response.status} ${response.statusText}`);
  }
  return response.json() as T;
}

// Our own custom helper for POST requests
export async function cwPost<T>(path: string, body: any): Promise<T> {
  const response = await fetch(`https://${companyUrl}/v4_6_release/apis/3.0${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`ConnectWise API Error: ${response.status} ${response.statusText}`);
  }
  return response.json() as T;
}