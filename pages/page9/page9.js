function initPage9(userData) {
    const submissions = userData.user_submissions;
    const weekdayDistribution = getWeekdayDistribution(submissions);
    
    createWeekdayChart(weekdayDistribution);
    displayActivitySummary(weekdayDistribution, submissions);
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

function createWeekdayChart(weekdayDistribution) {
    const ctx = document.getElementById('weekday-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weekdayDistribution.map(d => d.day),
            datasets: [{
                label: 'Submissions',
                data: weekdayDistribution.map(d => d.count),
                backgroundColor: 'rgba(255, 215, 0, 0.6)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
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
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function displayActivitySummary(weekdayDistribution, submissions) {
    const summaryElement = document.getElementById('activity-summary');
    const totalSubmissions = submissions.length;
    const activeDays = submissions.reduce((days, submission) => {
        const date = new Date(submission.creationTimeSeconds * 1000).toDateString();
        return days.add(date);
    }, new Set()).size;
    
    const mostActiveDay = weekdayDistribution.reduce((max, current) => 
        current.count > max.count ? current : max
    );
    
    summaryElement.innerHTML = `
        <p>Most active on <strong>${mostActiveDay.day}s</strong>.</p>
        <p>You submitted code on <strong>${activeDays}</strong> days this year!</p>
        <p>Total submissions: <strong>${totalSubmissions}</strong></p>
    `;
}