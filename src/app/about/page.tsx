import { getAboutContent } from "@/lib/content";
import { PageContainer, Card, Pill } from "@/app/components/ui";

// ISR revalidation time in seconds (must be static for Next.js)
export const revalidate = 60;

export default async function About() {
  const about = await getAboutContent();

  return (
    <PageContainer title={about.title}>
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
