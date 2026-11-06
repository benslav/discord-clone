// import React, { useEffect, useRef } from 'react';
// import data from '@emoji-mart/data';
// import { Picker } from 'emoji-mart';

// interface EmojiPickerProps {
//   onEmojiSelect: (emoji: any) => void;
//   theme?: 'light' | 'dark' | 'auto';
// }

// export function EmojiPicker({ onEmojiSelect, theme = 'auto' }: EmojiPickerProps) {
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const picker = new Picker({
//       data,
//       onEmojiSelect,
//       theme,
//     });

//     // Dynamically inject the web component into our wrapper container
//     if (ref.current) {
//       ref.current.innerHTML = '';
//       ref.current.appendChild(picker as unknown as Node);
//     }
//   }, [onEmojiSelect, theme]);

//   return <div ref={ref} />;
// }

"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { EmojiPicker } from "@/components/ui/emoji-picker";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiInput = ({
  onChange
}: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile 
          className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
        />
      </PopoverTrigger>
      <PopoverContent 
        side="right" 
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <EmojiPicker 
          colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
          onEmojiClick={(emojiData) => onChange(emojiData.emoji)} 
        />
      </PopoverContent>
    </Popover>
  )
}