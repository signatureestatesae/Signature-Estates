import Link from "next/link";

export default function AgentNotFound() {
  return (
    <div className="mx-auto flex max-w-[100rem] flex-col items-center px-5 py-24 text-center lg:px-8">
      <h1 className="font-display text-h1 font-semibold text-ink-900">Agent not found</h1>
      <p className="mt-3 max-w-sm text-sm text-[#6b7280]">
        We couldn&apos;t find the advisor you&apos;re looking for. They may have
        moved on, or the link may be out of date.
      </p>
      <Link
        href="/agents"
        className="mt-6 inline-flex items-center justify-center rounded-sm bg-ink-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950"
      >
        Back to Agents
      </Link>
    </div>
  );
}
