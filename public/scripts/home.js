import icons from "./icons.js"

const slideshowImgs = ['000015.jpg', '000016.jpg', '000017.jpg', '000018.jpg', '000019.jpg', '000020.jpg', '000021.jpg', '000022.jpg', '000023.jpg', '000024.jpg', '000025.jpg', '000026.jpg', '000027.jpg', '000028.jpg', '000029.jpg', '000030.jpg', '000031.jpg', '000032.jpg',  '000033.jpg', '000034.jpg',  '000035.jpg', '000036.jpg',  '000037.jpg', '000039.jpg', '000041.jpg', '000045.jpg'],
	slideshowEl = document.querySelector('.slideshow'),
	slideBtn = document.querySelectorAll('.slideshow-wrapper button'),
  chevronLeft = (new icons('left-chevron', 'Scroll left')).chevronLeft(),
  chevronRight = (new icons('right-chevron', 'Scroll right')).chevronRight()

let maxScrollWidth, lastScrollTime = 0
 
appendImgs()
slideBtn.forEach(handleSlideBtns)
slideshowEl.addEventListener('scroll', handleBtns)
setInterval(autoScroll, 2000)

function appendImgs(){
  let i = 0
  const length = slideshowImgs.length,
    interval = setInterval(function(){
      const el = slideshowImgs[i],
        img = document.createElement('img')
      img.src = 'images/'+el
      img.classList.add('slideshow-img')
      slideshowEl.append(img)
        i++
          if(i === length) return clearInterval(interval)
      }, 500)
}
function handleBtns(){
  maxScrollWidth = slideshowEl.scrollWidth - slideshowEl.clientWidth
	slideBtn[0].style.display = slideshowEl.scrollLeft <= 0 ? 'none' : 'block';
	slideBtn[1].style.display = slideshowEl.scrollLeft >= maxScrollWidth ? 'none' : 'block';
}
function handleSlideBtns(btn){
  let direction = btn.classList.contains('left') ? -1 : 1;
  btn.innerHTML = btn.classList.contains('left') ? chevronLeft : chevronRight;
  btn.addEventListener('click', function(){
    let scrollWidth = setScrollWidth(slideshowEl, direction)
  	slideshowEl.scrollBy({left: scrollWidth, behavior: 'smooth'})
    lastScrollTime = 10000
    setTimeout(() => {
      autoScroll()
      lastScrollTime = 0
    }, lastScrollTime)
  })
}   
function setScrollWidth(object, direction){
  return object.clientWidth * direction
}
function autoScroll(){
  if(lastScrollTime === 0){
    let direction = slideshowEl.scrollLeft >= maxScrollWidth ? -1 * (slideshowEl.scrollWidth / slideshowEl.clientWidth) : 1;
    let scrollWidth = setScrollWidth(slideshowEl, direction)
    slideshowEl.scrollBy({left: scrollWidth, behavior: 'smooth'})
  }
}