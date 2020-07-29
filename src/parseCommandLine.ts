/* eslint-disable @typescript-eslint/no-non-null-assertion */
import minimist, { ParsedArgs } from 'minimist';
import dedent from 'dedent';

/* istanbul ignore file */

let parsedArgs: ParsedArgs;

const usage = (): void => {
  const basename = (path: string) => {
    return path.replace(/.*\//, '');
  };

  const progName = basename(process.argv[1]);
  console.log(
    dedent(`
      Usage:
        ${progName} help                                      # this help
        ${progName} projects                                  # list all followed projects
        ${progName} builds -p project [options]               # list recent builds
        ${progName} show -p project -n buildNumber [options]  # show details of a build
      Options:
        -n        --buildNumber
        -b        --branch
        -d        --debug
        -p        --project           # github project, i.e. {username}/{repository}
        -j        --json              # show raw json output
                  --jobName           # filter: only show builds whose job name matches this regexp
        -f        --fromBuildNumber   # filter: oldest build to show
        -t        --toBuildNumber     # filter: newest build to show
                  --containsStep      # filter: only show builds containing one or more steps whose name matches this regexp
                  --extractText       # filter: only show builds with matching step output and extract 1st regexp capture group

      Environment:
        export CIRCLE_TOKEN=abc123....

      Example:
        cci show --project lqueryvg/cci --buildNumber 31100
        cci builds -f 31100 -t 31200 --project lqueryvg/cci
          --jobName archive_data --containsStep 'Create tar'
          --extractOutput '\\r(upload.*gz)\\r'
                  
      IMPORTANT:  If using yarn exec, add '--'
    `)
  );
};

const invokeMinimist = (): void => {
  const validCommands = ['help', 'projects', 'show', 'builds'];
  let command;
  parsedArgs = minimist(process.argv.slice(2), {
    string: ['p', 'e', 'b', 'n', 'jobName', 'containsStep', 'extractOutput'],
    boolean: ['d', 'j'],
    alias: {
      b: 'branch',
      d: 'debug',
      n: 'buildNumber',
      p: 'project',
      j: 'jsonOutput',
      l: 'limit',
      f: 'fromBuildNumber',
      t: 'toBuildNumber',
    },
    unknown: (word: string) => {
      if (!validCommands.includes(word)) {
        console.error(`ERROR: unknown option '${word}'`);
      }
      if (command) {
        console.error('ERROR: please supply only ONE command');
      }
      command = word;
      return true;
    },
  });
};

const validate = (): void => {
  [parsedArgs.command] = parsedArgs._;

  if (!parsedArgs.command) {
    console.error('ERROR: please supply a command');
    usage();
    process.exit(1);
  }

  if (parsedArgs.command === 'help') {
    usage();
    process.exit(0);
  }

  if (parsedArgs.command !== 'projects' && !parsedArgs.project) {
    console.error('ERROR: no --project specified');
    process.exit(1);
  }

  if (parsedArgs.command === 'show' && !parsedArgs.buildNumber) {
    console.error('ERROR: show command needs a build number (-n)');
    process.exit(1);
  }

  if (parsedArgs.command === 'builds' && parsedArgs.buildNumber) {
    console.error('ERROR: -buildNumber (-n) is not valid with builds command');
    process.exit(1);
  }

  if (parsedArgs.jsonOutput && parsedArgs.debug) {
    console.error('ERROR: --jsonOutput and --debug are mutually exclusive');
    process.exit(1);
  }
};

export const parseCommandLine = (): void => {
  invokeMinimist();
  validate();
};

export const getParsedArgs = (): minimist.ParsedArgs => {
  return parsedArgs;
};
export default parseCommandLine;
