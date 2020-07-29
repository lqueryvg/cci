import request from './apiRequest';
import { getBuilds } from './apiGetBuilds';

export default {
  request,
  listBuilds: getBuilds,
};
