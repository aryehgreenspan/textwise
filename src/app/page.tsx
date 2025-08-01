import { ComponentGrid } from "~/components/component-grid";

// The props are now typed to accept 'any' for the problematic searchParams
export default function Home({ searchParams }: { searchParams: any }) {
  if (
    !searchParams.id ||
    !searchParams.screen ||
    !Number.parseInt(searchParams.id as string)
  ) {
    throw new Error("Please open this pod within a ConnectWise ticket.");
  }

  return <ComponentGrid ticketId={Number.parseInt(searchParams.id as string)} />;
}