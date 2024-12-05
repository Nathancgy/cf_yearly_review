function initPage7(userData) {
    const submissions = userData.user_submissions;
    const fastestSolve = findFastestSolve(submissions);

    if (fastestSolve) {
        displayFastestSolve(fastestSolve);
    } else {
        displayNoSolves();
    }
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

function displayFastestSolve(fastestSolve) {
    const detailsElement = document.getElementById('fastest-solve-details');
    const descriptionElement = document.getElementById('problem-description');

    const solveDate = new Date(fastestSolve.creationTimeSeconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const solveTime = formatTime(fastestSolve.relativeTimeSeconds);

    detailsElement.innerHTML = `
        You solved <strong>${fastestSolve.problem.name}</strong> in just <strong>${solveTime}</strong> on <strong>${solveDate}</strong>.
    `;

    descriptionElement.innerHTML = `
        <h4>Problem Details:</h4>
        <p><strong>Contest:</strong> ${fastestSolve.contestName}</p>
        <p><strong>Difficulty:</strong> ${fastestSolve.problem.rating || 'Not rated'}</p>
        <p><strong>Tags:</strong> ${fastestSolve.problem.tags.join(', ') || 'None'}</p>
        <p>Great job on solving this problem so quickly! Your efficient approach demonstrates your problem-solving skills and familiarity with the topic.</p>
    `;
}

function displayNoSolves() {
    const detailsElement = document.getElementById('fastest-solve-details');
    const descriptionElement = document.getElementById('problem-description');

    detailsElement.innerHTML = "You haven't solved any problems in 2024 yet. Keep practicing!";
    descriptionElement.innerHTML = "";
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