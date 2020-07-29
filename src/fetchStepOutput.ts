import fetch from 'node-fetch';
import { debug } from './debug';

const fetchStepOutput = async (output_url: string) => {
  if (output_url) {
    debug(`fetching ${output_url}`);
    const response = await fetch(output_url);
    if (!response.ok) {
      console.error(`ERROR: ${response.status} ${response.statusText}`);
      process.exit(1);
    }
    const json = await response.json();
    return json[0].message;
  }
  return 'no output';
};

export default fetchStepOutput;
