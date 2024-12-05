function initPage12(userData) {
    const submissions = userData.user_submissions;
    const ratingChanges = userData.user_rating_changes;
    
    displayTotalSolved(submissions);
    displayRatings(ratingChanges);
    displayRatingProgression(ratingChanges);
    displayTopTags(submissions);
    displayLanguagesUsed(submissions);
    displayFastestSolve(submissions);
    displayChallengingProblem(submissions);
    displayLatestSolve(submissions, userData.timeZone);
    displayWeekdayDistribution(submissions);
}

function displayTotalSolved(submissions) {
    const totalSolved = submissions.filter(s => s.verdict === "OK").length;
    document.getElementById('total-solved').textContent = totalSolved;
}

function displayRatings(ratingChanges) {
    const currentRating = ratingChanges.length > 0 ? ratingChanges[ratingChanges.length - 1].newRating : 'N/A';
    const maxRating = Math.max(...ratingChanges.map(rc => rc.newRating), 0) || 'N/A';
    
    document.getElementById('current-rating').textContent = currentRating;
    document.getElementById('max-rating').textContent = maxRating;
}

function displayRatingProgression(ratingChanges) {
    const ctx = document.getElementById('rating-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ratingChanges.map(rc => new Date(rc.ratingUpdateTimeSeconds * 1000).toLocaleDateString()),
            datasets: [{
                label: 'Rating',
                data: ratingChanges.map(rc => rc.newRating),
                borderColor: '#ffd700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                fill: true,
                tension: 0.4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { beginAtZero: false, ticks: { color: '#fff' } }
            }
        }
    });
}

function displayTopTags(submissions) {
    const tagCounts = countTags(submissions.filter(s => s.verdict === "OK"));
    const topTags = getTopTags(tagCounts, 10);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
    
    const ctx = document.getElementById('tags-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topTags.map(tag => tag[0]),
            datasets: [{
                data: topTags.map(tag => tag[1]),
                backgroundColor: colors,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#fff', maxRotation: 90, minRotation: 45 },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

function displayLanguagesUsed(submissions) {
    const languageCounts = countLanguages(submissions);
    const totalSubmissions = submissions.length;
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    
    const languages = Object.keys(languageCounts);
    const data = Object.values(languageCounts).map(count => ((count / totalSubmissions) * 100).toFixed(1));
    
    const ctx = document.getElementById('languages-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: languages,
            datasets: [{
                data: data,
                backgroundColor: colors,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });

    createLegend('languages-legend', languages, colors, data);
}

function displayFastestSolve(submissions) {
    const fastestSolve = findFastestSolve(submissions);
    if (fastestSolve) {
        const solveTime = formatTime(fastestSolve.relativeTimeSeconds);
        document.getElementById('fastest-solve').textContent = `${fastestSolve.problem.name} (${solveTime})`;
    } else {
        document.getElementById('fastest-solve').textContent = "N/A";
    }
}

function displayChallengingProblem(submissions) {
    const challengingProblem = findMostChallengingProblem(submissions);
    if (challengingProblem) {
        document.getElementById('challenging-problem').textContent = `${challengingProblem.problem.name} (${challengingProblem.attempts} attempts)`;
    } else {
        document.getElementById('challenging-problem').textContent = "N/A";
    }
}

function displayLatestSolve(submissions, timeZone) {
    const latestSolve = findLatestSolve(submissions, timeZone);
    if (latestSolve) {
        const solveDate = new Date(latestSolve.creationTimeSeconds * 1000);
        const formattedTime = solveDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: timeZone
        });
        document.getElementById('latest-solve').textContent = `${latestSolve.problem.name} at ${formattedTime}`;
    } else {
        document.getElementById('latest-solve').textContent = "N/A";
    }
}

function displayWeekdayDistribution(submissions) {
    const weekdayDistribution = getWeekdayDistribution(submissions);
    
    const ctx = document.getElementById('weekday-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weekdayDistribution.map(d => d.day.substr(0, 3)),
            datasets: [{
                data: weekdayDistribution.map(d => d.count),
                backgroundColor: 'rgba(255, 215, 0, 0.6)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

function countTags(submissions) {
    const tagCounts = {};
    submissions.forEach(submission => {
        if (submission.problem && submission.problem.tags) {
            submission.problem.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
    });
    return tagCounts;
}

function getTopTags(tagCounts, limit) {
    return Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
}

function countLanguages(submissions) {
    const languageCounts = {};
    submissions.forEach(submission => {
        const language = submission.programmingLanguage;
        languageCounts[language] = (languageCounts[language] || 0) + 1;
    });
    return languageCounts;
}

function findFastestSolve(submissions) {
    const solvedSubmissions = submissions.filter(submission => submission.verdict === "OK");
    
    if (solvedSubmissions.length === 0) {
        return null;
    }

    return solvedSubmissions.reduce((fastest, current) => {
        const currentTime = current.relativeTimeSeconds;
        return currentTime < fastest.relativeTimeSeconds ? current : fastest;
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
        return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    } else if (remainingSeconds === 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    }
}

function findMostChallengingProblem(submissions) {
    const problemAttempts = {};
    let mostAttemptedProblem = null;
    let maxAttempts = 0;

    submissions.forEach(submission => {
        const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
        if (!problemAttempts[problemId]) {
            problemAttempts[problemId] = {
                problem: submission.problem,
                attempts: 0,
                solved: false,
                solveTime: null
            };
        }
        problemAttempts[problemId].attempts++;
        if (submission.verdict === "OK" && !problemAttempts[problemId].solved) {
            problemAttempts[problemId].solved = true;
            problemAttempts[problemId].solveTime = submission.creationTimeSeconds;
        }
    });

    for (const [problemId, data] of Object.entries(problemAttempts)) {
        if (data.solved && data.attempts > maxAttempts) {
            maxAttempts = data.attempts;
            mostAttemptedProblem = { ...data, problemId };
        }
    }

    return mostAttemptedProblem;
}

function findLatestSolve(submissions, timeZone) {
    let latestSolve = null;
    let latestTime = new Date(0); // Initialize with the earliest possible date

    submissions.forEach(submission => {
        if (submission.verdict === "OK") {
            const solveDate = new Date(submission.creationTimeSeconds * 1000);
            const localSolveTime = new Date(solveDate.toLocaleString('en-US', { timeZone: timeZone }));
            
            // Check if the solve time is between midnight and 6:00 AM
            if (localSolveTime.getHours() < 6 || localSolveTime.getHours() === 23) {
                if (localSolveTime > latestTime) {
                    latestTime = localSolveTime;
                    latestSolve = submission;
                }
            }
        }
    });

    return latestSolve;
}

function getWeekdayDistribution(submissions) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const distribution = Array(7).fill(0);
    
    submissions.forEach(submission => {
        const date = new Date(submission.creationTimeSeconds * 1000);
        distribution[date.getDay()]++;
    });
    
    return weekdays.map((day, index) => ({ day, count: distribution[index] }));
}

function createLegend(elementId, labels, colors, data) {
    const legendElement = document.getElementById(elementId);
    legendElement.innerHTML = '';
    
    labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[index];
        
        const labelText = document.createElement('span');
        labelText.textContent = `${label} (${data[index]}%)`;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        legendElement.appendChild(legendItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPage12(userData);
});
