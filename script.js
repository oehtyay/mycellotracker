var practiceActive = false;

function StartPractice() {
    if (practiceActive == false) {
        var button = document.getElementById("myButton");
        button.textContent = "Finish Practice";
        button.style.backgroundColor = "orangered";
        startTimer();
        practiceActive = true;
    } else {
        var button = document.getElementById("myButton");
        button.textContent = "Log Practice";
        button.style.backgroundColor = "darkcyan";
        practiceAlert();
        stopTimer();
        practiceActive = false;
    }
}

let hours = 0;
let minutes = 0;
let seconds = 0;
let trueseconds = 0;
let timerInterval;
let finalTime;

function startTimer() {
    trueseconds = 0;
    timerInterval = setInterval(function () {
        seconds++;
        trueseconds++;

        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        if (minutes === 60) {
            minutes = 0;
            hours++;
        }

        document.getElementById("practiceTimer").textContent =
            `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);

    // Save total practice time
    let { totalPracticeTime, startDate } = loadPracticeData();
    totalPracticeTime += trueseconds / 60; // Add current session time to total practice time
    savePracticeData(totalPracticeTime, startDate);

    hours = 0;
    minutes = 0;
    seconds = 0;
}

function formatTime(time) {
    return time < 10 ? "0" + time : time;
}

function getCurrentDate() {
    let today = new Date();
    return today.toISOString().split('T')[0]; // '2024-12-23' format
}

// Load practice data from localStorage
function loadPracticeData() {
    let totalPracticeTime = parseFloat(localStorage.getItem('totalPracticeTime')) || 0;
    let startDate = localStorage.getItem('startDate') || null;
    return { totalPracticeTime, startDate };
}

// Save the updated practice data to localStorage
function savePracticeData(totalPracticeTime, startDate) {
    localStorage.setItem('totalPracticeTime', totalPracticeTime);
    localStorage.setItem('startDate', startDate);
    if (localStorage.getItem('yesterdayAverage') === null) {
        localStorage.setItem('yesterdayAverage', 0);
        localStorage.setItem('dayChange', getCurrentDate());
    }
}

// Calculate the average practice time per day since the start date
function calculateAveragePracticeTime() {
    let { totalPracticeTime, startDate } = loadPracticeData();
    if (!startDate) return 0;

    let currentDate = new Date();
    let startDateObj = new Date(startDate);
    let daysDifference = Math.floor((currentDate - startDateObj) / (1000 * 3600 * 24)) + 1;

    if (getCurrentDate() !== localStorage.getItem('dayChange')) {
        localStorage.setItem('dayChange', getCurrentDate())
        if (daysDifference - 1 > 0) {
            let newYesterdayValue = totalPracticeTime / (daysDifference - 1)
            localStorage.setItem('yesterdayAverage', newYesterdayValue)
        }
    }
    return totalPracticeTime / daysDifference;
}

// Display the average practice time per day
function displayAveragePracticeTime() {
    let averagePracticeTime = calculateAveragePracticeTime();
    let hours = Math.floor(averagePracticeTime / 60);
    let minutes = Math.round(averagePracticeTime % 60);
    document.getElementById('averagePracticeTimeDisplay').textContent = `${hours}h and ${minutes}min`;
    updateArrow(averagePracticeTime);
}

// Initialize practice data if not already set
function initializePracticeData() {
    let { totalPracticeTime, startDate } = loadPracticeData();
    if (!startDate) {
        startDate = new Date().toISOString().split('T')[0]; // Set to YYYY-MM-DD format
        savePracticeData(totalPracticeTime, startDate);
    }

    displayAveragePracticeTime();
}

// New practice alert function
function practiceAlert() {
    if (confirm('You practiced for ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds. Take me to another person to confirm!')) {
        initializePracticeData();
    } else {
        trueseconds = 0;
    }
}

function updateArrow(newPracTime) {
    const arrow = document.getElementById('arrow');
    if (newPracTime > localStorage.getItem('yesterdayAverage')) {
        arrow.src = 'images/greenarrow.png';
    } else if (newPracTime < localStorage.getItem('yesterdayAverage')) {
        arrow.src = 'images/redarrow.png';
    } else if (newPracTime = localStorage.getItem('yesterdayAverage')) {
        arrow.src = 'images/equal.png';
    }
}

// Call this on page load to ensure practice data is initialized
window.onload = initializePracticeData();

