import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/lib/auth";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProgressOverview } from "@/components/profile/progress-overview";
import { StudyHistory } from "@/components/profile/study-history";
import { BookmarkedContent } from "@/components/profile/bookmarked-content";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="history">Study History</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Name: {session.user.name}</p>
                  <p className="text-sm">Email: {session.user.email}</p>
                  <p className="text-sm">Member since: {new Date(session.user.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Study Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressOverview userId={session.user.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <StudyHistory userId={session.user.id} limit={5} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressOverview userId={session.user.id} detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Study History</CardTitle>
            </CardHeader>
            <CardContent>
              <StudyHistory userId={session.user.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarks">
          <Card>
            <CardHeader>
              <CardTitle>Bookmarked Content</CardTitle>
            </CardHeader>
            <CardContent>
              <BookmarkedContent userId={session.user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
