const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            const getCompareSnapshotsPlugin = require("cypress-image-diff-js/dist/plugin");
            getCompareSnapshotsPlugin(on, config);
            
        },
        specPattern: "test/**/*.{cy,spec,test}.{js,jsx,ts,tsx}",
    },
});
R