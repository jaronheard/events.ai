"use client";

import React from "react";
import { SignUpButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OnboardingContinueButton() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const saveIntent = searchParams.get("saveIntent") || "";
  const filePath = searchParams.get("filePath") || "";
  const signedInPath = saveIntent
    ? `/new?saveIntent=true&filePath=${filePath}`
    : `/${user?.username}/events`;
  const signedOutUrl = saveIntent
    ? `${process.env.NEXT_PUBLIC_URL}/new?saveIntent=true&filePath=${filePath}`
    : process.env.NEXT_PUBLIC_URL;

  return (
    <>
      <SignedOut>
        <SignUpButton
          afterSignInUrl={signedOutUrl}
          afterSignUpUrl={signedOutUrl}
        >
          <button className="hover:bg-black/80 mt-12 block w-full rounded-xl bg-black px-4 py-2 font-medium text-white sm:mt-16">
            Sign up &rarr;
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Link
          href={signedInPath}
          className="hover:bg-black/80 mt-12 block w-full rounded-xl bg-black px-4 py-2 text-center font-medium text-white sm:mt-16"
        >
          Continue &rarr;
        </Link>
      </SignedIn>
    </>
  );
}
