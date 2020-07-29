import chalk from 'chalk';

import api from './api';
import statusText from './statusText';
import fetchStepOutput from './fetchStepOutput';
import { getParsedArgs } from './parseCommandLine';

const showBuild = async (): Promise<void> => {
  const build = await api.request(
    `project/${getParsedArgs().project}/${getParsedArgs().buildNumber}`
  );

  if (!getParsedArgs().jsonOutput) {
    console.log(
      `${build.username}/${build.reponame}/${build.build_num}` +
        ` ${build.stop_time}` +
        ` ${build.branch}` +
        ` ${statusText(build.status)}` +
        ` ${build.workflows.workflow_name}` +
        ` ${build.workflows.job_name}`
    );
    console.log(
      `Workflow: ${build.workflows.workflow_name} https://circleci.com/workflow-run/${build.workflows.workflow_id}`
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const step of build.steps) {
      const action = step.actions[0];
      console.log(
        `${chalk.blue('Step:')} ${chalk.yellow(step.name)} ${statusText(
          action.status
        )}`
      );

      const { output_url } = step.actions[0];

      const output = await fetchStepOutput(output_url);
      console.log(`${output}`);
    }
  }
};

export default showBuild;
