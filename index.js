import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';
// get the first three projects
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
// find the projects
const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');
// get the github data
const githubData = await fetchGitHubData('hangyizhao949');
// choose container that dispaly the content
const profileStats = document.querySelector('#profile-stats');

// find the real path of image
for (let project of latestProjects) {
    project.image = getImagePath(project.image);
}

// if find container, then dynamically update the data showing in home page
if (profileStats) {
    profileStats.innerHTML = `
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
          </dl>
      `;
}