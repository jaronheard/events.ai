import { Message } from "ai";
import { trackGoal } from "fathom-client";
import ICAL from "ical.js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const SAMPLE_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
DTSTART;TZID=PDT:20231004T191500
DTEND;TZID=PDT:20231004T204500
RRULE:FREQ=WEEKLY;COUNT=5
SUMMARY:Yoga Foundations Workshop at People's Yoga
END:VEVENT
END:VCALENDAR
` as string;

type ICSJson = {
  startDate: string;
  endDate: string;
  summary: string;
  location: string;
  details: string;
  rrule: { freq?: string; count?: number };
  timezone?: string;
};

export function convertIcsToJson(icsData: any) {
  // Initialize an array to hold the events
  const events: ICSJson[] = [];

  try {
    // Parse the .ics data
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);

    // Iterate over each event component
    comp.getAllSubcomponents("vevent").forEach((vevent: any) => {
      const event = new ICAL.Event(vevent);

      // Extract data from the event
      const summary = event.summary;
      const location = event.location || undefined;
      const startDate = event.startDate.toString();
      const endDate = event.endDate.toString();
      const details = event.description || undefined;
      const rrule = event.component.getFirstPropertyValue("rrule");
      const timezone = event.startDate.timezone;

      // Create a JSON object for the event and add it to the array
      events.push({
        summary,
        location,
        startDate,
        endDate,
        details,
        rrule,
        timezone,
      });
    });
  } catch (e) {
    console.error(e);
  }

  // You can now work with this JSON object or stringify it
  return events;
}

export function icsJsonToAddToCalendarButtonProps(icsJson: ICSJson) {
  const input = icsJson;
  const { summary, location } = icsJson;
  const description = icsJson.details;
  const startDate = input.startDate.split("T")[0];
  const startTime = input.startDate.split("T")[1].substring(0, 5);
  const endDate = input.endDate.split("T")[0];
  const endTime = input.endDate.split("T")[1].substring(0, 5);
  const timeZone = input.timezone;
  const rrule = input.rrule;

  return {
    options: [
      "Apple",
      "Google",
      "iCal",
      "Microsoft365",
      "MicrosoftTeams",
      "Outlook.com",
      "Yahoo",
    ] as
      | (
          | "Apple"
          | "Google"
          | "iCal"
          | "Microsoft365"
          | "MicrosoftTeams"
          | "Outlook.com"
          | "Yahoo"
        )[]
      | undefined,
    buttonStyle: "text" as const,
    name: summary,
    description: description,
    location: location,
    startDate: startDate,
    endDate: endDate,
    startTime: startTime,
    endTime: endTime,
    timeZone: timeZone,
    recurrence: rrule?.freq || undefined,
    recurrence_count: rrule?.count || undefined,
  };
}

export function generatedIcsArrayToEvents(input: string) {
  try {
    const events = convertIcsToJson(input);
    // to calendar button props
    const addToCalendarButtonPropsArray = events.map((event) =>
      icsJsonToAddToCalendarButtonProps(event)
    );
    return addToCalendarButtonPropsArray;
  } catch (e) {
    console.log(e);
    return [];
  }
}

function encodeAsMarkdownCodeBlock(object: any, stringify = true): string {
  return (
    "```\n" + (stringify ? JSON.stringify(object, null, 2) : object) + "\n```"
  );
}

export function generateIssueDescription(
  input: string,
  lastAssistantMessage: string,
  ICSJson: ICSJson[],
  addToCalendarButtonPropsArray: any
) {
  return `## Input
${encodeAsMarkdownCodeBlock(input, false)}
### Generated by ChatGPT
${encodeAsMarkdownCodeBlock(lastAssistantMessage, false)}
### ICSJson
${encodeAsMarkdownCodeBlock(ICSJson)}
### AddToCalendarButtonProps
${encodeAsMarkdownCodeBlock(addToCalendarButtonPropsArray)}
`;
}
export function generateIssueTitle(input: string) {
  return `🐛: ${input.substring(0, 20)}...`;
}

type DateInfo = {
  month: number;
  day: number;
  year: number;
  dayOfWeek: string;
  monthName: string;
  hour: number;
  minute: number;
};

export function getDateInfo(dateString: string): DateInfo | null {
  // Validate input
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) {
    console.error("Invalid date format. Use YYYY-MM-DD.");
    return null;
  }

  // Create a Date object
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date.");
    return null;
  }

  // Get month, day, and year
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();

  // Get day of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "Jul",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[date.getMonth()];

  return { month, monthName, day, year, dayOfWeek, hour, minute };
}
export function getDateInfoUTC(dateString: string): DateInfo | null {
  // Validate input
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) {
    console.error("Invalid date format. Use YYYY-MM-DD.");
    return null;
  }

  // Create a Date object in UTC
  const date = new Date(`${dateString}T00:00:00Z`);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date.");
    return null;
  }

  // Get month, day, and year
  const month = date.getUTCMonth() + 1; // Months are zero-based
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();

  // Get day of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getUTCDay()];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "Jul",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[date.getUTCMonth()];

  return { month, monthName, day, year, dayOfWeek, hour, minute };
}

export function endsNextDayBeforeMorning(
  startDateInfo: DateInfo | null,
  endDateInfo: DateInfo | null
) {
  if (!startDateInfo || !endDateInfo) {
    return false;
  }
  const isNextDay =
    (startDateInfo.month === endDateInfo.month &&
      startDateInfo.day === endDateInfo.day - 1) ||
    (startDateInfo.month !== endDateInfo.month && endDateInfo.day === 1); //TODO: this is a hack
  const isBeforeMorning = endDateInfo.hour < 6;
  return isNextDay && isBeforeMorning;
}

export function spansMultipleDays(
  startDateInfo: DateInfo | null,
  endDateInfo: DateInfo | null
) {
  if (!startDateInfo || !endDateInfo) {
    return false;
  }
  const notSameDay = startDateInfo.day !== endDateInfo.day;
  return notSameDay;
}

export function showMultipleDays(
  startDateInfo: DateInfo | null,
  endDateInfo: DateInfo | null
) {
  if (!startDateInfo || !endDateInfo) {
    return false;
  }
  return (
    spansMultipleDays(startDateInfo, endDateInfo) &&
    !endsNextDayBeforeMorning(startDateInfo, endDateInfo)
  );
}

export const translateToHtml = (input: string): string => {
  let html = input;

  // Replace line breaks with <br>
  html = html.replace(/\[br\]/g, "<br />");

  // Replace paragraphs
  html = html.replace(/\[p\](.*?)\[\/p\]/g, "<p>$1</p>");

  // Replace strong tags
  html = html.replace(/\[strong\](.*?)\[\/strong\]/g, "<strong>$1</strong>");

  // Replace underline
  html = html.replace(/\[u\](.*?)\[\/u\]/g, "<u>$1</u>");

  // Replace italic and emphasis
  html = html.replace(/\[(i|em)\](.*?)\[\/(i|em)\]/g, "<i>$2</i>");

  // Replace unordered and ordered lists
  html = html.replace(/\[ul\](.*?)\[\/ul\]/gs, "<ul>$1</ul>");
  html = html.replace(/\[ol\](.*?)\[\/ol\]/gs, "<ol>$1</ol>");
  html = html.replace(/\[li\](.*?)\[\/li\]/g, "<li>$1</li>");

  // Replace headers h1, h2, h3, ...
  html = html.replace(/\[h(\d)\](.*?)\[\/h\1\]/g, "<h$1>$2</h$1>");

  // Replace [hr] with <hr />
  html = html.replace(/\[hr\]/g, "<hr />");

  // Replace URLs with rel="noopener noreferrer" for security and style="text-decoration: underline;" for underline
  html = html.replace(
    /\[url\](.*?)\|(.*?)\[\/url\]/g,
    '<a href="$1" rel="noopener noreferrer" style="text-decoration: underline;">$2</a>'
  );
  html = html.replace(
    /\[url\](.*?)\[\/url\]/g,
    '<a href="$1" rel="noopener noreferrer" style="text-decoration: underline;">$1</a>'
  );

  return html;
};

export const reportIssue = async (
  title: string,
  description: string,
  setStatus: (status: Status) => void
) => {
  setStatus("submitting");
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
    setStatus("success");
  } else {
    console.log("Error creating issue:", data);
    setStatus("error");
  }
};

export type Status = "idle" | "submitting" | "success" | "error";

export const getLastMessages = (messages: Message[]) => {
  console.log("messages", messages);
  const userMessages = messages.filter((message) => message.role === "user");
  const assistantMessages = messages.filter(
    (message) => message.role === "assistant"
  );

  const lastUserMessage =
    userMessages?.[userMessages.length - 1]?.content || "";
  // const lastAssistantMessage =
  //   assistantMessages?.[userMessages.length - 1]?.content || null;
  const lastAssistantMessage =
    assistantMessages?.[userMessages.length - 1]?.content || "";

  return { lastUserMessage, lastAssistantMessage };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
