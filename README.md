# cci

CLI to get CircleCI build info

## Usage

```
Usage:
  cci help                                      # this help
  cci projects                                  # list all followed projects
  cci builds -p project [options]               # list recent builds
  cci show -p project -n buildNumber [options]  # show details of a build
Options:
  -n        --buildNumber
  -d        --debug
  -p        --project           # github project, i.e. {username}/{repository}
  -j        --json              # show raw json output
            --jobName           # filter: only show builds whose job name matches this regexp
  -b        --branch            # filter: only show builds for this branch
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
    --extractOutput '\r(upload.*gz)\r'

IMPORTANT:  If using yarn exec, add '--'
```
