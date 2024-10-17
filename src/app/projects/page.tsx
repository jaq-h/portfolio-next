import ProjectData from "../../../public/projects.json";
import Image from "next/image";
import Iframe from "app/components/media/Iframe";

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
    <div className="mx-auto px-2 sm:px-5 py-10 sm:max-w-screen-lg max-w-s">
      {
        ProjectData.projects && ProjectData.projects.map((project, index) => {
          return (
            <div key={index} className="sm:flex sm:justify-between inline mb-2 py-8  border-2 border-slate-500 rounded-md ">
              <div className="sm:w-1/2 w-full  lg:px-10 px-5 sm:my-0 mb-5">
                <h2 className="text-xl font-bold pb-2 ">
                  {project.title}
                </h2>
                <p>
                  {project.description}
                </p>
              </div>
              <div className="sm:w-1/2 w-full sm:grid sm:justify-items-end lg:px-10 px-5">
                {project.projectMedia.mediaType === "image" && (
                  <Image src={project.projectMedia.mediaSrc} width={100} height={100} alt="" />
                )}
                {project.projectMedia.mediaType === "video" && (
                  <Iframe src={project.projectMedia.mediaSrc} height={250} />
                )}
              </div>
            </div>
          )
        })
      }
    </div>
  );
}
