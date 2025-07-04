#!/usr/bin/env node

/**
 * Jest Test Runner Script
 * Run this script to execute the API tests with specific configurations
 */

import { execSync } from 'child_process';

// Command line args
const args = process.argv.slice(2);
const testPathPattern = args[0] || 'hooks/use-api';
const watchMode = args.includes('--watch');
const coverage = args.includes('--coverage');

// Build the command
let command = 'jest';

// Add test pattern
if (testPathPattern) {
  command += ` --testPathPattern=${testPathPattern}`;
}

// Add watch mode if specified
if (watchMode) {
  command += ' --watch';
}

// Add coverage if specified
if (coverage) {
  command += ' --coverage';
}

// Add Jest specific options
command += ' --verbose';

console.log(`Running tests with command: ${command}`);

try {
  execSync(command, { stdio: 'inherit' });
  console.log('Tests completed successfully');
} catch (error) {
  console.error('Tests failed with error:', error.message);
  process.exit(1);
}
