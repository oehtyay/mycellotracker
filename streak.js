function getCurrentDate() {
    let today = new Date();
    return today.toISOString().split('T')[0]; // '2024-12-23' format
}

// Load streak data from localStorage
function loadStreakData() {
    let streak = localStorage.getItem('streak') || 0; // Default to 0 if not set
    let lastDate = localStorage.getItem('lastDate') || null;
    return { streak: parseInt(streak), lastDate };
}

// Save the updated streak data to localStorage
function saveStreakData(streak, lastDate) {
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastDate', lastDate);
}

// Handle button click
function startPractice() {
    let { streak, lastDate } = loadStreakData();
    let currentDate = getCurrentDate();

    // Check if the user has already clicked today
    if (lastDate === currentDate) {
        console.log("You've already clicked today!");
        document.getElementById("streakNum").textContent = String(streak)
        return;
    }

    // Check if the last recorded date was yesterday
    let lastDateObj = new Date(lastDate);
    let currentDateObj = new Date(currentDate);
    let dayDifference = Math.floor((currentDateObj - lastDateObj) / (1000 * 3600 * 24));

    if (dayDifference === 1) {
        // Increment streak if it's the next day
        streak++;
    } else if (dayDifference > 1) {
        // Reset streak if missed a day
        streak = 1;
    }

    // Save new streak data
    saveStreakData(streak, currentDate);
    console.log(`Your streak is: ${streak}`);
    document.getElementById("streakNum").textContent = String(streak)
}

window.onload = function() {
    let { streak } = loadStreakData();
    document.getElementById("streakNum").textContent = String(streak);
};
