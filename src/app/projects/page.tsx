import ProjectData from "../../../public/projects.json";
import Image from "next/image";
import Iframe from "app/components/media/Iframe";
import Icon from "app/components/media/Icon";
import Link from "next/link";
import { Fragment } from "react";

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

export type TechPills = {
  name: string;
  icon: string;
}

export default function Projects() {
  return (
    <div className="mx-auto px-2 sm:px-5 py-10 sm:max-w-screen-lg max-w-s">
      {
        ProjectData.projects && ProjectData.projects.map((project, index) => {
          return (
            <div key={`project-${index}`} className="md:flex md:justify-between grid grid-cols-1 mb-10 py-8 bg-slate-800 border-2 border-slate-500 rounded-md ">
              <div className="md:w-1/2 w-full lg:px-7 px-5 md:my-0 mb-3">
                <div>
                  <h2 className="text-xl font-bold pb-1">
                    {project.title}
                  </h2>
                  <p>
                    {project.description}
                  </p>
                </div>
                <div className="pt-6 pb-3">
                  {project.projectLinks && project.projectLinks.map((link, index) => {
                    return (
                      <span className="pr-4" key={`project-link-${index}`}>
                        <Link className="p-2 bg-slate-900  hover:border-slate-400 border-2 border-slate-500 rounded-md" href={link.link}>
                          <Icon icon={link.icon} /> {link.title}
                        </Link>
                      </span>
                    );
                  })}
                </div>
                <div className="py-4">
                  <h3 className="pb-2" >Technology Used:</h3>
                  <ul>
                    {project.techStack && project.techStack.map((techPill, index) => {
                      return (
                        <li className="list-none inline-flex py-1 pr-5" key={`tech-pill-${index}`}>
                          {techPill.icon && (
                            <Icon icon={techPill.icon} />
                          )}
                          {techPill.name && (
                            techPill.name
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="md:w-1/2 w-full md:grid md:justify-items-end lg:px-7 px-5">
                {project.projectMedia.mediaType === "image" && (
                  <Image src={project.projectMedia.mediaSrc} width={100} height={100} alt="" />
                )}
                {project.projectMedia.mediaType === "video" && (
                  <Iframe src={project.projectMedia.mediaSrc} height={275} />
                )}
              </div>
            </div>
          );
        })
      }
    </div>
  );
}
