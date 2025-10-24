// import json file from global.js
import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
console.log('Loaded data:', projects);


// for (let project of projects) {
//     project.image = getImagePath(project.image);
// }

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// count how many projects and show it in title
// there is class a dot befor class name
const titleElement = document.querySelector('.projects-title')
titleElement.textContent = `${projects.length} Projects`