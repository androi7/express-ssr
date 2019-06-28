const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'vote-ssr-react', shell: true };
require('child_process').spawn('npm', args, opts);