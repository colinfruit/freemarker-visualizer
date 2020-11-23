const { platform } = require('process');
const { exec } = require('child_process');

const open = (image) => {
  if (platform === 'darwin') {
    exec(`open ${image}`);
  }
  if (platform === 'linux') {
    exec(`xdg-open ${image}`);
  }
  // eslint-disable-next-line no-console
  console.log(`image created at: ${image}`);
};

module.exports = open;
