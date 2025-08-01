import { ComponentGrid } from "~/components/component-grid";

export default function PodPage({ searchParams }: { searchParams: any }) {
  if (
    !searchParams.id ||
    !searchParams.screen ||
    !Number.parseInt(searchParams.id as string)
  ) {
    throw new Error("Please open this pod within a ConnectWise ticket.");
  }

  return <ComponentGrid ticketId={Number.parseInt(searchParams.id as string)} />;
}