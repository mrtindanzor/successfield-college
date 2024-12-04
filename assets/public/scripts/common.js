const courseListBtn = document.querySelector('.course-list-button'),
      menuBtn = document.querySelector('.menu-button'),
      svgs = document.querySelector('svg'),hideShow = async (object, display= 'block') => {
        const currentDisplay = await window.getComputedStyle(object).display;
        
        if(currentDisplay === 'none'){
            object.style.display = display   
          object.style.flexDirection = 'column'
      } else {
          object.style.display = 'none'
        }
      },
      menuList = document.querySelector('ul.menu-list'),
      courseList = document.querySelector('.course-list-menu')

svgs.style.opacity = 1

menuBtn.addEventListener('click', () => {
  hideShow(menuList, 'flex')
})
courseListBtn.addEventListener('click', () => {
  hideShow(courseList)
})
document.addEventListener('click', (e) => {
  if(!menuBtn.contains(e.target) && !menuList.contains(e.target)) {
    courseList.style.display = 'none'
    menuList.style.display = 'none'
    
  }
})
