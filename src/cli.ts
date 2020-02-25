#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import { printErrorAndExit } from './utils/process';
import { publish } from './commands/publish';
import { snapshot } from './commands/snapshot';
import { upgrade } from './commands/upgrade';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version, description } = require('../package.json');

process.on('unhandledRejection', printErrorAndExit);
process.on('uncaughtException', printErrorAndExit);

program
    .command('publish [target]')
    .description('publish unpublished packages')
    .option('--dry-run', 'no actual publishing (passed to npm as well)', false)
    .option('--contents <name>', 'subdirectory to publish (similar to lerna publish --contents)', '.')
    .action(async (targetPath: string, { dryRun, contents }) => {
        try {
            const directoryPath = path.resolve(targetPath || '');
            await publish({ directoryPath, dryRun, contents });
        } catch (e) {
            printErrorAndExit(e);
        }
    });

program
    .command('snapshot [target]')
    .description('publish a snapshot of the packages (based on git commit hash)')
    .option('--dry-run', 'no actual publishing (passed to npm as well)', false)
    .option('--contents <name>', 'subdirectory to publish (similar to lerna publish --contents)', '.')
    .action(async (targetPath: string, { dryRun, contents }) => {
        try {
            const directoryPath = path.resolve(targetPath || '');
            await snapshot({ directoryPath, dryRun, contents });
        } catch (e) {
            printErrorAndExit(e);
        }
    });

program
    .command('upgrade [target]')
    .description('upgrade dependencies and devDependencies of all packages')
    .option('--dry-run', 'no actual upgrading (just the fetching process)', false)
    .action(async (targetPath: string, { dryRun }) => {
        try {
            const directoryPath = path.resolve(targetPath || '');
            await upgrade({ directoryPath, dryRun });
        } catch (e) {
            printErrorAndExit(e);
        }
    });

program
    .version(version, '-v, --version')
    .description(description)
    .usage('[options]')
    .parse(process.argv);
