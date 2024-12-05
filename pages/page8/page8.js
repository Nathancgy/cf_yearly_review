function initPage8(userData) {
    const submissions = userData.user_submissions;
    const challengingProblem = findMostChallengingProblem(submissions);

    if (challengingProblem) {
        displayChallengingProblem(challengingProblem, userData.timeZone);
    } else {
        displayNoChallenges();
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

function displayChallengingProblem(challengingProblem, timeZone) {
    const detailsElement = document.getElementById('challenging-problem-details');
    const reflectionElement = document.getElementById('problem-reflection');

    const solveDate = new Date(challengingProblem.solveTime * 1000);
    const formattedDate = solveDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: timeZone
    });

    detailsElement.innerHTML = `
        <strong>${challengingProblem.problem.name}</strong> required <strong>${challengingProblem.attempts} attempts</strong> before you aced it on <strong>${formattedDate}</strong>!
    `;

    reflectionElement.innerHTML = `
        <h4>Problem Details:</h4>
        <p><strong>Difficulty:</strong> ${challengingProblem.problem.rating || 'Not rated'}</p>
        <p><strong>Tags:</strong> ${challengingProblem.problem.tags.join(', ') || 'None'}</p>
        <h4>Reflection:</h4>
        <p>This problem proved to be quite challenging, requiring multiple attempts before you successfully solved it. 
        The difficulty likely stemmed from its complex ${challengingProblem.problem.tags[0] || 'algorithm'} requirements.</p>
    `;
}

function displayNoChallenges() {
    const detailsElement = document.getElementById('challenging-problem-details');
    const reflectionElement = document.getElementById('problem-reflection');

    detailsElement.innerHTML = "You haven't faced any particularly challenging problems in 2024 yet. Keep pushing your limits!";
    reflectionElement.innerHTML = "";
}