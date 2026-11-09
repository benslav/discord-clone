"use client";

import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import { FileIcon, X } from "lucide-react";

interface FileUploadProps {
  onChange: (url?: string, fileType?: string) => void;
  value: string;
  fileType?: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, fileType, endpoint }: FileUploadProps) => {
  const currentFileType = fileType ?? value?.split(/[?#]/)[0].split(".").pop()?.toLowerCase();

  if (value && currentFileType !== "pdf") {
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

  if (value && currentFileType === "pdf") {
    return (
      <div className="relative mt-2 flex w-full min-w-0 max-w-full items-center rounded-md bg-background/10 p-2">
        <FileIcon className="h-10 w-10 shrink-0 fill-indigo-200 stroke-indigo-400"/>
        <a 
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 min-w-0 flex-1 break-all text-left text-sm text-indigo-500 hover:underline dark:text-indigo-400"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
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

        const fileType = uploadedFile.name.split(".").pop()?.toLowerCase();
        onChange(uploadedFile.ufsUrl || uploadedFile.url, fileType);
      }}
      onUploadError={(error: Error) => {
        console.error("File upload failed:", error);
      }}
    />
  );
};
