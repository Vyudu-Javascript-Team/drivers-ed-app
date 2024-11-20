import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTestSubmission } from "@/lib/test-service";
import { TestResults } from "@/components/practice/test-results";

interface TestResultsPageProps {
  params: {
    testId: string;
  };
  searchParams: {
    submissionId: string;
  };
}

export default async function TestResultsPage({
  params,
  searchParams,
}: TestResultsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const submission = await getTestSubmission(searchParams.submissionId);

  if (!submission || submission.userId !== session.user.id) {
    redirect("/practice");
  }

  return (
    <div className="container mx-auto py-6">
      <TestResults
        testId={params.testId}
        submission={submission}
      />
    </div>
  );
}
