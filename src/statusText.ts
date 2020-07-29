import chalk from 'chalk';

const statusText = status => {
  if (status === 'success') return chalk.green(status);
  return chalk.red(status);
};

export default statusText;
