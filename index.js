const { exec } = require("child_process");

async function sortHackerNewsArticles() {
    exec("npx playwright test test.spec.js", (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

(async () => {
  await sortHackerNewsArticles();
})();
