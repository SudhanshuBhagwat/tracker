import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import Spinner from "../components/Spinner";
import useFirestore from "../hooks/useFirestore";

const Feedback: NextPage = () => {
  const router = useRouter();
  const { submitFeedback } = useFirestore();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (titleRef.current?.value && descriptionRef.current?.value) {
      try {
        setSubmitting(true);
        await submitFeedback({
          title: titleRef.current?.value,
          description: descriptionRef.current?.value,
        });
        setTimeout(() => {
          setSubmitting(false);
          router.push("/");
        }, 2000);
      } catch (e) {
        setSubmitting(false);
        console.error(e);
      }
    }
  }

  return (
    <div className="p-4 sm:p-0 h-full w-full flex-1">
      <div className="md:grid md:grid-cols-1 lg:grid-cols-2 h-full w-full">
        <div className="h-full flex flex-col justify-between">
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => router.back()}>
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-semibold">Feedback</h2>
            </div>
            <form
              onSubmit={handleSubmit}
              className="h-full flex flex-col justify-between"
            >
              <div className="flex flex-col space-y-4">
                <label htmlFor="feedback-title" className="text-lg font-medium">
                  Title
                  <input
                    ref={titleRef}
                    type="text"
                    className="w-full rounded-md mt-1 border-gray-400 placeholder:text-gray-400"
                    placeholder="Please enter a title for you feedback"
                  />
                </label>
                <label
                  htmlFor="feedback-description"
                  className="text-lg font-medium"
                >
                  Description
                  <textarea
                    ref={descriptionRef}
                    className="w-full h-40 rounded-md mt-1 border-gray-400 placeholder:text-gray-400"
                    placeholder="Please enter a title for you feedback"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-md bg-red-500 text-white font-semibold"
              >
                {submitting ? <Spinner /> : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
