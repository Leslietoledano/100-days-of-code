document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('start-timer-btn')
        .addEventListener('click',startSesion);

    startSesion();
});

function startSesion(){
    console.log("Hello im running");
}

