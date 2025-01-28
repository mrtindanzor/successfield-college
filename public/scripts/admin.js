const sections = document.querySelectorAll('.section')
const mainWrapper = document.querySelector('.main-wrapper')

for(const section of sections){
  section.addEventListener('click', function(){
    const sectionData = section.dataset.section
    const sectionPage = mainWrapper.querySelector(`[data-section=${sectionData}]`)
    const sectionPages = mainWrapper.querySelectorAll('.section-page')
    sectionPages.forEach(sectionPage => { if(!sectionPage.classList.contains('dp-n')) sectionPage.classList.add('dp-n')})
    sectionPage.classList.remove('dp-n')
  })
}