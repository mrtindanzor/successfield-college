import icons from './icons.js'
const selectLi = document.querySelectorAll('.main-links > li'),
linksMenu = document.querySelector('.main-links'),
titleBar = document.querySelector('.main-page .title-bar'),
titleBackBtn = document.querySelector('.title-bar .back-button')

titleBackBtn.innerHTML = (new icons('back-button', 'Go Back')).chevronLeft()
selectLi.forEach(el => {
el.addEventListener('click', function(){
const ulElement = el.parentElement.querySelectorAll('ul')
ulElement.forEach(el => el.classList.remove('active'))
  const ul = el.querySelector('ul'),
    spanText = el.querySelector('span').textContent,
    title = titleBar.querySelector('.title')
  ul.classList.add('active')
  linksMenu.classList.add('inactive')
  title.textContent = spanText
  titleBar.classList.add('active')
})
})

titleBackBtn.addEventListener('click', function(){
linksMenu.classList.remove('inactive')
titleBar.classList.remove('active')
selectLi.forEach(el => {
  const ulElement = el.querySelector('ul')
  ulElement.classList.remove('active')
})
})
