"use client";
import Chart from "@/components/chart";

export default function EmbedPage() {
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const token = searchParams.get('token') || "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN";

  return (
    <div className="w-screen h-screen">
      <Chart tokenAddress={token} fullScreen />
    </div>
  );
}


