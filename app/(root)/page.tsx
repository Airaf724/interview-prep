import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import {
  getCurrentUser,
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id),
    await getLatestInterviews({ userId: user?.id }),
  ]);

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;
  const feedback = await getFeedbackByInterviewId({
    interviewId: "UUx2bLj21PM9WDkUPqem",
    userId: "2JnH8CXjOYdyOSky68UXXDBtoYG2",
  });

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview Ready With AI Powered Practice And Feedbacks</h2>
          <p className="text-lg">
            Practice on Real Interview Questions on Required Domain
          </p>

          <Button asChild className="btn-primary  max-sm:w-full">
            <Link href="/create-interview">Start an Interview</Link>
          </Button>
        </div>
        <Image alt="robot.png" src="/robot.png" width={400} height={400} />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <>
              <p>You haven&apos;t taken an interview yet</p>
            </>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>take an interview</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <>
              <p>There are no interviews avilable</p>
            </>
          )}{" "}
        </div>
      </section>
    </>
  );
};

export default page;
