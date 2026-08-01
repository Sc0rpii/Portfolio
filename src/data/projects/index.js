import { moreProjects } from "./moreProjects";
import { personalProjects } from "./personalProjects";
import { professionalProjects } from "./professionalProjects";

export { moreProjects, personalProjects, professionalProjects };

export const allProjects = [
    ...professionalProjects,
    ...personalProjects,
    ...moreProjects,
];
