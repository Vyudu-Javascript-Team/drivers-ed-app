import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TestInterface } from "@/components/practice/test-interface";
import { getTestById } from "@/lib/test-service";

interface PracticeTestPageProps {
  params: {
    testId: string;
  };
}

export default async function PracticeTestPage({ params }: PracticeTestPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const test = await getTestById(params.testId);

  if (!test) {
    redirect("/practice");
  }

  return (
    <div className="container mx-auto py-6">
      <TestInterface 
        testId={params.testId}
        userId={session.user.id}
        initialTest={test}
      />
    </div>
  );
}
