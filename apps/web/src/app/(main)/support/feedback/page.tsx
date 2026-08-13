import FeedbackContainer from "@/features/support/feedback/containers/FeedbackContainer";
import FeedbackStaticHeader from "@/features/support/feedback/components/FeedbackStaticHeader";

export default function FeedbackSupportPage() {
  return <FeedbackContainer header={<FeedbackStaticHeader />} />;
}
