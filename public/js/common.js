let modalBtn = document.getElementById("modal-btn")
let modal = document.querySelector(".modal")
let closeBtn = document.querySelector(".close-btn")

let shareBtn = document.getElementById("shareBtn")
let shareField = document.getElementById("msg")

modalBtn.onclick = function(){
	modal.style.display = "block"
}
closeBtn.onclick = function(){
	modal.style.display = "none"
}
window.onclick = function(e){
	if(e.target == modal){
		modal.style.display = "none"
	}
}


shareField.onclick = function(e){
	if (shareField.text == 0) {
		button.disabled = true;
	} else {
		button.disabled = false;
	}
}
