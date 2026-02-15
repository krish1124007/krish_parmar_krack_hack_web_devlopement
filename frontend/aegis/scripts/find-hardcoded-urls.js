#!/usr/bin/env node

/**
 * Script to find all files with hardcoded API URLs
 * Run: node scripts/find-hardcoded-urls.js
 */

const fs = require('fs');
const path = require('path');

const searchDir = path.join(__dirname, '..', 'src');
const searchPattern = /http:\/\/localhost:8000/g;
const results = [];

function searchFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules and other ignored directories
            if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
                searchFiles(filePath);
            }
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(filePath, 'utf8');
            const matches = content.match(searchPattern);

            if (matches) {
                const lines = content.split('\n');
                const matchingLines = [];

                lines.forEach((line, index) => {
                    if (searchPattern.test(line)) {
                        matchingLines.push({
                            line: index + 1,
                            content: line.trim()
                        });
                    }
                });

                results.push({
                    file: path.relative(searchDir, filePath),
                    matches: matchingLines.length,
                    lines: matchingLines
                });
            }
        }
    });
}

console.log('🔍 Searching for hardcoded API URLs...\n');
searchFiles(searchDir);

if (results.length === 0) {
    console.log('✅ No hardcoded URLs found! All files are using centralized config.');
} else {
    console.log(`⚠️  Found ${results.length} file(s) with hardcoded URLs:\n`);

    results.forEach(result => {
        console.log(`📄 ${result.file} (${result.matches} occurrence(s))`);
        result.lines.forEach(line => {
            console.log(`   Line ${line.line}: ${line.content.substring(0, 80)}...`);
        });
        console.log('');
    });

    console.log('💡 Tip: Update these files to use API_ENDPOINTS from src/config/api.config.js');
    console.log('📖 See API_MIGRATION_GUIDE.md for detailed instructions');
}

console.log(`\n✨ Scan complete! Checked ${results.length} files.`);
