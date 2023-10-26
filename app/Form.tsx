"use client";
import Link from "next/link";

export function Form({
  handleInputChange,
  handlePaste,
  input,
  isLoading,
  onSubmit,
}: {
  handleInputChange: (e: any) => void;
  handlePaste: (e: any) => Promise<void>;
  input: string;
  isLoading: boolean;
  onSubmit: (e: any) => void;
}) {
  return (
    <form className="max-w-xl w-full" onSubmit={onSubmit}>
      <div className="flex mt-10 items-center space-x-3">
        <p className="text-left font-medium">
          Paste event info{" "}
          <span className="text-slate-500">(or describe your event)</span>.
        </p>
      </div>
      <textarea
        onPaste={handlePaste}
        value={input}
        onChange={handleInputChange}
        rows={6}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
        placeholder={
          "Paste a description from a website, a text message from a friend, or anything else. Or you can describe your event."
        }
      />
      {!isLoading && (
        <>
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
            type="submit"
          >
            Generate your event &rarr;
          </button>
          <p className="text-center mt-4">
            <span className="text-slate-500">
              Or look at a sample{" "}
              <a
                href="/user_2X3xAXHdaKKG8RLZqm72wb119Yj/events/4"
                className="font-bold text-slate-900"
              >
                event
              </a>{" "}
              or{" "}
              <Link
                href="/user_2X9kPFHoj4O6EHsHDTHRsbxyS8X/events"
                className="font-bold text-slate-900"
              >
                list
              </Link>
              .
            </span>
          </p>
        </>
      )}
      {isLoading && (
        <>
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
            disabled
          >
            <span className="loading">
              <span style={{ backgroundColor: "white" }} />
              <span style={{ backgroundColor: "white" }} />
              <span style={{ backgroundColor: "white" }} />
            </span>
          </button>
          <div className="p-1"></div>
          <p className="text-center">
            <span className="text-slate-500">
              ⏳ Be patient, takes ~5 seconds/event.
            </span>
          </p>
        </>
      )}
    </form>
  );
}
