function initPage3(userData) {
    const ratingChanges = userData.user_rating_changes;

    if (ratingChanges.length === 0) {
        document.getElementById('rating-chart-container').innerHTML = '<p>No rating changes available for 2024.</p>';
        return;
    }

    const dates = ratingChanges.map(rc => new Date(rc.ratingUpdateTimeSeconds * 1000));
    const ratings = ratingChanges.map(rc => rc.newRating);

    const startRating = ratingChanges[0].oldRating;
    const maxRating = Math.max(...ratings);
    const maxRatingIndex = ratings.indexOf(maxRating);
    const maxRatingDate = new Date(ratingChanges[maxRatingIndex].ratingUpdateTimeSeconds * 1000);
    const maxRank = ratingChanges[maxRatingIndex].rank || 'Unknown';

    document.getElementById('rating-progress-text').textContent = `In 2024, you started at ${startRating} and reached a peak of ${maxRating}!`;
    document.getElementById('highest-rank-text').textContent = `Your highest rank in 2024 was ${maxRank}, achieved on ${maxRatingDate.toLocaleDateString()}.`;

    generateRatingGraph(dates, ratings);
}
function generateRatingGraph(dates, ratings) {
    const ctx = document.getElementById('rating-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(date => date.toLocaleDateString()),
            datasets: [{
                label: 'Rating',
                data: ratings,
                borderColor: '#ffd700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#ffd700',
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'category',
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: '#fff'
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