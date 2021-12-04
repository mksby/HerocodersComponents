const { existsSync, mkdir, writeFile } = require('fs');

const createDir = path => {
  return new Promise((resolve, reject) => {
    if (!existsSync(path)){
      mkdir(path, null, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  })
}

const write = (path, json) => {
  return new Promise((resolve, reject) => {
    writeFile(path, JSON.stringify(json, null, 4), error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  })
};

module.exports = {
  createDir,
  writeFile: write
}
