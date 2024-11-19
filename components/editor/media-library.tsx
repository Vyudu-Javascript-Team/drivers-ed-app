import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UploadButton } from "@/lib/uploadthing"
import { Grid, Image as ImageIcon, Search, Trash } from "lucide-react"

interface Media {
  id: string
  url: string
  name: string
  createdAt: string
}

interface MediaLibraryProps {
  onSelect: (url: string) => void
}

export function MediaLibrary({ onSelect }: MediaLibraryProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [search, setSearch] = useState("")
  const router = useRouter()

  const filteredMedia = media.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return

    try {
      await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      })
      setMedia(media.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Failed to delete media:", error)
    }
  }

  return (
    <Dialog>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <UploadButton
              endpoint="mediaUploader"
              onClientUploadComplete={(res) => {
                setMedia([
                  {
                    id: res[0].key,
                    url: res[0].url,
                    name: res[0].name,
                    createdAt: new Date().toISOString(),
                  },
                  ...media,
                ])
              }}
            />
          </div>

          <ScrollArea className="h-[500px]">
            <div className="grid grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square rounded-lg border bg-background"
                >
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onSelect(item.url)}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}