import ProjectData from "../../../public/projects.json";
import Image from "next/image";

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
    <div className="mx-auto px-2 sm:px-5 py-10 lg:max-w-screen-lg sm:max-w-screen-md max-w-s">
      {
        ProjectData.projects && ProjectData.projects.map((project, index) => {
          return (
            <div key={index} className="flex mb-2 py-8 px-5 border-2 border-slate-500 rounded-md ">
              <div className="w-1/2">
                <p>
                  {project.title}
                </p>
                <p>
                  {project.description}
                </p>
              </div>
              <div className="w-1/2 pl-10">
                {project.projectMedia.mediaType === "image" && (
                  <Image src={project.projectMedia.mediaSrc} width={100} height={100} alt="" />
                )}
                {project.projectMedia.mediaType === "video" && (
                  <iframe src={project.projectMedia.mediaSrc} width={100} height={100} />
                )}
              </div>

            </div>
          )
        })
      }
    </div>
  );
}
