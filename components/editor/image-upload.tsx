"use client";

import { type Editor } from '@tiptap/react';
import { UploadButton } from "@/lib/uploadthing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface ImageUploadProps {
  editor: Editor;
}

export function ImageUpload({ editor }: ImageUploadProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Image className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            editor
              .chain()
              .focus()
              .setImage({ src: res[0].url })
              .run();
          }}
          onUploadError={(error: Error) => {
            console.error(error);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}