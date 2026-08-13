import ContactContainer from "@/features/support/contact/containers/ContactContainer";
import {
  ContactInfo,
  ContactStaticHeader,
} from "@/features/support/contact/components/ContactStaticHeader";

export default function ContactSupportPage() {
  return (
    <ContactContainer
      header={<ContactStaticHeader />}
      contactInfo={<ContactInfo />}
    />
  );
}
