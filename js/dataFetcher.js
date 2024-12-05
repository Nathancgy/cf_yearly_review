async function fetchUserData(handle, timeZone) {
    const timeout = 30000; // 30 seconds timeout

    const fetchWithTimeout = (url) => {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timed out')), timeout)
            )
        ]);
    };

    try {
        const [userInfoResponse, submissionsResponse, ratingResponse] = await Promise.all([
            fetchWithTimeout(`https://codeforces.com/api/user.info?handles=${handle}`),
            fetchWithTimeout(`https://codeforces.com/api/user.status?handle=${handle}`),
            fetchWithTimeout(`https://codeforces.com/api/user.rating?handle=${handle}`)
        ]);

        const [userInfoData, submissionsData, ratingData] = await Promise.all([
            userInfoResponse.json(),
            submissionsResponse.json(),
            ratingResponse.json()
        ]);

        if (userInfoData.status !== 'OK' || submissionsData.status !== 'OK' || ratingData.status !== 'OK') {
            throw new Error('Error fetching data from Codeforces API');
        }
        const startOf2024 = new Date('2024-01-01T00:00:00Z').getTime() / 1000; // Unix timestamp for start of 2024

        return {
            user_info: userInfoData.result[0],
            user_submissions: processSubmissions(submissionsData.result, timeZone, startOf2024),
            user_rating_changes: processRatings(ratingData.result, timeZone, startOf2024),
            timeZone: timeZone
        };

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function processSubmissions(submissions, timeZone, startTimestamp) {
    return submissions
        .filter(submission => submission.creationTimeSeconds >= startTimestamp)
        .map(submission => {
            submission.creationTime = convertTimestampToDate(submission.creationTimeSeconds, timeZone);
            return submission;
        });
}

function processRatings(ratings, timeZone, startTimestamp) {
    return ratings
        .filter(ratingChange => ratingChange.ratingUpdateTimeSeconds >= startTimestamp)
        .map(ratingChange => {
            ratingChange.ratingUpdateTime = convertTimestampToDate(ratingChange.ratingUpdateTimeSeconds, timeZone);
            return ratingChange;
        });
}
