"use server";
import { cookies } from "next/headers";
import type { MemberAuthenticationData } from "~/hooks/use-hosted-api";

export const setAuthCookies = async (authData: MemberAuthenticationData) => {
	const cookieStore = cookies();

	(await cookieStore).set("memberContext", authData.memberContext, {
		path: "/",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 8),
		sameSite: "none",
		secure: true,
	});
	(await cookieStore).set("memberId", authData.memberid, {
		path: "/",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 8),
		sameSite: "none",
		secure: true,
	});
	(await cookieStore).set("memberHash", authData.memberHash, {
		path: "/",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 8),
		sameSite: "none",
		secure: true,
	});
	(await cookieStore).set("companyName", authData.companyid, {
		path: "/",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 8),
		sameSite: "none",
		secure: true,
	});
};
