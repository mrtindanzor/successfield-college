const courseListBtn = document.querySelector('.course-list-button'),
  logoContainer = document.querySelector('.logo-container'),
  loader = document.querySelector('nav .loader'),
  loadSlider = document.querySelector('.loader .loading-slide'),
  menuBtn = document.querySelector('.menu-button'),
  dateContainer = document.querySelector('.date-year'),
  currentYear = new Date().getFullYear(),
  svgs = document.querySelectorAll('svg'),
  hideShow = (object, display= 'block') => {
    const currentDisplay = window.getComputedStyle(object).display;
    
    if(currentDisplay === 'none'){
        object.style.display = display   
      object.style.flexDirection = 'column'
    } else {
      object.style.display = 'none'
    }
  },
  menuList = document.querySelector('ul.menu-list'),
  courseList = document.querySelector('.course-list-menu')

animateSlider()
setInterval(animateSlider, 600)
  
let prompt, deleteBtn, denyBtn, confirmBtn
svgs.forEach(el => {
  el.style.opacity = 1
})

logoContainer.addEventListener('click', () => {
  window.location.href ='/'
})
if(menuBtn){
  menuBtn.addEventListener('click', () => {
  hideShow(menuList, 'flex')
})

courseListBtn.addEventListener('click', () => {
  hideShow(courseList)
})
}
if(dateContainer) dateContainer.textContent = currentYear
document.addEventListener('click', (e) => {
  if(menuBtn){
    if(!menuBtn.contains(e.target) && !menuList.contains(e.target)) {
      courseList.style.display = 'none'
      menuList.style.display = 'none'
    }
  }
})

function animateSlider(){
  if(loadSlider.classList.contains('active')) return loadSlider.classList.remove('active')
  return loadSlider.classList.add('active')
}