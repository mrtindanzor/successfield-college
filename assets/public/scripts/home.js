const slideshowWrapper = document.querySelector('.slideshow-wrapper'),
imgs = ['000015.jpg', '000016.jpg', '000017.jpg', '000018.jpg', '000019.jpg', '000020.jpg', '000021.jpg', '000022.jpg', '000023.jpg', '000024.jpg', '000025.jpg', '000026.jpg', '000027.jpg', '000028.jpg', '000029.jpg', '000030.jpg', '000031.jpg', '000033.jpg', '000034.jpg',  '000035.jpg', '000036.jpg',  '000037.jpg', '000039.jpg', '000041.jpg', '000045.jpg', '000046.jpg']

let i = 1
imgs.forEach(el => {
  const img = document.createElement('img')
  img.classList.add('slideshow')
  img.src = `images/${el}`
  if(i === 1) img.classList.add('active')
  slideshowWrapper.append(img)
  i++
})

const slides = document.querySelectorAll('.slideshow')
function slideshow(slides){
  let currentIndex = 0
  
  setInterval(() => {
    slides[currentIndex].classList.remove('active')
  currentIndex = (currentIndex + 1) % slides.length

  slides[currentIndex].classList.add('active')
  }, 3000)
}
slideshow(slides)