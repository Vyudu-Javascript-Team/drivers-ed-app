import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { PracticeTest } from '@/components/practice-test';

interface PracticeTestPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Practice Test',
  description: 'Take a practice test to prepare for your driver\'s license exam.',
};

export default async function PracticeTestPage({ params }: PracticeTestPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/signin?callbackUrl=/practice/' + params.id);
  }

  const test = await db.test.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!test) {
    redirect('/practice');
  }

  return <PracticeTest test={test} />;
}