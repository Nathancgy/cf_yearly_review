function initPage4(userData) {
    const submissions = userData.user_submissions;
    
    if (submissions.length > 0) {
        // Sort submissions by creation time in ascending order
        submissions.sort((a, b) => a.creationTimeSeconds - b.creationTimeSeconds);

        const firstSubmission = submissions[0];
        const lastSubmission = submissions[submissions.length - 1];

        updateSubmissionInfo('first', firstSubmission);
        updateSubmissionInfo('last', lastSubmission);
    } else {
        document.querySelector('.submissions-page').innerHTML = '<h2>No submissions found for 2024</h2>';
    }
}

function updateSubmissionInfo(type, submission) {
    const problemName = document.getElementById(`${type}-problem-name`);
    const problemMeta = document.getElementById(`${type}-problem-meta`);

    const submissionDate = new Date(submission.creationTimeSeconds * 1000).toLocaleDateString();
    const problemTags = submission.problem.tags.join(', ');
    const problemRating = submission.problem.rating || 'Unrated';

    problemName.textContent = `${submission.problem.name} (${submission.problem.index})`;
    problemMeta.innerHTML = `
        Solved on: ${submissionDate}<br>
        Difficulty: ${problemRating}<br>
        Tags: ${problemTags}
    `;
}