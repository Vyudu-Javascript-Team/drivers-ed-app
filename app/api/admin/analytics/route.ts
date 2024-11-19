import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PaymentAnalytics } from '@/lib/payment/analytics';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email === process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get('period') || 'month') as 'day' | 'week' | 'month' | 'year';

    const [revenue, churn, failures] = await Promise.all([
      PaymentAnalytics.getRevenueMetrics(period),
      PaymentAnalytics.getChurnMetrics(period),
      PaymentAnalytics.getPaymentFailureAnalysis(period),
    ]);

    return NextResponse.json({
      revenue,
      churn,
      failures,
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}