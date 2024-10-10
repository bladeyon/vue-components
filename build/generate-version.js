import fs from 'fs';
import packageJson from '../package.json' assert { type: 'json' };

const version = packageJson.version.split('.').map(Number);
version[2] += 1;
packageJson.version = version.join('.');

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
