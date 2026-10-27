"use client";

import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";
import { X } from "lucide-react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative size-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        const uploadedFile = res[0];
        if (!uploadedFile) {
          console.error("Upload completed without returning a file.");
          return;
        }

        onChange(uploadedFile.ufsUrl || uploadedFile.url);
      }}
      onUploadError={(error: Error) => {
        console.error("File upload failed:", error);
      }}
    />
  );
};
