import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { History } from "lucide-react"

interface Version {
  id: string
  content: string
  createdAt: string
  authorName: string
}

interface ContentVersionProps {
  versions: Version[]
  onRestore: (version: Version) => void
}

export function ContentVersion({ versions, onRestore }: ContentVersionProps) {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5" />
        <h3 className="font-semibold">Version History</h3>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedVersion?.id === version.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-secondary"
              }`}
              onClick={() => setSelectedVersion(version)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{version.authorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(version.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestore(version)}
                >
                  Restore
                </Button>
              </div>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {version.content.substring(0, 150)}...
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}