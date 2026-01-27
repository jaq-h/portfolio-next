"use client";

import { PageContainer, Card, Pill } from "@/app/components/ui";
import { useAboutContent } from "@/lib/content/provider";

export default function About() {
  const about = useAboutContent();
  const { pageHeader } = about;

  return (
    <PageContainer
      title={pageHeader.title}
      subtitle={pageHeader.subtitle}
      icon={pageHeader.icon}
    >
      <Card>
        <h2 className="text-xl font-bold text-white pb-1">
          {about.intro.heading}
        </h2>
        <p className="text-gray-300 leading-relaxed">{about.intro.text}</p>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-white pb-1">
          {about.skills.heading}
        </h2>
        <div className="flex flex-wrap gap-3 pt-4">
          {about.skills.items.map((skill) => (
            <Pill key={skill}>{skill}</Pill>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-white pb-1">
          {about.contact.heading}
        </h2>
        <p className="text-gray-300 leading-relaxed">{about.contact.text}</p>
      </Card>
    </PageContainer>
  );
}
