const { writeFile } = require('fs');

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
    writeFile: write
}
