console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("nav a");
let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
)

if (currentLink) {
    // or if (currentLink !== undefined)
    currentLink.classList.add('current');
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/hangyizhao949', title: 'GitHub' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);


const BASE_PATH =
    location.hostname === 'localhost' || location.hostname === '127.0.0.1'
        ? '/' // Local server
        : '/portfolio/'; // GitHub Pages repo name

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    }
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        a.target = "_blank";
    }
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>

    </label>
    `
);

// let the select dropdown fixed in the upper right
const navElement = document.querySelector("nav");
const label = document.querySelector(".color-scheme");
navElement.insertAdjacentElement("afterend", label);



// get the elements in 'select' 
const select = document.querySelector('.color-scheme select');
// get user's event
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    // change the color-scheme in the root element
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
});

// if the colorScheme in localStorage, then use it
if ('colorScheme' in localStorage) {
    const savedScheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', savedScheme);
    select.value = savedScheme;
}

const params = [];
const form = document.querySelector("form");
form?.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form)
    for (let [name, value] of data) {
        // not let space change to '+' 
        params.push(`${name}=${encodeURIComponent(value)}`);
    }
    const url = form.action + "?" + params.join("&");

    console.log("Generated mailto URL:", url);
    location.href = url;
});


export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

// export from 
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    // Your code will go here
    containerElement.innerHTML = '';
    for (const project of projects) {
        const article = document.createElement('article');
        // ${headingLevel} must have a $ which means this is a variable and is not fixed.
        article.innerHTML = `
        <h3>${project.title}</h3>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>`;
        containerElement.appendChild(article);
    }
}

// automatically check which folder and find the right path of the image.
export function getImagePath(image) {
    // check the subdirectory
    const depth = location.pathname.split('/').length - 2;

    // portfolio → depth is 1
    // projects/project2 → depth is2
    // add  "../" according to depth 
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
    return prefix + image;
}


export async function fetchGitHubData(username) {
    // return statement here
    return fetchJSON(`https://api.github.com/users/${username}`);
}