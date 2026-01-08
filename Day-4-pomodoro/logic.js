document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('start-timer-btn')
        .addEventListener('click',startSesion);

    //Generate one on load
    //startSesion();
});

let globalIntervalId = null;
let currentSesion = 0;
let percent = 0;
const circle = document.getElementById('progress-circle');
const timerSettings = document.getElementById('timer-settings');
const main = document.querySelector('main');
const circumference = 339.292; // 2 * pi * r (r=54)

function startSesion(){
    //Clear any existing intervals
    if (globalIntervalId) {
        clearInterval(globalIntervalId);
    }

    let selectedTime = document.querySelector('input[name="time"]:checked').value;
    let selectedBreak = document.querySelector('input[name="break"]:checked').value;
    let sessionsCounter = document.getElementById('sessions-count').value;
    

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
    let isWorkMode = mode === 'work'; //This will return a true or false

    //Determine duration and display text
    let duration = isWorkMode ? totalSeconds : totalBreakSeconds; // If work mode, use totalSeconds else totalBreakSeconds
    let timerDisplay = document.getElementById('sesion-timer');
    let currentSesionModeDisplay = document.getElementById('current-session-mode');
    let totalSesionsDisplay = document.getElementById('total-sessions');

    totalSesionsDisplay.textContent =  `${selectedTime}min Session -- ${currentSesion} of ${sessionsCounter}`;
    currentSesionModeDisplay.textContent = `${isWorkMode ? 'Focus Time' : 'Break'}`;

    //Update the UI
    timerSettings.classList.add('hidden', 'transition', 'duration-800');
    main.classList.remove('md:grid-cols-2');
    

    //Countdown logic
    globalIntervalId = setInterval(() => {

        //Calculate and update progress
        percent = ((isWorkMode ? totalSeconds - duration : totalBreakSeconds - duration) / (isWorkMode ? totalSeconds : totalBreakSeconds)) * 100;
        setProgress(percent);

        // Is no more time left
        if (duration <= 0) {
            clearInterval(globalIntervalId); // Clear the interval when time is up
            globalIntervalId = null; // Reset the interval ID

            console.log(`${mode} phase ended.`);

            // Check if we need to start a break or a new work session
            if(isWorkMode){
                //This mean duration id over for work session, so start break
                if(currentSesion < sessionsCounter)
                {
                    startTimer('break', sessionData);
                }
                else{
                    timerDisplay.textContent = "Great job!";
                    currentSesionModeDisplay.textContent = `Completed`;
                    document.body.className = 'completed-phase';
                }
                
            }
            else{
                //This mean duration id over for break session, so check if we need to start a new work session
                 currentSesion++;
                if(currentSesion <= sessionsCounter){
                    startTimer('work', sessionData);
                }
            }
            
        }
        else{ // There is still time left so lets continue counting down
            duration--;
            timerDisplay.textContent = formatTime(duration);
        }

    }, 1000); // Run every second


}




function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}