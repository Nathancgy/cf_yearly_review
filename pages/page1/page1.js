function initPage1(userData) {
    const user = userData.user_info;
    const latestRating = userData.user_rating_changes.length > 0 
        ? userData.user_rating_changes[userData.user_rating_changes.length - 1].newRating 
        : user.rating;
    const latestRank = userData.user_rating_changes.length > 0
        ? userData.user_rating_changes[userData.user_rating_changes.length - 1].rank
        : user.rank;

    document.getElementById('user-avatar').src = user.titlePhoto;
    document.getElementById('user-name').textContent = `Welcome, ${user.firstName || user.handle}!`;
    document.getElementById('current-rating').textContent = latestRating || 'N/A';
    document.getElementById('current-rank').textContent = `Current Rating (${latestRank || 'Unrated'})`;
    
    // For max rating, we'll use the max from 2024 or 'N/A' if no contests in 2024
    const maxRating2024 = Math.max(...userData.user_rating_changes.map(rc => rc.newRating), 0);
    const maxRatingChange = userData.user_rating_changes.find(rc => rc.newRating === maxRating2024);
    
    document.getElementById('max-rating').textContent = maxRating2024 || 'N/A';
    document.getElementById('max-rank').textContent = `Max Rating in 2024 (${maxRatingChange ? maxRatingChange.rank : 'Unrated'})`;

    if (user.city || user.country) {
        document.getElementById('location-item').style.display = 'block';
        document.getElementById('location').textContent = `${user.city ? user.city + ', ' : ''}${user.country || ''}`;
    }
    if (user.organization) {
        document.getElementById('organization-item').style.display = 'block';
        document.getElementById('organization').textContent = user.organization;
    }
}