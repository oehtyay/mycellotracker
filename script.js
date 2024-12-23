var practiceActive = false

function StartPractice() {
    if (practiceActive == false) {
        var button = document.getElementById("myButton");
        button.textContent = "Finish Practice";
        button.style.backgroundColor = "orangered";
        startTimer()
        practiceActive = true
    } else {
        var button = document.getElementById("myButton");
        button.textContent = "Log Practice";
        button.style.backgroundColor = "darkcyan";
        stopTimer()
        practiceActive = false
    }
}

let hours = 0;
let minutes = 0;
let seconds = 0;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(function() {
        seconds++; 
        
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
}

function formatTime(time) {
    return time < 10 ? "0" + time : time;
}