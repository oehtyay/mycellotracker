var practiceActive = false;

let wakeLock = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake lock is active');
    
    // Reapply wake lock if the tab becomes visible again
    document.addEventListener('visibilitychange', async () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    });
  } catch (err) {
    console.error('Failed to activate wake lock:', err);
  }
}

// Call this function to release the wake lock if needed
function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
    console.log('Wake lock is released');
  }
}

function StartPractice() {
    if (practiceActive == false) {
        var button = document.getElementById("myButton");
        button.textContent = "Finish Practice";
        button.style.backgroundColor = "orangered";
        startTimer();
        practiceActive = true;
        requestWakeLock();
    } else {
        var button = document.getElementById("myButton");
        button.textContent = "Log Practice";
        button.style.backgroundColor = "darkcyan";
        practiceAlert();
        stopTimer();
        practiceActive = false;
        releaseWakeLock();
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

    let { totalPracticeTime, startDate } = loadPracticeData();
    totalPracticeTime += trueseconds / 60; 
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
    return today.toISOString().split('T')[0]; 
}

function getDate() {
    let recordDate = new Date();
    let day = recordDate.getDate();
    let month = recordDate.getMonth() + 1;
    let year = recordDate.getFullYear();
    return `${day}/${month}/${year}`;
}

function loadPracticeData() {
    let totalPracticeTime = parseFloat(localStorage.getItem('totalPracticeTime')) || 0;
    let startDate = localStorage.getItem('startDate') || null;
    return { totalPracticeTime, startDate };
}

function savePracticeData(totalPracticeTime, startDate) {
    localStorage.setItem('totalPracticeTime', totalPracticeTime);
    localStorage.setItem('startDate', startDate);
    if (localStorage.getItem('yesterdayAverage') === null) {
        localStorage.setItem('yesterdayAverage', 0);
        localStorage.setItem('dayChange', getCurrentDate());
    }
}

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

function displayAveragePracticeTime() {
    let averagePracticeTime = calculateAveragePracticeTime();
    let hours = Math.floor(averagePracticeTime / 60);
    let minutes = Math.round(averagePracticeTime % 60);
    document.getElementById('averagePracticeTimeDisplay').textContent = `${hours}h and ${minutes}min`;
    updateArrow(averagePracticeTime);
}

function initializePracticeData() {
    let { totalPracticeTime, startDate } = loadPracticeData();
    if (!startDate) {
        startDate = new Date().toISOString().split('T')[0];
        savePracticeData(totalPracticeTime, startDate);
    }

    displayRecords();
    displayAveragePracticeTime();
}

function practiceAlert() {
    if (confirm('You practiced for ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds. Is this correct?')) {
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

function calculateRecordTime(seconds) {
    let totalMinutes = Math.round(seconds / 60);
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    return `${hours}h and ${minutes}min`;
}

function displayRecords() {
    if (localStorage.getItem('recordTime') === null) {
        localStorage.setItem('recordTime', 0);
        localStorage.setItem('pracDate', "Let's start to Practice!");
        localStorage.setItem('recordStreak', 0);
        localStorage.setItem('streakDate', 'Start a new Streak!');
    }

    const displayRecord = document.getElementById("recordTime");
    const displayDay = document.getElementById('dayPractice');

    if (trueseconds > localStorage.getItem('recordTime')) {
        localStorage.setItem('recordTime', trueseconds);
        localStorage.setItem('pracDate', getDate());
        displayRecord.textContent = calculateRecordTime(localStorage.getItem('recordTime'));
        displayDay.textContent = localStorage.getItem('pracDate');
    } else {
        displayRecord.textContent = calculateRecordTime(localStorage.getItem('recordTime'));
        displayDay.textContent = localStorage.getItem('pracDate');
    }

    const displayStreakRecord = document.getElementById('recordStreak');
    const displayStreakDay = document.getElementById('dayStreak');

    if (localStorage.getItem('streak') > localStorage.getItem('recordStreak')) {
        localStorage.setItem('recordStreak', localStorage.getItem('streak'));
        localStorage.setItem('streakDate', getDate());
        displayStreakRecord.textContent = `${localStorage.getItem('recordStreak')} Day(s)`;
        displayStreakDay.textContent = localStorage.getItem('streakDate');
    } else {
        displayStreakRecord.textContent = `${localStorage.getItem('recordStreak')} Day(s)`;
        displayStreakDay.textContent = localStorage.getItem('streakDate');
    }
}

function checkName() {
    if (localStorage.getItem('username') === null) {
        window.location.href = 'assignName.html';
    } else {
        document.getElementById('title').textContent = `Welcome, ${localStorage.getItem('username')}`;
        initializePracticeData();
    }
}

function eraseData() {
    if (confirm('Are you sure you want to erase all data on this device? This cannot be undone.')) {
        localStorage.clear();
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } else {

    }
}

window.addEventListener('beforeunload', releaseWakeLock);

window.onload = checkName();

