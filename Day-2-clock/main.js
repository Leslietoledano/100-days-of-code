function drawSeconds(){
    console.log('hola');
    const bar_element = document.querySelector(".bar-element");
    let bar_items = [];
    console.log(bar_element);

    for( let i=1; i <= 60; i++){
        bar_items.push(`<span style="--index:${i};"><p></p></span>`);
    }

    bar_element.insertAdjacentHTML("afterbegin",bar_items.join(""));
}



function setDate (){
    //Get Current Seconds
    const current_date = new Date();
    const seconds = current_date.getSeconds();
    const minutes = current_date.getMinutes();
    const hours = current_date.getHours();

    //Get All Hands
    const seconds_hand = document.querySelector(".clock-seconds");
    const minutes_hand = document.querySelector(".clock-minutes");
    const hours_hand = document.querySelector(".clock-hours");

    //Clock Logic

    /** One Lap are 60 seconds for the 'Seconds Hand'
    /*  > Meaning that 60 seconds = 360deg
    /*  > 1 second = 360 / 60 
    /*  > 1 second = 6 deg */    
    fullCircle(seconds,seconds_hand);
    seconds_hand.style.transform = `rotate(${(seconds * 6)+90}deg)`;


    /** One Lap are 60 minutes for the 'Minutes Hand'
    /*  > Meaning that 60 minutes = 360deg
    /*  > 1 minutes = 360 / 60 
    /*  > 1 minutes = 6 deg */
    fullCircle(minutes,minutes_hand);
    minutes_hand.style.transform = `rotate(${(minutes * 6)+90}deg)`;


    /** One Lap are 12 hours for the 'Hours Hand'
    /*  > Meaning that 60 minutes = 360deg
    /*  > 1 hour = 360 / 12 
    /*  > 1 hour = 30 deg 
    /*  > 1 hour = 60 min ..... 60 min = 30deg .... 1 minute = 30/60 
    /*  > 1 minute = 0.5 deg or 1/2 deg */
    fullCircle(hours,hours_hand);
    hours_hand.style.transform = `translate(-100%,-50%) rotate(${((hours * 30 )+ (minutes/2))+90}deg)`;



    function fullCircle(time,hand){
        if (time == 0){
            hand.classList.add('full-circle');
        }
        else if(hand.classList.contains('full-circle')){
            hand.classList.remove('full-circle');
        }
    }

}

setInterval(setDate,1000);
document.addEventListener("DOMContentLoaded", function(event) { 
    drawSeconds();
  });