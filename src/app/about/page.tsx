import { getAboutContent } from "@/lib/content";

// ISR revalidation time in seconds (must be static for Next.js)
export const revalidate = 60;

export default async function About() {
  const about = await getAboutContent();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-white pl-7 mb-8">{about.title}</h1>

      <div className="space-y-8">
        <section className="bg-slate-800 border-2 border-purple-600/50 rounded-xl p-7">
          <h2 className="text-xl font-bold text-white pb-1">
            {about.intro.heading}
          </h2>
          <p className="text-gray-300 leading-relaxed">{about.intro.text}</p>
        </section>

        <section className="bg-slate-800 border-2 border-purple-600/50 rounded-xl p-7">
          <h2 className="text-xl font-bold text-white pb-1">
            {about.skills.heading}
          </h2>
          <div className="flex flex-wrap gap-3 pt-4">
            {about.skills.items.map((skill) => (
              <span
                key={skill}
                className="px-3 py-2 bg-slate-900 border-2 border-slate-600 text-gray-200 rounded-md text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-slate-800 border-2 border-purple-600/50 rounded-xl p-7">
          <h2 className="text-xl font-bold text-white pb-1">
            {about.contact.heading}
          </h2>
          <p className="text-gray-300 leading-relaxed">{about.contact.text}</p>
        </section>
      </div>
    </div>
  );
}
