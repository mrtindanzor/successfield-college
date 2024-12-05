const addMore = document.querySelectorAll('.add-more'),
  formEl = document.querySelectorAll('form.form'),
  result = document.querySelector('#result'),
  addCourseBtn = document.querySelector('.add-course'),
  prompDialog = document.querySelector('.prompt-dialog'),
  acceptBtn = document.querySelector('.accept-prompt'),
  denyBtn = document.querySelector('.deny-prompt')
  
  let course = {},
    overview = {},
    objectives = {},
    outline = {},
    benefits = {},
    certificate = {},
    fees = {},
    newCourse = {}
    
  addMore.forEach(add => {
    let inputCount = 0,
    dataId = add.parentElement.dataset.id

  add.addEventListener('click', () => {
    inputCount++
    const currentForm = add.parentElement,
    input = document.createElement('input')
    input.setAttribute('name', `${dataId + inputCount}`)
    currentForm.insertBefore(input, add)
  })
  })
  
  formEl.forEach(el => {
    el.addEventListener('submit', (e) => {
      e.preventDefault()
      
      const nextEl = el.nextElementSibling,
      dataId = el.dataset.id,
       formData = new FormData(el),
       jsonObject = Object.fromEntries(formData)
       
     if(dataId == 'course') course = jsonObject
     if(dataId == 'overview') overview = jsonObject
     if(dataId == 'objectives') objectives = jsonObject
     if(dataId == 'outline') outline = jsonObject
     if(dataId == 'benefits') benefits = jsonObject
     if(dataId == 'certificate') certificate = jsonObject
     if(dataId == 'fees') fees = jsonObject
     if(nextEl){
     el.classList.remove('active')
     nextEl.classList.add('active')
     }
    })
    
    el.addEventListener('click', (e) => {
      const previousEl = el.previousElementSibling
      if(e.target.classList.contains('back-button')){
        if(!previousEl) return
     el.classList.remove('active')
     previousEl.classList.add('active')
      }
    })
  })
  
  
  acceptBtn.addEventListener('click', async () => {
    let outlines = []
    outline.forEach(outline => outlines.push(outline))
    newCourse = {...course, ...overview, outlines, objectives: objectives, benefits: benefits, ...certificate, ...fees}
    newCourse = JSON.stringify(newCourse)
    const uri = '/addcourse',
     options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: newCourse
     }
     fetch(uri, options)
    prompDialog.classList.add('remove')
  })
  
  denyBtn.addEventListener('click', () => {
    prompDialog.classList.add('remove')
  })
  
  addCourseBtn.addEventListener('click', () => {
    prompDialog.classList.remove('remove')
  })
  