function initPage11(userData) {
    const submissions = userData.user_submissions;
    const highestRatedProblem = findHighestRatedProblem(submissions);

    if (highestRatedProblem) {
        displayHighestRatedProblem(highestRatedProblem, userData.timeZone);
    } else {
        displayNoHighRatedProblems();
    }
}

function findHighestRatedProblem(submissions) {
    let highestRatedProblem = null;
    let highestRating = 0;

    submissions.forEach(submission => {
        if (submission.verdict === "OK" && submission.problem.rating > highestRating) {
            highestRating = submission.problem.rating;
            highestRatedProblem = submission;
        }
    });

    return highestRatedProblem;
}

function displayHighestRatedProblem(problem, timeZone) {
    const titleElement = document.getElementById('highest-rated-title');
    const detailsElement = document.getElementById('highest-rated-details');
    const significanceElement = document.getElementById('significance');

    const solveDate = new Date(problem.creationTimeSeconds * 1000);
    const formattedDate = solveDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: timeZone
    });

    titleElement.textContent = `Conquered a ${problem.problem.rating}-rated problem!`;

    detailsElement.innerHTML = `
        You solved <strong>${problem.problem.name}</strong> on <strong>${formattedDate}</strong>.
    `;

    significanceElement.innerHTML = `
        Tackling high-rated problems like this demonstrates your growing problem-solving skills 
        and your ability to handle complex algorithmic challenges. Keep pushing your limits!
    `;
}

function displayNoHighRatedProblems() {
    const titleElement = document.getElementById('highest-rated-title');
    const detailsElement = document.getElementById('highest-rated-details');
    const significanceElement = document.getElementById('significance');

    titleElement.textContent = "Keep Aiming Higher!";
    detailsElement.innerHTML = "You haven't solved any rated problems in 2024 yet.";
    significanceElement.innerHTML = `
        Don't worry! Rated problems can be challenging. Keep practicing, and you'll 
        soon conquer those high-rated problems. Every attempt is a step towards improvement!
    `;
}