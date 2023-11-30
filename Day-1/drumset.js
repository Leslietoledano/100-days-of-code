document.addEventListener("keydown", addClassToBox);
document.addEventListener("keyup", removeClassFromBox);

function addClassToBox(e){
    let pressed_value = e.key;
    console.log("Key pressed: "+pressed_value);

    const box = document.querySelector(`li[data-key="${pressed_value}"]`);
    const audio = document.querySelector(`audio[data-key="${pressed_value}"]`);
    box != null ? box.classList.add("active") : null ; 
    audio != null ? audio.play() : null ; 


}

function removeClassFromBox(e){
    let pressed_value = e.key;
    console.log("Key Unpressed: "+pressed_value);

    const box = document.querySelector(`[data-key="${pressed_value}"]`);
    const audio = document.querySelector(`audio[data-key="${pressed_value}"]`);
    
    box != null ? box.classList.remove("active") : null;
    audio != null ? audio.pause() : null ; 
}