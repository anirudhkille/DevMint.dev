"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Code, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { tools } from "@/config/site";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const searchItems = {
  tools: tools,
  theme: [
    { title: "Light", icon: Sun },
    { title: "Dark", icon: Moon },
    { title: "System", icon: Monitor },
  ],
};

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Tools">
          {searchItems.tools.map((item) => (
            <CommandItem
              key={item.href}
              value={item.title}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />

        <CommandSeparator />
        <CommandGroup heading="Theme">
          {searchItems.theme.map((item) => (
            <CommandItem
              key={item.title}
              value={item.title}
              onSelect={() => runCommand(() => setTheme(item.title.toLowerCase()))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
