import ProjectData from "../../../public/projects.json";

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
    <div className="mx-auto sm:px10  px-20 py-10 lg:max-w-screen-lg sm:max-w-screen-sm max-w-s">
      {
        ProjectData.projects && ProjectData.projects.map((project, index) => {
          return (
            <div key={index} className="py-10">
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
