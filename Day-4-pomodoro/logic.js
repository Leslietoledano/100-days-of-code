document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('start-timer-btn')
        .addEventListener('click',startSesion);

    //Generate one on load
    //startSesion();
});

let globalIntervalId = null;
let currentSesion = 0;

function startSesion(){
    //Clear any existing intervals
    if (globalIntervalId) {
        clearInterval(globalIntervalId);
    }

    let selectedTime = document.querySelector('input[name="time"]:checked').value;
    let sessionsCounter = document.getElementById('sessions-count').value;
    let selectedBreak = document.querySelector('input[name="break"]:checked').value;

    //Starting the first session
    currentSesion = 1;
    let totalSeconds = parseInt(selectedTime) * 60;
    let totalBreakSeconds = parseInt(selectedBreak) * 60;

    let sessionData = {
        totalSeconds,
        totalBreakSeconds,
        sessionsCounter,
        selectedTime,
    };
    
    startTimer('work', sessionData);

}

function startTimer(mode, sessionData) {
    let { totalSeconds, totalBreakSeconds, sessionsCounter, selectedTime } = sessionData;
    let isWorkMode = mode === 'work';

    //Determine duration and display text
    let duration = isWorkMode ? totalSeconds : totalBreakSeconds;
    let timerDisplay = document.getElementById('sesion-timer');
    let currentSesionModeDisplay = document.getElementById('current-session-mode');
    let totalSesionsDisplay = document.getElementById('total-sessions');

    totalSesionsDisplay.textContent =  `${currentSesion} of ${sessionsCounter}`;
    currentSesionModeDisplay.textContent = `${isWorkMode ? 'Focus Time' : 'Break'}`;

    //Update the UI
    document.body.className = isWork ? 'work-phase' : 'break-phase';

    //Countdown logic
    globalIntervalId = setInterval(() => {

        // Stop the current interval
        if (duration <= 0) {
            clearInterval(globalIntervalId);
            globalIntervalId = null;

            console.log(`${mode} phase ended.`);

            if(isWorkMode){
                if (currentSession < sessionsCounter) {
                    startTimer('break', sessionData);
                } else {
                    // All sessions complete
                    timerDisplay.textContent = "DONE!";
                    document.body.className = 'finished';
                    console.log("All sessions finished!");
                }
            }
            else{

            }
        }

    });


}






function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}