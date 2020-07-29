import api from './api';

const showProjects = async (): Promise<void> => {
  const json = await api.request(`projects`, { shallow: true });
  for (let i = 0; i < json.length; i += 1) {
    const project = json[i];
    console.log(`${project.username}/${project.reponame}`);
  }
};

export default showProjects;
