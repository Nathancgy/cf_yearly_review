function initPage2(userData) {
    const submissions = userData.user_submissions;
    const totalSubmissions = submissions.length;
    const uniqueProblemsSet = new Set(submissions.map(s => `${s.problem.contestId}-${s.problem.index}`));
    const uniqueProblems = uniqueProblemsSet.size;
    const contestsParticipated = userData.user_rating_changes.length;

    document.getElementById('total-submissions').textContent = totalSubmissions;
    document.getElementById('unique-problems').textContent = uniqueProblems;
    document.getElementById('contests-participated').textContent = contestsParticipated;
    document.getElementById('year-summary').textContent = `In 2024, you've made ${totalSubmissions} submissions, solved ${uniqueProblems} unique problems, and participated in ${contestsParticipated} contests!`;
}