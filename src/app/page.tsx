import Chart from '@/components/chart';
import Link from 'next/link';

export default function Home() {
  const sampleToken = '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN';

  return (
    <div className='w-screen h-screen relative'>
      <Chart tokenAddress={sampleToken} fullScreen />

      {/* BitQuery Alternative Link */}
      <div className='absolute top-4 right-4 z-50'>
        <Link
          href={`/bitquery?token=${sampleToken}`}
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors'
        >
          BitQuery Chart
        </Link>
      </div>
    </div>
  );
}
