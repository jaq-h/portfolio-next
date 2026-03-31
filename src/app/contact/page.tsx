import { PageContainer } from "@/app/components/ui";
import { getContactContent, getMenuContent } from "@/lib/content/fetcher";
import ContactClient from "./ContactClient";

export default async function Contact() {
  const [contactContent, menuContent] = await Promise.all([
    getContactContent(),
    getMenuContent(),
  ]);
  const { pageHeader, sections } = contactContent;

  return (
    <PageContainer
      title={pageHeader.title}
      subtitle={pageHeader.subtitle}
      icon={pageHeader.icon}
    >
      <ContactClient
        sections={sections}
        externalLinks={menuContent.externalLinks}
      />
    </PageContainer>
  );
}
