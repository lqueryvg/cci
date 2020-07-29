#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* istanbul ignore file */

import { parseCommandLine, getParsedArgs } from './parseCommandLine';
import { setDebug } from './debug';
import showProjects from './showProjects';
import showBuild from './showBuild';
import showBuilds from './showBuilds';

if (require.main !== module) {
  // caller is trying to require / import this module
  throw new Error(
    'cci is cli, not a library; it is probably a mistake to require or import it'
  );
}

parseCommandLine();
setDebug(getParsedArgs().debug && !getParsedArgs().jsonOutput);

const main = async (): Promise<void> => {
  if (getParsedArgs().command === 'projects') {
    await showProjects();
    return;
  }

  if (getParsedArgs().command === 'builds') {
    await showBuilds();
    return;
  }

  if (getParsedArgs().command === 'show') {
    await showBuild();
  }
};

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e.message);
  }
})();
