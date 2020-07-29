let debugEnabled = false;
export const debug = text => {
  if (debugEnabled) {
    console.log(text);
  }
};

export const setDebug = (shouldEnable: boolean) => {
  debugEnabled = shouldEnable;
};
