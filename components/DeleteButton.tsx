"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignedIn, useUser } from "@clerk/nextjs";
import { TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { DropdownMenuItem } from "./DropdownMenu";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";

export type DeleteButtonProps = {
  userId: string;
  id: string;
  type: "icon" | "button" | "dropdown";
};

export function DeleteButton(props: DeleteButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const deleteEvent = api.event.delete.useMutation({
    onError: () => {
      toast.error("Your event was not deleted. Please try again.");
    },
    onSuccess: () => {
      toast.success("Event deleted.");
      router.refresh();
      router.push(`/${user?.username}/events`);
    },
  });

  const roles = user?.unsafeMetadata.roles as string[] | undefined;
  const isOwner = user?.id === props.userId || roles?.includes("admin");

  if (!isOwner) {
    return null;
  }

  if (props.type === "icon") {
    return (
      <SignedIn>
        <Button size={"icon"} asChild>
          <Link href={`/event/${props.id}/edit`}>
            <TrashIcon className="size-6" />
          </Link>
        </Button>
      </SignedIn>
    );
  }

  return (
    <SignedIn>
      <DropdownMenuItem
        onSelect={() => {
          deleteEvent.mutate({ id: props.id });
        }}
        disabled={deleteEvent.isLoading}
        className="text-red-600"
      >
        <TrashIcon className="mr-2 size-4" />
        Delete
      </DropdownMenuItem>
    </SignedIn>
  );
}
