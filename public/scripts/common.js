const courseListBtn = document.querySelector('.course-list-button'),
  logoContainer = document.querySelector('.logo-container'),
  loader = document.querySelector('.loader'),
  prompt = document.querySelector('.prompt-box'),
  promptText = prompt.querySelector('.question-section'),
  promptConfirm = prompt.querySelector('.confirm-button'),
  promptDeny = prompt.querySelector('.deny-button'),
  transBackground = document.querySelector('.translucent-background'),
  menuBtn = document.querySelector('.menu-button'),
  dateContainer = document.querySelector('.date-year'),
  currentYear = new Date().getFullYear(),
  svgs = document.querySelectorAll('svg'),
  menuList = document.querySelector('ul.menu-list'),
  courseList = document.querySelector('.course-list-menu')
  
result = document.querySelector('.result')
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
function resetElHtml(object, time=4000){
  setTimeout(() => object.innerHTML = '', time)
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
function backgroundActive(){
  transBackground.classList.add('active')
  bodyOveflow('hidden')
}
function backgroundInactive(){
  transBackground.classList.remove('active')
  bodyOveflow('auto')
}
function promptActive(msg){
 promptText.innerHTML = `${msg}`
 prompt.classList.add('active')
 bodyOveflow('hidden')
}
function promptInactive(){
  prompt.classList.remove('active')
  bodyOveflow('auto')
}
function loaderActive(){
  loader.classList.add('active')
  bodyOveflow('hidden')
}
function loaderInactive(){
  loader.classList.remove('active')
  bodyOveflow('auto')
}
function bodyOveflow(state){
  document.body.style.overflowY = state
}
function success(res){
  return result.innerHTML = `<span class="success">${res.msg}</span>`
}
function failed(res){
  return result.innerHTML = `<span class="failed">${res.msg}</span>`
}