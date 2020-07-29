import fetch from 'node-fetch';
import { debug } from './debug';
import { getParsedArgs } from './parseCommandLine';

export interface QueryParams {
  limit?: string;
  offset?: string;
  shallow?: boolean;
}

const request = async (path: string, queryParams?: QueryParams) => {
  const urlencoded = new URLSearchParams();
  if (queryParams) {
    urlencoded.append('limit', `${queryParams.limit}`);
    urlencoded.append('offset', `${queryParams.offset}`);
    if (queryParams.shallow) {
      urlencoded.append('shallow', `${queryParams.shallow}`);
    }
  }

  const apiV1 = `https://circleci.com/api/v1`;
  const token = process.env.CIRCLE_TOKEN || 'undefined';

  const url = `${apiV1}/${path}?${urlencoded.toString()}`;
  debug(`url = ${url}`);
  const response = await fetch(url, {
    headers: { 'Circle-Token': token },
  });
  if (!response.ok) {
    console.error(`ERROR: ${response.status} ${response.statusText}`);
    process.exit(1);
  }
  const text = await response.text();
  const json = JSON.parse(text);
  if (getParsedArgs().jsonOutput) {
    console.log(text);
  }
  return json;
};

export default request;
