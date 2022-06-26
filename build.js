const { exec } = require('child_process');

exec('cd app; yarn build', (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }

    if (stderr.length > 0) {
        console.warn('Error building React application');
        return;
    }

    console.log('Finished building React application');

    if (stdout.length > 0) {
        console.log(stdout);
    }
});

exec('cd server; yarn build', (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }

    if (stderr.length > 0) {
        console.warn('Error building server');
        return;
    }

    console.log('Finished building server');

    if (stdout.length > 0) {
        console.log(stdout);
    }
});
