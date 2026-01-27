import { getAboutContent } from "@/lib/content";

// ISR revalidation time in seconds (must be static for Next.js)
export const revalidate = 60;

export default async function About() {
  const about = await getAboutContent();

  return (
    <div className="px-6 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">{about.title}</h1>

      <div className="space-y-6">
        <section className="bg-slate-800 border border-purple-950/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {about.intro.heading}
          </h2>
          <p className="text-gray-300 leading-relaxed">{about.intro.text}</p>
        </section>

        <section className="bg-slate-800 border border-purple-950/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {about.skills.heading}
          </h2>
          <div className="flex flex-wrap gap-2">
            {about.skills.items.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-slate-700 text-gray-200 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-slate-800 border border-purple-950/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {about.contact.heading}
          </h2>
          <p className="text-gray-300 leading-relaxed">{about.contact.text}</p>
        </section>
      </div>
    </div>
  );
}
