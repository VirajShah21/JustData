const { exec } = require('child_process');

/**
 * Handles the errors returned from an `exec` call.
 *
 * @param {import('child_process').ExecException | null} err - The error throw by exec.
 * @param {string} stderr - The contents written to stderr.
 */
function handleErrors(err, stderr) {
    if (err) {
        console.error(`❌ ${err}`);
        throw err;
    }

    if (stderr.length > 0) {
        console.warn('⚠️ Something was written to stderr');
        console.error(stderr);
    }
}

/**
 * Logs the completion of a build task to the console.
 *
 * @param {string} task - The task that was completed.
 */
function finished(task) {
    console.log(`✅ ${task}`);
}

const clientDir = { cwd: './app' };
const serverDir = { cwd: './server' };

exec('yarn install --production', clientDir, (installErr, installStdout, installStderr) => {
    handleErrors(installErr, installStderr);
    finished('Installing dependences for the client');

    exec('yarn build', clientDir, (err, stdout, stderr) => {
        handleErrors(err, stderr);
        finished('Building client');
    });
});

exec('yarn install --production', serverDir, (installErr, installStdout, installStderr) => {
    handleErrors(installErr, installStderr);
    finished('Installing dependences for the server');

    exec('yarn build', serverDir, (err, stdout, stderr) => {
        handleErrors(err, stderr);
        finished('Building server');
    });
});
