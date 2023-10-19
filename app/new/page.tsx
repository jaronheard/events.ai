"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { trackGoal } from "fathom-client";
import { AddToCalendarCard } from "../../components/AddToCalendarCard";
import {
  convertIcsToJson,
  generateIssueTitle,
  generateIssueDescription,
  generatedIcsArrayToEvents,
} from "../../utils/utils";
import { useSearchParams } from "next/navigation";

type Status = "idle" | "submitting" | "submitted" | "error";

function Output({
  events,
  finished,
  isDev,
  issueStatus,
  lastAssistantMessage,
  lastUserMessage,
  reportIssue,
  setEvents,
  setTrackedAddToCalendarGoal,
  trackedAddToCalendarGoal,
}: {
  events: AddToCalendarButtonType[] | null;
  finished: boolean;
  isDev: boolean;
  issueStatus: Status;
  lastAssistantMessage: string;
  lastUserMessage: string;
  reportIssue: (title: string, description: string) => Promise<void>;
  setEvents: (events: AddToCalendarButtonType[] | null) => void;
  setTrackedAddToCalendarGoal: (trackedAddToCalendarGoal: boolean) => void;
  trackedAddToCalendarGoal: boolean;
}) {
  return (
    <output className="space-y-10 my-10">
      {finished && (
        <>
          <div className="flex justify-center gap-4 flex-wrap">
            {events?.map((props, index) => (
              <AddToCalendarCard
                {...props}
                key={props.name}
                onClick={() => {
                  !trackedAddToCalendarGoal && trackGoal("BQ3VFDBF", 1);
                  setTrackedAddToCalendarGoal(true);
                }}
                setAddToCalendarButtonProps={(props) => {
                  const newArray = [...events];
                  newArray[index] = props;
                  setEvents(newArray);
                }}
              />
            ))}
          </div>
          {issueStatus === "submitting" && (
            <button
              className="bg-red-700 z-50 rounded-xl text-white font-medium px-4 py-2 w-40 fixed bottom-5 right-3"
              disabled
            >
              <span className="loading">
                <span style={{ backgroundColor: "white" }} />
                <span style={{ backgroundColor: "white" }} />
                <span style={{ backgroundColor: "white" }} />
              </span>
            </button>
          )}
          {issueStatus === "idle" && (
            <button
              className="bg-red-700 z-50 rounded-xl text-white font-medium px-4 py-2 hover:bg-red-800 w-40 fixed bottom-5 right-3"
              onClick={() =>
                reportIssue(
                  generateIssueTitle(lastUserMessage),
                  generateIssueDescription(
                    lastUserMessage,
                    lastAssistantMessage,
                    convertIcsToJson(lastAssistantMessage),
                    events
                  )
                )
              }
            >
              Report issue &rarr;
            </button>
          )}
          {issueStatus === "submitted" && (
            <button
              className="bg-red-700 z-50 rounded-xl text-white font-medium px-4 py-2 w-40 fixed bottom-5 right-3"
              disabled
            >
              ✔︎ Reported
            </button>
          )}
          {isDev && (
            <>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border">
                  <p>Prompt</p>
                  <p>{lastUserMessage}</p>
                </div>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border"
                  key={lastAssistantMessage}
                >
                  <p>Generated by ChatGPT</p>
                  <code>{lastAssistantMessage}</code>
                </div>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border">
                  <p>ICSJson</p>
                  <code>
                    {JSON.stringify(
                      convertIcsToJson(lastAssistantMessage),
                      null,
                      2
                    )}
                  </code>
                </div>
              </div>
              {events?.map((props) => (
                <div
                  className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto"
                  key={`code-${props.name}`}
                >
                  <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border">
                    <p>AddToCalendarButtonProps</p>
                    <code>{JSON.stringify(props, null, 2)}</code>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </output>
  );
}

export default function Page() {
  const [issueStatus, setIssueStatus] = useState<Status>("idle");
  const [events, setEvents] = useState<AddToCalendarButtonType[] | null>(null);
  const [trackedAddToCalendarGoal, setTrackedAddToCalendarGoal] =
    useState(false);
  const searchParams = useSearchParams();

  const finished = searchParams.has("message");
  const lastAssistantMessage = searchParams.get("message") || "";

  // set events when changing from not finished to finished
  useEffect(() => {
    if (finished) {
      const events = generatedIcsArrayToEvents(lastAssistantMessage);
      setEvents(events);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const reportIssue = async (title: string, description: string) => {
    setIssueStatus("submitting");
    const response = await fetch("/api/bug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (data.issue.success) {
      trackGoal("B2ZT84YS", 0);
      console.log("Successfully created issue:", data.issue);
      setIssueStatus("submitted");
    } else {
      console.log("Error creating issue:", data);
      setIssueStatus("error");
    }
  };

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900 text-center">
          Text +18332822877, get calendar events.
        </h1>
        <p className="text-slate-500 mt-5">1,312 events generated so far.</p>
        <Output
          events={events}
          finished={finished}
          isDev={isDev}
          issueStatus={issueStatus}
          lastAssistantMessage={lastAssistantMessage}
          lastUserMessage={"Generated from text message"}
          reportIssue={reportIssue}
          setEvents={setEvents}
          setTrackedAddToCalendarGoal={setTrackedAddToCalendarGoal}
          trackedAddToCalendarGoal={trackedAddToCalendarGoal}
        />
      </main>
      <Footer />
    </div>
  );
}
