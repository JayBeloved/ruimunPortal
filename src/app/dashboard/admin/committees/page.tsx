
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { generateCommitteeDescriptions } from "@/ai/flows/generate-committee-descriptions";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { committees } from "@/lib/data";

async function CommitteeCard({ committee }: { committee: (typeof committees)[0] }) {
  async function generateDescription(formData: FormData) {
    "use server";
    const topic = formData.get("topic") as string;
    const committeeName = formData.get("committeeName") as string;
    // In a real app, you would get the current description from a database
    const currentDescription = ""; 
    const result = await generateCommitteeDescriptions({ topic, committeeName, description: currentDescription });
    // Here you would update the description in your database
    console.log(result.description);
    // For the prototype, we'll just log it
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{committee.name}</CardTitle>
        <CardDescription>{committee.topic}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{committee.description}</p>
        <form action={generateDescription}>
          <input type="hidden" name="topic" value={committee.topic} />
          <input type="hidden" name="committeeName" value={committee.name} />
          <Button variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate New Description with AI
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminCommitteesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Committee Management</h2>
        <p className="text-muted-foreground">
          View and manage conference committees.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {committees.map(committee => (
          <CommitteeCard key={committee.id} committee={committee} />
        ))}
      </div>
    </div>
  );
}
