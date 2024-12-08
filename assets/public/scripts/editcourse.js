const findCourseForm = document.querySelector('.find-course'),
  formEl = document.querySelectorAll('.form'),
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
  id = '',
  newCourse = {}

  findCourseForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const courseName = findCourseForm.querySelector('#find-course').value.toLowerCase().trim()
      uri = '/admin/findcourse',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({course: courseName})
      }
      fetch(uri, options)
        .then(res => res.json())
        .then(data => {
          if(data.status !== 200) return result.innerHTML = `<span class='fail'> ${data.msg} </span> `
          formEl.forEach(el => {
            const inputEl = el.querySelectorAll('input:not([type="submit"])')
            if(inputEl) inputEl.forEach(el => el.remove())
            if(objectives){
              let i = objectives.length
              objectives.splice(0, i)
            }
            if(outlines){
              let i = outlines.length
              outlines.splice(0, i)
            }
            if(benefits){
              let i = benefits.length
              benefits.splice(0, i)
            }
            course = ''
            overview = ''
            certificate = ''
            fee = ''
            result.innerHTML = ''
            if(el.classList.contains('active')) el.classList.remove('active')
            const dataId = el.dataset.id,
            elTitle = el.querySelector('.form-title'),
            newInput = document.createElement('input')
            newInput.setAttribute('type', 'text')
            if(dataId === 'course') {
              newInput.value = data.isCourse.course
              el.insertBefore(newInput, elTitle.nextSibling)
              let i = formEl.length,
              firstEl = formEl[0]
              firstEl.classList.add('active')
            }
            if(dataId === 'overview') {
              newInput.value = data.isCourse.overview
              el.insertBefore(newInput, elTitle.nextSibling)
            }
            if(dataId === 'certificate') {
              newInput.value = data.isCourse.certificate
              el.insertBefore(newInput, elTitle.nextSibling)
            }
            if(dataId === 'fee') {
              newInput.value = data.isCourse.fee
              el.insertBefore(newInput, elTitle.nextSibling)
            }
            if(dataId === 'objectives'){
              const objectives = data.isCourse.objectives
              objectives.forEach(item => {
                const input = document.createElement('input'),
                  addMoreBtn = el.querySelector('.add-more')
                input.value = item.objective
                el.insertBefore(input, addMoreBtn)
              })
            }
            if(dataId === 'outlines'){
              const outlines = data.isCourse.outlines
              outlines.forEach(item => {
                const input = document.createElement('input'),
                  addMoreBtn = el.querySelector('.add-more')
                input.value = item.outline
                el.insertBefore(input, addMoreBtn)
              })
            } 
              if(dataId === 'benefits'){
                const objectives = data.isCourse.benefits
                objectives.forEach(item => {
                  const input = document.createElement('input'),
                    addMoreBtn = el.querySelector('.add-more')
                  input.value = item.benefit
                  el.insertBefore(input, addMoreBtn)
                })
              }
            })
            id = data.isCourse._id
        })
    })
  
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
        inputValue  = input.value
        if(!inputValue) return
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
    newCourse = {id, course, overview, objectives, outlines, benefits, certificate, fee}
    
    const uri = '/admin/editcourse',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
      }

    fetch(uri, options).then(res => res.json()).then(data => {
      if(data.status === 201) result.innerHTML = `<span class='success'> ${data.msg}</span>`
      if(data.status !== 201) result.innerHTML = `<span class='fail'> ${data.msg}</span>`
    formEl.forEach(el => {
      el.reset()
      findCourseForm.reset()
      let i = formEl.length,
        lastEl = formEl[i - 1]
      lastEl.classList.remove('active')
      const inputEl = el.querySelectorAll('input:not([type="submit"])')
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