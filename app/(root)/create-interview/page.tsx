import InterviewSetupPage from "@/components/ui/InterviewInfoForm";
import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();
  return <InterviewSetupPage userId={user?.id} />;
};

export default page;
