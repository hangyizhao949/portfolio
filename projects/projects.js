// import d3 to help plot
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
// import json file from global.js
import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
console.log('Loaded data:', projects);
renderProjects(projects, projectsContainer, 'h2');

// keep track of search text
let query = '';
// select search input
let searchInput = document.querySelector('.searchBar');

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
    // TODO: clear up paths and legends
    let newSVG = d3.select('#projects-pie-plot');
    newSVG.selectAll('*').remove();
    let legend = d3.select('.legend');
    legend.selectAll('li').remove();

    // automatically count using rollups
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,//how many element in each group
        (d) => d.year,//group by year
    );
    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year }; // TODO
    });
    // re-calculate slice generator, arc data, arc, etc.
    let colors = d3.scaleOrdinal(d3.schemeTableau10)
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => newArcGenerator(d));

    // plot and add 'click' enent
    newArcData.forEach((d, i) => {
        d3.select('#projects-pie-plot')
            .append('path')
            .attr('d', newArcGenerator(d))
            .attr('fill', colors(i))
            .attr('class', selectedIndex === i ? 'selected' : '')
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;
                newSVG
                    .selectAll('path')
                    .attr('class', (_, idx) => (
                        // TODO: filter idx to find correct pie slice and apply CSS from above
                        idx === selectedIndex ? 'selected' : ''
                    ));
                legend
                    .selectAll('li')
                    .attr('class', (_, idx) => (
                        // TODO: filter idx to find correct legend and apply CSS from above
                        idx === selectedIndex ? 'selected' : ''
                    ));
                // according to the selected 'year' to filter projects
                if (selectedIndex === -1) {
                    // If deselect all，show all projects
                    renderProjects(projects, projectsContainer, 'h2');
                } else {
                    // otherwise, only show the selected 'year'
                    const selectedYear = newData[selectedIndex].label;
                    const filtered = projects.filter(p => String(p.year).trim() === selectedYear);
                    renderProjects(filtered, projectsContainer, 'h2');
                }
            });
    });

    // plot the legend

    newData.forEach((d, idx) => {
        legend
            .append('li')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

}
let selectedIndex = -1;

// Call this function on page load
renderPieChart(projects);

searchInput.addEventListener('change', (event) => {
    let query = event.target.value.toLowerCase();
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query);
    });
    // re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});









// // group projects by year and count how many per year
// let rolledData = d3.rollups(
//     projects,
//     (v) => v.length,   // how to count in each group
//     (d) => d.year      // group key: year
// );
// console.log('Rolled data:', rolledData);

// let data = rolledData.map(([year, count]) => {
//     return { value: count, label: year };
// });

// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');

// // count how many projects and show it in title
// // there is class a dot befor class name
// const titleElement = document.querySelector('.projects-title')
// titleElement.textContent = `${projects.length} Projects`

// // the silly method to draw a complete circle
// // create arc generator (circle)
// let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
// // // generate full circle path
// // let arc = arcGenerator({
// //     startAngle: 0,
// //     endAngle: 2 * Math.PI,
// // });
// // // add it to the SVG
// // d3.select('#projects-pie-plot').append('path').attr('d', arc).attr('fill', 'red');

// let colors = d3.scaleOrdinal(d3.schemeTableau10);
// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);

// arcData.forEach((d, idx) => {
//     d3.select('#projects-pie-plot')
//         .append('path')
//         .attr('d', arcGenerator(d))
//         .attr('fill', colors(idx));
// });
// // another manually add the Pie(but complex)
// // let colors = ['gold', 'purple'];

// // for (let d of data) {
// //     total += d;
// // }

// // let angle = 0;
// // let arcData = [];

// // for (let d of data) {
// //     let endAngle = angle + (d / total) * 2 * Math.PI;
// //     arcData.push({ startAngle: angle, endAngle });
// //     angle = endAngle;
// // }

// // let arcs = arcData.map((d) => arcGenerator(d));

// // arcs.forEach((arc, idx) => {
// //     d3.select('#projects-pie-plot').append('path').attr('d', arc).attr('fill', colors[idx]);
// // })

// let legend = d3.select('.legend');
// data.forEach((d, idx) => {
//     legend
//         .append('li')
//         .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//         .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// });


// // when user types something
// searchInput.addEventListener('change', (event) => {
//     // update query value
//     query = event.target.value;
//     // filter projects
//     let filteredProjects = projects.filter((project) => {
//         let values = Object.values(project).join('\n').toLowerCase();
//         return values.includes(query.toLowerCase());
//     });
//     // render filtered projects
//     renderProjects(filteredProjects, projectsContainer, 'h2');
// });
