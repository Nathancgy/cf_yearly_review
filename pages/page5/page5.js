function initPage5(userData) {
    const submissions = userData.user_submissions;
    const solvedSubmissions = submissions.filter(submission => submission.verdict === "OK");
    const tagCounts = countTags(solvedSubmissions);
    const topTags = getTopTags(tagCounts, 10); // Get top 10 tags

    createTagsChart(topTags);
    createTagsSummary(topTags);
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

function createTagsChart(topTags) {
    const ctx = document.getElementById('tags-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topTags.map(tag => tag[0]),
            datasets: [{
                label: 'Problems Solved',
                data: topTags.map(tag => tag[1]),
                backgroundColor: 'rgba(255, 215, 0, 0.6)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff',
                        maxRotation: 90,
                        minRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    titleColor: '#333',
                    bodyColor: '#333',
                    borderColor: '#ffd700',
                    borderWidth: 1,
                    cornerRadius: 5
                }
            }
        }
    });
}

function createTagsSummary(topTags) {
    const summaryElement = document.getElementById('tags-summary');
    let summaryHTML = `
        <h3>Your favorite topics:</h3>
        <table class="tags-table">
            <thead>
                <tr>
                    <th>Topic</th>
                    <th>Problems Solved</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    topTags.forEach(([tag, count]) => {
        summaryHTML += `
            <tr>
                <td>${tag}</td>
                <td>${count}</td>
            </tr>
        `;
    });
    
    summaryHTML += `
            </tbody>
        </table>
    `;
    summaryElement.innerHTML = summaryHTML;
}
