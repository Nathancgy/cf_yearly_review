function initPage6(userData) {
    const submissions = userData.user_submissions;
    const languageCounts = countLanguages(submissions);
    const totalSubmissions = submissions.length;

    createLanguagesChart(languageCounts, totalSubmissions);
    createLanguagesSummary(languageCounts, totalSubmissions);
}

function countLanguages(submissions) {
    const languageCounts = {};
    submissions.forEach(submission => {
        const language = submission.programmingLanguage;
        languageCounts[language] = (languageCounts[language] || 0) + 1;
    });
    return languageCounts;
}

function createLanguagesChart(languageCounts, totalSubmissions) {
    const ctx = document.getElementById('languages-chart').getContext('2d');
    const languages = Object.keys(languageCounts);
    const counts = Object.values(languageCounts);
    const percentages = counts.map(count => ((count / totalSubmissions) * 100).toFixed(1));

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: languages,
            datasets: [{
                data: percentages,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#C9CBCF', '#7CFC00', '#8B008B'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

function createLanguagesSummary(languageCounts, totalSubmissions) {
    const summaryElement = document.getElementById('languages-summary');
    const sortedLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1]);
    
    const mainLanguage = sortedLanguages[0];
    const mainPercentage = ((mainLanguage[1] / totalSubmissions) * 100).toFixed(1);
    
    let summaryHTML = `<p>You coded in <strong>${mainLanguage[0]}</strong> for <strong>${mainPercentage}%</strong> of your submissions.</p>`;
    
    if (sortedLanguages.length > 1) {
        summaryHTML += "<p>Explored other languages like ";
        const otherLanguages = sortedLanguages.slice(1, 4).map(lang => lang[0]);
        summaryHTML += otherLanguages.join(', ') + ".</p>";
    }
    
    summaryElement.innerHTML = summaryHTML;
}