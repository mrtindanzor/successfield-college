const courseListBtn = document.querySelector('.course-list-button'),
  logoContainer = document.querySelector('.logo-container'),
  loader = document.querySelector('.loader'),
  menuBtn = document.querySelector('.menu-button'),
  dateContainer = document.querySelector('.date-year'),
  currentYear = new Date().getFullYear(),
  svgs = document.querySelectorAll('svg'),
  menuList = document.querySelector('ul.menu-list'),
  courseList = document.querySelector('.course-list-menu')
  
result = document.querySelector('.result')
let prompt, deleteBtn, denyBtn, confirmBtn
svgs.forEach(el => {
  el.style.opacity = 1
})

setInterval(function(){
  const childrenWrapper = loader.querySelector('.loader-children-wrapper')
  const lastCircle = childrenWrapper.querySelector(":last-child")
  childrenWrapper.prepend(lastCircle)
}, 300)

logoContainer.addEventListener('click', function(){
  window.location.href ='/'
})
if(menuBtn){
  menuBtn.addEventListener('click', function(){
  hideShow(menuList, 'flex')
})

courseListBtn.addEventListener('click', function(){
  hideShow(courseList)
})
}
if(dateContainer) dateContainer.textContent = currentYear
document.addEventListener('click', function(e) {
  if(menuBtn){
    if(!menuBtn.contains(e.target) && !menuList.contains(e.target)) {
      courseList.style.display = 'none'
      menuList.style.display = 'none'
    }
  }
})
function resetElHtml(object){
  setTimeout(() => object.innerHTML = '', 4000)
}
function hideShow(object, display= 'block'){
  const currentDisplay = window.getComputedStyle(object).display;
  
  if(currentDisplay === 'none'){
      object.style.display = display   
    object.style.flexDirection = 'column'
  } else {
    object.style.display = 'none'
  }
}
function goToTop(){ scrollTo(0, 0)}
function success(res){
  return result.innerHTML = `<span class="success">${res.msg}</span>`
}
function failed(res){
  return result.innerHTML = `<span class="failed">${res.msg}</span>`
}