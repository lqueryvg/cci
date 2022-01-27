import chalk from 'chalk';

import statusText from './statusText';
import fetchStepOutput from './fetchStepOutput';

import {
  getBuilds,
  ListBuildsParams,
  getLastBuildNumber,
} from './apiGetBuilds';
import getBuild from './apiGetBuild';
import { debug } from './debug';
import { getParsedArgs } from './parseCommandLine';

const calculateInitialOffset = async (): Promise<number> => {
  // Optimisation:
  // If the "to" build number was was requested, use the
  // most recent build number to determine the initial offset
  let offset = 0;
  if (getParsedArgs().toBuildNumber) {
    const last = await getLastBuildNumber();
    debug(`last = ${last}`);
    offset = last - getParsedArgs().toBuildNumber;
  }
  return offset;
};

const showBuilds = async (): Promise<void> => {
  const fromBuildNumber = getParsedArgs().fromBuildNumber || 0;
  const toBuildNumber = getParsedArgs().toBuildNumber || Number.MAX_VALUE;

  let outputLine: (arg0: any, extraText?: string) => void;

  if (getParsedArgs().jsonOutput) {
    outputLine = (build: any) => {
      console.log(build);
    };
  } else {
    outputLine = (build, extraText?: string) => {
      console.log(
        // `${build.username}/${build.reponame}/${build.build_num}` +
        // eslint-disable-next-line prefer-template
        `${chalk.yellow(build.build_num)}` +
          ` ${chalk.blue(build.stop_time)}` +
          ` ${statusText(build.status)}` +
          ` ${build.branch}` +
          ` ${build.workflows.workflow_name}` +
          ` ${build.workflows.job_name}` +
          (extraText ? ` ${extraText}` : '')
      );
    };
  }

  let extraText: string | undefined;
  const listBuildsParams: ListBuildsParams = {
    offset: await calculateInitialOffset(),
  };

  for await (const build of getBuilds(listBuildsParams)) {
    if (build.build_num < fromBuildNumber) break;
    if (build.build_num > toBuildNumber) continue;

    // skips builds not on requested branch
    if (getParsedArgs().branch && getParsedArgs().branch !== build.branch)
      continue;

    // skip builds who's job name does not match
    if (
      getParsedArgs().jobName &&
      !build.workflows.job_name.match(new RegExp(getParsedArgs().jobName))
    )
      continue;

    // skips builds whos steps don't match requested pattern
    let matchingStep;
    if (getParsedArgs().containsStep) {
      const detailedBuild = await getBuild(build.build_num);
      matchingStep = detailedBuild.steps.find((step) =>
        step.name.match(new RegExp(getParsedArgs().containsStep))
      );
      if (!matchingStep) continue;

      const { output_url } = matchingStep.actions[0];

      const output = await fetchStepOutput(output_url);

      // extract output

      extraText = undefined;
      if (getParsedArgs().extractOutput) {
        debug(`extracting text: ${getParsedArgs().extractOutput}`);
        const regex = new RegExp(`${getParsedArgs().extractOutput}`);

        const match = regex.exec(output);
        if (match) {
          const extracted = match[1];
          extraText = `match='${extracted}'`;
        }
      }
    }

    outputLine(build, extraText);
  }
};

export default showBuilds;
