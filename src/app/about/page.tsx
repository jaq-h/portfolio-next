export default function About() {
  return (
    <div className="px-6 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">About Me</h1>

      <div className="space-y-6">
        <section className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Hello, I&apos;m Jacques Hebert
          </h2>
          <p className="text-gray-300 leading-relaxed">
            I&apos;m a software developer passionate about building modern web
            applications and exploring new technologies. I enjoy working with
            TypeScript, React, Rust, and creating tools that solve real
            problems.
          </p>
        </section>

        <section className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "TypeScript",
              "JavaScript",
              "React",
              "Next.js",
              "Rust",
              "Tauri",
              "Node.js",
              "PostgreSQL",
              "TailwindCSS",
              "Git",
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-slate-700 text-gray-200 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Feel free to reach out through GitHub or LinkedIn. I&apos;m always
            interested in collaborating on interesting projects or discussing
            new opportunities.
          </p>
        </section>
      </div>
    </div>
  );
}
