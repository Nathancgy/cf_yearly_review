function initPage10(userData) {
    const submissions = userData.user_submissions;
    const timeZone = userData.timeZone;
    const latestSolve = findLatestSolve(submissions, timeZone);

    if (latestSolve) {
        displayLatestSolve(latestSolve, timeZone);
    } else {
        displayNoLateSolves();
    }
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

function displayLatestSolve(latestSolve, timeZone) {
    const detailsElement = document.getElementById('latest-solve-details');
    const reminderElement = document.getElementById('sleep-reminder');

    const solveDate = new Date(latestSolve.creationTimeSeconds * 1000);
    const localSolveTime = new Date(solveDate.toLocaleString('en-US', { timeZone: timeZone }));
    
    const formattedDate = localSolveTime.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: timeZone
    });
    
    const formattedTime = localSolveTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: timeZone
    });

    detailsElement.innerHTML = `
        Your latest night owl solve was <strong>${latestSolve.problem.name}</strong> 
        at <strong>${formattedTime}</strong> on <strong>${formattedDate}</strong>.
    `;

    reminderElement.innerHTML = `
        Remember, while late-night coding can be productive, don't forget the importance of a good night's sleep for your overall well-being and problem-solving abilities!
    `;
}

function displayNoLateSolves() {
    const detailsElement = document.getElementById('latest-solve-details');
    const reminderElement = document.getElementById('sleep-reminder');

    detailsElement.innerHTML = "You haven't solved any problems late at night in 2024. Great job maintaining a healthy sleep schedule!";
    reminderElement.innerHTML = "Keep up the good work balancing your coding practice with proper rest.";
}