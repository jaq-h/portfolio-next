"use client";

import Image from "next/image";
import Link from "next/link";
import Iframe from "@/app/components/media/Iframe";
import Icon from "@/app/components/media/Icon";
import { useProjects } from "@/lib/content/provider";

export type TechPills = {
  name: string;
  icon: string;
};

export default function Projects() {
  // Get projects from React Context (fetched server-side in layout)
  const projects = useProjects();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-white pl-7 mb-8">
        Technical Projects
      </h1>
      <div className="space-y-8">
        {projects &&
          projects.map((project, index) => {
            return (
              <div
                key={`project-${index}`}
                className="md:flex md:justify-between grid grid-cols-1 p-7 bg-slate-800 border-2  border-purple-600/50 rounded-xl"
              >
                <div className="md:w-1/2 w-full md:my-0 mb-3">
                  <div>
                    <h2 className="text-xl font-bold pb-1">{project.title}</h2>
                    <p>{project.description}</p>
                  </div>
                  <div className="pt-6 pb-3 flex flex-wrap gap-3">
                    {project.projectLinks &&
                      project.projectLinks.map((link, index) => {
                        return (
                          <Link
                            key={`project-link-${index}`}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-900 hover:border-purple-600 hover:text-purple-600 border-2 border-slate-600 rounded-md whitespace-nowrap transition-colors"
                            href={link.link}
                          >
                            <Icon icon={link.icon} variant="ui" />
                            <span>{link.title}</span>
                          </Link>
                        );
                      })}
                  </div>
                  <div className="py-4">
                    <h3 className="pb-2">Technology Used:</h3>
                    <ul>
                      {project.techStack &&
                        project.techStack.map((techPill, index) => {
                          return (
                            <li
                              className="list-none inline-flex py-1 pr-5"
                              key={`tech-pill-${index}`}
                            >
                              {techPill.icon && <Icon icon={techPill.icon} />}
                              {techPill.name && techPill.name}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
                <div className="md:w-1/2 w-full md:grid md:justify-items-end">
                  {project.projectMedia.mediaType === "image" &&
                    project.projectMedia.mediaSrc !== "" && (
                      <Image
                        src={project.projectMedia.mediaSrc}
                        className="rounded-lg object-top"
                        width={600}
                        height={600}
                        alt=""
                      />
                    )}
                  {project.projectMedia.mediaType === "video" && (
                    <Iframe src={project.projectMedia.mediaSrc} height={275} />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
