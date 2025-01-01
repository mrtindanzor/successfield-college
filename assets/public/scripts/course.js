let page = document.querySelector('[data-section]')
if(page) page = page.dataset.section

if(page === 'add'){
  const formEl = document.querySelectorAll('.form'),
    result = document.querySelector('#result'),
    btn = document.querySelector('button'),
    objectives = [],
    outlines = [],
    benefits = [],
    addMore = document.querySelectorAll('.add-more'),
    addCourseBtn = document.querySelector('.add-course'),
    prompt = document.querySelector('.prompt-dialog'),
    confirmBtn = document.querySelector('.confirm'),
    closeBtn = document.querySelector('.close-button')
    
  let course = '',
    overview = '',
    certificate = '',
    availability = '',
    duration = '',
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
        let inputValue = inputEl.value
        inputValue  = input.value.trim()
        if(inputValue == '') return
        if(dataId === 'course') course = inputValue.toLowerCase()
        if(dataId === 'overview') overview = inputValue
        if(dataId === 'certificate') certificate = inputValue
        if(dataId === 'fee') fee = inputValue
        if(dataId === 'availability') availability = inputValue
        if(dataId === 'duration') duration = inputValue
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
  
  confirmBtn.addEventListener('click', async function(){
    newCourse = {course, overview, objectives, outlines, benefits, certificate, availability, duration, fee}
    
    loader.classList.add('active')

    const uri = '/admin/course',
      options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
      },
      response = await fetch(uri, options),
      res = await response.json()
    if(res.status === 201) result.innerHTML = `<span class='success'> ${res.msg}</span>`
    if(res.status !== 201) result.innerHTML = `<span class='fail'> ${res.msg}</span>`
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
    prompt.classList.remove('active')
    loader.classList.remove('active')
    resetElHtml(result)
  })
  
  closeBtn.addEventListener('click', () => {
    prompt.classList.remove('active')
    loader.classList.remove('active')
  })
  
  addCourseBtn.addEventListener('click', () => {
    prompt.classList.add('active')
    loader.classList.add('active')
  })
}

if(page === 'edit'){
  const findCourseForm = document.querySelector('.find-course'),
    formEl = document.querySelectorAll('.form'),
    result = document.querySelector('#result'),
    objectives = [],
    outlines = [],
    benefits = [],
    addMore = document.querySelectorAll('.add-more'),
    addCourseBtn = document.querySelector('.add-course'),
    prompt = document.querySelector('.prompt-dialog'),
    confirmBtn = document.querySelector('.confirm'),
    closeBtn = document.querySelector('.close-button')
      
  let course = '',
    overview = '',
    certificate = '',
    availability = '',
    duration = '',
    fee = '',
    id = '',
    newCourse = {}

  findCourseForm.addEventListener('submit', async function(e){
    e.preventDefault()

    loader.classList.add('active')
    
    const courseName = findCourseForm.querySelector('#find-course').value.toLowerCase().trim()
      uri = '/admin/course',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({course: courseName})
      },
      response = await fetch(uri, options),
      res = await response.json()
    if(res.status !== 200){
      result.innerHTML = `<span class='fail'> ${res.msg} </span> `
      loader.classList.remove('active')
      resetElHtml(result)
      return
    }  
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
      availability = ''
      duration = ''
      fee = ''
      
      if(el.classList.contains('active')) el.classList.remove('active')
      const dataId = el.dataset.id,
      elTitle = el.querySelector('.form-title'),
      newInput = document.createElement('input')
      newInput.setAttribute('type', 'text')
      if(dataId === 'course') {
        newInput.value = res.course
        el.insertBefore(newInput, elTitle.nextSibling)
        let i = formEl.length,
        firstEl = formEl[0]
        firstEl.classList.add('active')
      }
      if(dataId === 'overview') {
        newInput.value = res.overview || ''
        el.insertBefore(newInput, elTitle.nextSibling)
      }
      if(dataId === 'certificate') {
        newInput.value = res.certificate || ''
        el.insertBefore(newInput, elTitle.nextSibling)
      }
      if(dataId === 'availability') {
        newInput.value = res.availability || ''
        el.insertBefore(newInput, elTitle.nextSibling)
      }
      if(dataId === 'duration') {
        newInput.value = res.duration || ''
        el.insertBefore(newInput, elTitle.nextSibling)
      }
      if(dataId === 'fee') {
        newInput.value = res.fee || ''
        el.insertBefore(newInput, elTitle.nextSibling)
      }
      if(dataId === 'objectives'){
        const objectives = res.objectives
        if(objectives){
          objectives.forEach(item => {
            const input = document.createElement('input'),
              addMoreBtn = el.querySelector('.add-more')
            input.value = item.objective
            el.insertBefore(input, addMoreBtn)
          })
        }
        
      }
      if(dataId === 'outlines'){
        const outlines = res.outlines
        if(outlines){
          outlines.forEach(item => {
            const input = document.createElement('input'),
              addMoreBtn = el.querySelector('.add-more')
            input.value = item.outline
            el.insertBefore(input, addMoreBtn)
          })
        }
        
      } 
      if(dataId === 'benefits'){
        const objectives = res.benefits
        if(benefits){
          objectives.forEach(item => {
            const input = document.createElement('input'),
              addMoreBtn = el.querySelector('.add-more')
            input.value = item.benefit
            el.insertBefore(input, addMoreBtn)
          })
        }
        
      }
    })
    loader.classList.remove('active')
    id = res._id
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
        inputValue  = input.value.trim()
        if(!inputValue) return
        if(dataId === 'course' && inputValue) course = inputValue.toLowerCase()
        if(dataId === 'overview' && inputValue) overview = inputValue
        if(dataId === 'certificate' && inputValue) certificate = inputValue
        if(dataId === 'availability' && inputValue) availability = inputValue
        if(dataId === 'duration' && inputValue) duration = inputValue
        if(dataId === 'fee' && inputValue) fee = inputValue
        if(dataId === 'objectives' && inputValue){
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
  
  confirmBtn.addEventListener('click', async function(){
    newCourse = {id, course, overview, objectives, outlines, benefits, certificate, availability, duration, fee}
    
    loader.classList.add('active')

    const uri = '/admin/course',
      options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
      },
      response = await fetch(uri, options),
      res = await response.json()
    if(res.status === 201) result.innerHTML = `<span class='success'> ${res.msg}</span>`
    if(res.status !== 201) result.innerHTML = `<span class='fail'> ${res.msg}</span>`
    formEl.forEach(el => {
      el.reset()
      findCourseForm.reset()
      let i = formEl.length,
        lastEl = formEl[i - 1]
      lastEl.classList.remove('active')
      const inputEl = el.querySelectorAll('input:not([type="submit"])')
      inputEl.forEach(el => el.remove())
    })
    prompt.classList.remove('active')
    loader.classList.remove('active')
    resetElHtml(result)
    })

  
  closeBtn.addEventListener('click', () => {
    prompt.classList.remove('active')
    loader.classList.remove('active')
  })
  
  addCourseBtn.addEventListener('click', () => {
    prompt.classList.add('active')
    loader.classList.add('active')
  })
}

if(page === 'delete'){
  const findForm = document.querySelector('.find-course'),
    result = document.querySelector('.result')

  findForm.addEventListener('submit', async function(e){
    e.preventDefault()
    const course = findForm.querySelector('input').value.trim().toLowerCase()
    if(!course) return

    loader.classList.add('active')
    const uri = '/admin/course',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({course})
      },
      response = await fetch(uri, options),
      res = await response.json()
    if(res.status !== 200){
      return result.innerHTML = `
        <span class="invalid-code">${res.msg}</span>
      `
    }
    result.innerHTML = `
      <div class="show-found-course">
        <h3>Delete Course</h3>
        <h4>Name:</h4>
        <span>${res.course}</span>
        <h4>Overview</h4>
        <span>${res.overview || ''}</span>
        <h4>Certificate:</h4>
        <span>${res.certificate || ''}</span>
        <h4>Certificate:</h4>
        <span>${res.duration || ''}</span>
        <h4>Availability:</h4>
        <span>${res.availability || ''}</span>
        <h4>Fee:</h4>
        <span>${res.fee || ''}</span>
        <h4>Objectives:</h4>
        <ol class="objectives">
        </ol>
        <h4>Outlines:</h4>
        <ol class="outlines">
        </ol>
        <h4>Benefits:</h4>
        <ol class="benefits">
        </ol>
        <button>Delete</button>
        <div class="prompt-dialog">
            <span class="confirm-text">
              Type "<span class="confirm-course">${res.course.toLowerCase()}</span>" to delete
            </span>
            <div class="contrs">
              <input type="text">
              <button class="confirm-button">delete</button>
            </div>
          <button class="close-button">close</button>
          </div>
      </div>
    `

    const objectives = res.objectives,
      outlines = res.outlines,
      benefits = res.benefits,
      objectiveEl = document.querySelector('.objectives'),
      outlineEl = document.querySelector('.outlines'),
      benefitEl = document.querySelector('.benefits')

    if(objectives){
      objectives.forEach(el => objectiveEl.innerHTML +=  `<li>${el.objective}</li>`)
    }
    if(outlines){
      outlines.forEach(el => outlineEl.innerHTML +=  `<li>${el.outline}</li>`)
    }
    if(benefits){
      benefits.forEach(el => benefitEl.innerHTML +=  `<li>${el.benefit}</li>`)
    }

    loader.classList.remove('active')
    const deleteBtn = document.querySelector('.show-found-course > button'),
      prompt = document.querySelector('.prompt-dialog'),
      confirmBtn = document.querySelector('.confirm-button'),
      closeBtn = document.querySelector('.close-button')

    deleteBtn.addEventListener('click', function(){
      loader.classList.add('active')
      prompt.classList.add('active')
    })

    closeBtn.addEventListener('click', function(){
      loader.classList.remove('active')
      prompt.classList.remove('active')
    })

    confirmBtn.addEventListener('click', async function(){
      let inputValue = document.querySelector('.contrs input').value.toLowerCase().trim(),
        courseName = document.querySelector('.confirm-course').textContent.toLowerCase()

      if(inputValue === courseName){
        loader.classList.add('active')
        const uri = '/admin/course',
          options = {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({course})
          },
        response = await fetch(uri, options),
        res = await response.json()
      if(res.status !== 200){
        result.innerHTML =  `
        <span class="failed">
          ${res.msg}
        </span>
        `
      }
        if(res.status === 200){
          result.innerHTML =  `
          <span class="success">
            ${res.msg}
          </span>
          `
        }
        prompt.classList.remove('active')
        loader.classList.remove('active')
      }
    })
  })
}
