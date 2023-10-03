// cypress/plugin/index.js
module.exports = (on, config) => {
    const getCompareSnapshotsPlugin = require("cypress-image-diff-js/dist/plugin");
    getCompareSnapshotsPlugin(on, config);
};
