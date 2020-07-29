import apiRequest from './apiRequest';
import { debug } from './debug';
import { getParsedArgs } from './parseCommandLine';

export interface ListBuildsParams {
  offset?: number;
}

export const MAX_BATCH_SIZE = 100; // CircleCI API max = 100

export async function* getBuilds({ offset = 0 }: ListBuildsParams): any {
  let currentOffset = offset;

  let fetchMore = true;
  while (fetchMore) {
    debug(`currentOffset   = ${currentOffset}`);

    const apiPath = `project/${getParsedArgs().project}`;
    // if (branch) {
    //   apiPath = `${apiPath}/tree/${branch}`;
    // }

    const response: [] = await apiRequest(apiPath, {
      limit: `${MAX_BATCH_SIZE}`,
      offset: `${currentOffset}`,
    });

    currentOffset += response.length;
    if (response.length < MAX_BATCH_SIZE) {
      // received fewer records than requested, so need to stop
      fetchMore = false;
    }
    // NOTE: CircleCI API returns builds in REVERSE ORDER
    for (const build of response) {
      yield build;
    }
  }
}

export interface Build {
  build_num?: number;
}

export const getLastBuildNumber = async (): Promise<number> => {
  const apiPath = `project/${getParsedArgs().project}`;

  const response: [Build] = await apiRequest(apiPath, {
    limit: `1`,
  });
  const { build_num } = response[0];
  if (!build_num) throw new Error(`no build_num in response: ${response}`);
  return build_num;
};
