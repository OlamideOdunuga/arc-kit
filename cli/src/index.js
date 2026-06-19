#!/usr/bin/env node
import { program } from 'commander';

program
  .name('arc-appkit')
  .description('Scaffold a ready-to-run Arc App Kit project')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new Arc App Kit project')
  .action(async () => {
    const { createProject } = await import('./create.js');
    createProject();
  });

program.parse(process.argv);