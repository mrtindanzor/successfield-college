const formEl = document.querySelectorAll('.form'),
  result = document.querySelector('#result'),
  btn = document.querySelector('button'),
  objectives = [],
  outlines = [],
  benefits = [],
  addMore = document.querySelectorAll('.add-more'),
  addCourseBtn = document.querySelector('.add-course'),
  promptDialog = document.querySelector('.prompt-dialog'),
  acceptBtn = document.querySelector('.accept-prompt'),
  denyBtn = document.querySelector('.deny-prompt')
    
let course = '',
  overview = '',
  certificate = '',
  fee = '',
  newCourse = {}
  
  addMore.forEach(add => {
    let inputCount = 0
  add.addEventListener('click', () => {
    inputCount++
    const currentForm = add.parentElement,
    input = document.createElement('input')
    input.setAttribute('name', `${inputCount}`)
    currentForm.insertBefore(input, add)
  })
  })
  
  formEl.forEach(el => {
    el.addEventListener('submit', e => {
      e.preventDefault()
      
      const nextEl = el.nextElementSibling,
      inputEl = el.querySelectorAll('input:not([type="submit"])'),
      dataId = el.dataset.id
      
      inputEl.forEach(input => {
        inputValue  = input.value.trim()
        if(inputValue == '') return
        if(dataId === 'course') course = inputValue.toLowerCase()
        if(dataId === 'overview') overview = inputValue
        if(dataId === 'certificate') certificate = inputValue
        if(dataId === 'fee') fee = inputValue
        if(dataId === 'objectives'){
          const jsonObject = { objective: inputValue }
          objectives.push(jsonObject)
        }
       if(dataId === 'outlines'){
          const jsonObject = { outline: inputValue }
          outlines.push(jsonObject)
        } 
        if(dataId === 'benefits'){
          const jsonObject = { benefit: inputValue }
          benefits.push(jsonObject)
        }
      })
      
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
  
  acceptBtn.addEventListener('click', () => {
    newCourse = {course, overview, objectives, outlines, benefits, certificate, fee}
    
    const uri = '/admin/addcourse',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
      }

    fetch(uri, options)
      .then(res => res.json())
      .then(data => {
        if(data.status === 201) result.innerHTML = `<span class='success'> ${data.msg}</span>`
        if(data.status !== 201) result.innerHTML = `<span class='fail'> ${data.msg}</span>`
        formEl.forEach(el => {
          el.reset()
          let i = formEl.length,
            firstEl = formEl[0],
            lastEl = formEl[i - 1]
          lastEl.classList.remove('active')
          firstEl.classList.add('active')

          const inputEl = el.querySelectorAll('input[type="text"]:not(:first-child)')
          inputEl.forEach(el => el.remove())
        })
        promptDialog.classList.add('remove')
      })
  })
  
  denyBtn.addEventListener('click', () => {
    promptDialog.classList.add('remove')
  })
  
  addCourseBtn.addEventListener('click', () => {
    promptDialog.classList.remove('remove')
  })