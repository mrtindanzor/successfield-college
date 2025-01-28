const sections = document.querySelectorAll('.section')
const mainWrapper = document.querySelector('.main-wrapper')
const studentSearch = document.getElementById('search-students')
const students = document.querySelectorAll('.student')

for(const section of sections){
  section.addEventListener('click', function(){
    const sectionData = section.dataset.section
    const sectionPage = mainWrapper.querySelector(`[data-section=${sectionData}]`)
    const sectionPages = mainWrapper.querySelectorAll('.section-page')
    sectionPages.forEach(sectionPage => { if(!sectionPage.classList.contains('dp-n')) sectionPage.classList.add('dp-n')})
    sectionPage.classList.remove('dp-n')
  })
}

studentSearch.addEventListener('input', function(){
  const keyword = studentSearch.value.trim().toLowerCase()

  for(const student of students){
    const name = student.querySelector('.student-name').textContent.toLowerCase().trim()
    const number = student.querySelector('.student-number').textContent.toLowerCase().trim()

    if(!name.includes(keyword) && !number.includes(keyword)){
      student.classList.add('dp-n')
    } else{
      student.classList.remove('dp-n')
    }
  }
})