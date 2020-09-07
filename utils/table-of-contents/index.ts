// TODO: Make this a package within the repository.

// Libraries
import shell from 'shelljs';
import {
  resolve,
} from 'path';
import {
  promises,
  Dirent,
  writeFileSync,
  readFileSync,
} from 'fs';

// Dependencies
import config from '../../package.json';
import { knuthMorrisPratt } from './knuthMorrisPratt';

interface IPackageJson {
  version: string;
  name: string;
  description: string;
}

const homepage = config.homepage;
const tocPattern = {
  start: '<!-- START custom generated Lerna Packages please keep comment here to allow auto update -->',
  end: '<!-- END custom generated Lerna Packages please keep comment here to allow auto update -->',
  instruction: '<!-- DON\'T EDIT THIS SECTION, INSTEAD RE-RUN `npm run doc` TO UPDATE -->',
};

const { readdir } = promises;

/**
 * Recursive Files Async Iterator Generator. Allow us to iterate over data that
 * comes asynchronously, in this case the data will be our directories.
 * Returns an Async Iterator of the files in every directory that
 * is not a node module or a git folder.
 * @param {string} dir - Directory.
 */
async function* getPackages(dir: string = resolve(__dirname, '..', '..', 'packages')): AsyncGenerator<[Dirent, string]> {
  // A representation of a directory entry, as
  // returned by reading from an fs.Dir.
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) { // Base condition.
    // Resolving the files and directories.
    const res = resolve(dir, dirent.name);
    // Do not get files if they're node modules or git folders.
    const shouldNotGetFiles = (
      res.includes('node_modules') ||
      res.includes('.git')
    );
    // If it's a directory, return it.
    if (dirent.isDirectory() && !shouldNotGetFiles) {
      yield [dirent, res]; // Return the directory.
    } else {
      continue;
    }
  }
}

function getPackageName(pacakgeDirent: Dirent, path: string): string {
  try {
    const packageJson: IPackageJson = JSON.parse(readFileSync(`${path}/package.json`).toString('utf-8'));
    return packageJson.name;
  } catch {
    return pacakgeDirent.name;
  }
}

/**
 * Creating the table of contents.
 */
async function generateToC(): Promise<void> {
  await new Promise((resolve, reject) => {
    const child = shell.exec('ts-node ./node_modules/doctoc/doctoc.js ./README.md', { async: true });
    // eslint-disable-next-line no-console
    child.stderr?.on('data', reject);
    // On exit, notify if success or if error.
    child.on('exit', function (code: number) {
      if (code === 0) {
        resolve();
      } else {
        reject(`Error code ${code}. Something went wrong.`);
      }
    });
  });
  // Creating the packages table of contents.
  const packageLinks: Array<string> = [];
  for await (const [packageDirent, path] of getPackages()) {
    const name = getPackageName(packageDirent, path);
    // [I'm an inline-style link with title](https://www.google.com "Google's Homepage")
    const packageMarkdown = `- [${name}](${homepage}/packages/${packageDirent.name} "${name} package homepage")`;
    // TODO: Sort package links.
    packageLinks.push(packageMarkdown);
  }
  const packagesMarkdown: string = packageLinks.join('\n');
  // Writing the generated lerna packages table of contents into the
  // original README.md file.
  const readme = readFileSync(resolve(__dirname, '..', '..', 'README.md')).toString('utf-8');
  // Splitting the file in two, in order to insert the new table:
  const firstHalfStartIndex = knuthMorrisPratt(readme, tocPattern.start);
  const secondHalfStartIndex = knuthMorrisPratt(readme, tocPattern.end);
  const firstHalfMarkdown = readme.slice(0, firstHalfStartIndex + tocPattern.start.length);
  const secondHalfMarkdown = readme.slice(secondHalfStartIndex, readme.length);
  // Insertion and saving the file.
  const newReadme = [
    firstHalfMarkdown,
    '\n',
    tocPattern.instruction,
    '\n\n',
    packagesMarkdown,
    '\n\n',
    secondHalfMarkdown,
  ].join('');
  // TODO: Add support for logging if a `DEBUG` flag is passed.
  // console.log('newReadme: ', newReadme);
  writeFileSync(resolve(__dirname, '..', '..', 'README.md'), newReadme);
}

generateToC();
