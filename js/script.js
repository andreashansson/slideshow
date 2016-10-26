
var slideElements = document.getElementsByClassName("slides");
var index = 0;

startSlide();

function startSlide() {

  for (var i = 0; i<slideElements.length; i++) {
    slideElements[i].style.display = "none";
  }

  index++;
  if (index>slideElements.length) {
    index = 1;
  }
  
  slideElements[index-1].style.display = "block";
  setTimeout(startSlide, 3000);

}
