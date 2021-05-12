const projects = require('./data-store')

const findAll = () => {
  return projects;
};

const idAlreadyExists = (id) => {
  filteredProjects = projects.filter(project => project.id == id)
  return filteredProjects.length > 0
}

const save = (project) => {
  console.log(projects)
  projects.push(project);
};

const Projects = function() {}
Projects.prototype.findAll = findAll
Projects.prototype.idAlreadyExists = idAlreadyExists
Projects.prototype.save = save

module.exports = new Projects()
