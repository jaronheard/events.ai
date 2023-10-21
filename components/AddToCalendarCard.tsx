"use client";

import React, { useState } from "react";
import {
  AddToCalendarButton,
  AddToCalendarButtonType,
} from "add-to-calendar-button-react";
import { SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import clsx from "clsx";

function SaveButton(props: AddToCalendarButtonType) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onClick() {
    setIsLoading(true);

    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: props,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("Your event was not saved. Please try again.");
    }

    const event = await response.json();

    // This forces a cache invalidation.
    router.refresh();

    router.push(`/events`);
  }

  return (
    <SignedIn>
      <button
        className={clsx(
          "bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full",
          {
            "cursor-not-allowed opacity-60": isLoading,
          }
        )}
        onClick={onClick}
      >
        {isLoading ? (
          <span className="loading">
            <span style={{ backgroundColor: "white" }} />
            <span style={{ backgroundColor: "white" }} />
            <span style={{ backgroundColor: "white" }} />
          </span>
        ) : (
          "Save"
        )}
      </button>
    </SignedIn>
  );
}

type AddToCalendarCardProps = AddToCalendarButtonType & {
  onClick: any;
  setAddToCalendarButtonProps: (props: AddToCalendarButtonType) => void;
};

export function AddToCalendarCard({
  setAddToCalendarButtonProps: setAddToCalendarButtonProps,
  ...initialProps
}: AddToCalendarCardProps) {
  const [name, setName] = useState(initialProps.name);
  const [location, setLocation] = useState(initialProps.location);
  const [description, setDescription] = useState(initialProps.description);
  const [startDate, setStartDate] = useState(initialProps.startDate);
  const [startTime, setStartTime] = useState(initialProps.startTime);
  const [endDate, setEndDate] = useState(initialProps.endDate);
  const [endTime, setEndTime] = useState(initialProps.endTime);
  const [link, setLink] = useState("");

  const updatedProps = {
    ...initialProps,
    name,
    location,
    description: link
      ? description + "\n\n" + `[url]${link}|Source[/url]`
      : description,
    startDate,
    startTime,
    endDate,
    endTime,
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border max-w-lg mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div
        className="col-span-full flex justify-center"
        onClick={initialProps?.onClick}
      >
        <AddToCalendarButton {...updatedProps} />
      </div>
      <div className="col-span-full">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Event
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              name="name"
              id="name"
              className="block text-lg font-bold flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="col-span-full">
        <label
          htmlFor="startDate"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="time"
          name="startTime"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div className="col-span-full">
        <label
          htmlFor="endDate"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          End Date
        </label>
        <input
          type="date"
          name="endDate"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="time"
          name="endTime"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div className="col-span-full">
        <label
          htmlFor="location"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Location
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              name="location"
              id="location"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="col-span-full">
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Description
        </label>
        <div className="mt-2">
          <textarea
            id="description"
            name="description"
            rows={4}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="col-span-full">
        <label
          htmlFor="location"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Source Link (optional)
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="url"
              name="link"
              id="link"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        </div>
        <SaveButton {...updatedProps} />
      </div>
    </div>
  );
}
