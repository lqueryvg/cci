import apiRequest from './apiRequest';
import { getParsedArgs } from './parseCommandLine';

const getBuild = async (buildNum: number): Promise<any> => {
  return apiRequest(`project/${getParsedArgs().project}/${buildNum}`);
};

export default getBuild;
