import Chart from "@/components/chart";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Chart tokenAddress={"6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"} fullScreen />
    </div>
  );
}
