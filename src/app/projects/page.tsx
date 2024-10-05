import ProjectData from "/Users/jaq/dev/portfolio-next/public/projects.json";

type Project = {
  title: string;
  description: string;
  projectLinks: Array<ProjectLinkButton>;
  techStack: Array<TechPills>
}

type ProjectMedia = {
  mediaType: ["video", "image"];
  mediaSrc: string;
}

type ProjectLinkButton = {
  title: string;
  icon: string;
  link: string;
}

type TechPills = {
  name: string;
  icon: string;
}

export default function Projects() {
  return (
    <div className=" grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {
        ProjectData.projects && ProjectData.projects.map((project) => {
          return (
            <div>
              <div>
                {project.title}
              </div>
              <div>
                {project.description}
              </div>
            </div>

          )
        })
      }
    </div>
  );
}
