const figlet = require('figlet');
const pkg    = require('./package');

process.stdout.write('\n');
process.stdout.write(`${figlet.textSync('Find Earth', { font: 'Ogre' })}\n`);
process.stdout.write('\n');
process.stdout.write(`version: ${pkg.version} revision: ${pkg.revision}\n`);
process.stdout.write('\n');
process.stdout.write('\n');
