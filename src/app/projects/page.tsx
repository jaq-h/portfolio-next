"use client";

import Image from "next/image";
import Iframe from "@/app/components/media/Iframe";
import Icon from "@/app/components/media/Icon";
import { PageContainer, Card, Button } from "@/app/components/ui";
import { useProjects } from "@/lib/content/provider";

export default function Projects() {
  // Get projects from React Context (fetched server-side in layout)
  const projects = useProjects();

  return (
    <PageContainer title="Technical Projects">
      {projects &&
        projects.map((project, index) => (
          <Card
            key={`project-${index}`}
            className="md:flex md:justify-between grid grid-cols-1"
          >
            <div className="md:w-1/2 w-full md:my-0 mb-3">
              <div>
                <h2 className="text-xl font-bold pb-1">{project.title}</h2>
                <p>{project.description}</p>
              </div>
              <div className="pt-6 pb-3 flex flex-wrap gap-3">
                {project.projectLinks &&
                  project.projectLinks.map((link, index) => (
                    <Button
                      key={`project-link-${index}`}
                      href={link.link}
                      icon={link.icon}
                    >
                      {link.title}
                    </Button>
                  ))}
              </div>
              <div className="py-4">
                <h3 className="pb-2">Technology Used:</h3>
                <ul>
                  {project.techStack &&
                    project.techStack.map((techPill, index) => (
                      <li
                        className="list-none inline-flex py-1 pr-5"
                        key={`tech-pill-${index}`}
                      >
                        {techPill.icon && <Icon icon={techPill.icon} />}
                        {techPill.name && techPill.name}
                      </li>
                    ))}
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
          </Card>
        ))}
    </PageContainer>
  );
}
