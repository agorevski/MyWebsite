#!/usr/bin/env node
/**
 * GitHub Contributions Data Fetcher
 * Fetches contribution data from GitHub API and merges it with historical JSON data.
 * Run periodically (e.g., weekly via GitHub Actions) to preserve historical data beyond 90 days.
 * 
 * Usage: node scripts/update-github-contributions.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const USERNAME = 'agorevski';
const DATA_FILE = path.join(__dirname, '..', 'data', 'github-contributions.json');
const DAYS_TO_FETCH = 90;

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'GitHub-Contributions-Fetcher'
            }
        };
        
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('Failed to parse JSON: ' + e.message));
                }
            });
        }).on('error', reject);
    });
}

async function getRecentGitHubEvents(username, since) {
    let events = [];
    let page = 1;
    
    while (page <= 10) {
        try {
            const data = await httpsGet(
                `https://api.github.com/users/${username}/events?per_page=100&page=${page}`
            );
            if (!Array.isArray(data) || data.length === 0) break;
            
            const recent = data.filter(event => new Date(event.created_at) >= since);
            events = events.concat(recent);
            
            if (recent.length < data.length) break;
            page++;
        } catch (e) {
            console.warn(`Error fetching events page ${page}:`, e.message);
            break;
        }
    }
    
    return events;
}

async function getRecentCommitsFromRepos(username, since) {
    const commits = [];
    const sinceISO = since.toISOString();
    
    try {
        const repos = await httpsGet(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`
        );
        if (!Array.isArray(repos)) return commits;
        
        const recentRepos = repos.filter(repo => new Date(repo.pushed_at) >= since).slice(0, 10);
        
        for (const repo of recentRepos) {
            try {
                const repoCommits = await httpsGet(
                    `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&since=${sinceISO}&per_page=100`
                );
                if (!Array.isArray(repoCommits)) continue;
                
                repoCommits.forEach(commit => {
                    if (commit.commit?.author?.date) {
                        commits.push(formatDate(new Date(commit.commit.author.date)));
                    }
                });
            } catch (e) {
                // Skip failed repos
            }
        }
    } catch (e) {
        console.warn('Error fetching repos:', e.message);
    }
    
    return commits;
}

async function main() {
    console.log('🔄 Fetching GitHub contributions for', USERNAME);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - DAYS_TO_FETCH);
    
    // Load existing historical data
    let historicalData = { contributions: {} };
    try {
        if (fs.existsSync(DATA_FILE)) {
            historicalData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (e) {
        console.warn('Could not load historical data, starting fresh');
    }
    
    console.log(`📊 Existing historical entries: ${Object.keys(historicalData.contributions || {}).length}`);
    
    // Fetch fresh data
    console.log(`📡 Fetching data from ${formatDate(startDate)} to ${formatDate(endDate)}...`);
    
    const [events, repoCommits] = await Promise.all([
        getRecentGitHubEvents(USERNAME, startDate),
        getRecentCommitsFromRepos(USERNAME, startDate)
    ]);
    
    console.log(`  ✓ Found ${events.length} events`);
    console.log(`  ✓ Found ${repoCommits.length} commit references`);
    
    // Build contributions map
    const newContributions = {};
    const current = new Date(startDate);
    while (current <= endDate) {
        newContributions[formatDate(current)] = 0;
        current.setDate(current.getDate() + 1);
    }
    
    events.forEach(event => {
        const eventDate = formatDate(new Date(event.created_at));
        if (newContributions.hasOwnProperty(eventDate)) {
            if (event.type === 'PushEvent') {
                newContributions[eventDate] += event.payload?.commits?.length || 1;
            } else if (['PullRequestEvent', 'IssuesEvent', 'CreateEvent', 'PullRequestReviewEvent'].includes(event.type)) {
                newContributions[eventDate] += 1;
            }
        }
    });
    
    repoCommits.forEach(commitDate => {
        if (newContributions.hasOwnProperty(commitDate)) {
            newContributions[commitDate] += 1;
        }
    });
    
    // Merge with historical data (keep max for each date)
    const mergedContributions = { ...(historicalData.contributions || {}) };
    for (const [date, count] of Object.entries(newContributions)) {
        mergedContributions[date] = Math.max(mergedContributions[date] || 0, count);
    }
    
    // Sort by date
    const sortedContributions = {};
    Object.keys(mergedContributions).sort().forEach(date => {
        sortedContributions[date] = mergedContributions[date];
    });
    
    // Calculate stats
    const totalContributions = Object.values(sortedContributions).reduce((a, b) => a + b, 0);
    const dateRange = Object.keys(sortedContributions);
    
    // Save updated data
    const outputData = {
        lastUpdated: new Date().toISOString(),
        username: USERNAME,
        totalContributions: totalContributions,
        dateRange: {
            start: dateRange[0],
            end: dateRange[dateRange.length - 1]
        },
        contributions: sortedContributions
    };
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(outputData, null, 2));
    
    console.log(`\n✅ Updated ${DATA_FILE}`);
    console.log(`   📈 Total entries: ${Object.keys(sortedContributions).length}`);
    console.log(`   📊 Total contributions: ${totalContributions}`);
    console.log(`   📅 Date range: ${dateRange[0]} to ${dateRange[dateRange.length - 1]}`);
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
