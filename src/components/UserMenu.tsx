"use client";
import { type User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDown } from "react-feather";
import { useState } from "react";
import Link from "next/link";

export default function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={() => setOpen(!open)}>
      <PopoverTrigger className="flex items-center gap-4">
        <Avatar>
          {user.image && <AvatarImage src={user.image} />}
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
        <div className="flex gap-1">
          <p className="text-sm">{user.name}</p>
          <ChevronDown
            className={`w-4 opacity-50 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="border-b border-gray-200 p-4">
          <p>{user.name}</p>
          <p className="text-sm font-light italic">
            {user.role === "admin" ? "Administrator" : "Protectora"}
          </p>
        </div>
        <div className="p-4">
          <Link href="/api/auth/signout" className="text-sm text-primary">
            Sign Out
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
