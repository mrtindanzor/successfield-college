const page = document.querySelector('[data-section]').dataset.section
if(page == 'add'){
  const formEl = document.querySelector('form')
  const courseInput = document.getElementById('course')
  const courseSelector = formEl.querySelector('.select')
  const placeholder = formEl.querySelector('.options-placeholder')
  const liOptions = courseSelector.querySelectorAll('ol li')

  for(const option of liOptions){
    option.addEventListener('click', function(){
      courseInput.value = option.textContent.trim()
      placeholder.textContent = option.textContent
    })
  }

  courseSelector.addEventListener('click', function(){
    const options = courseSelector.querySelector('.options-menu')
    const display = getComputedStyle(options).display
    display === 'none' ? options.style.display = 'flex' : options.style.display = 'none'
  })


  formEl.addEventListener('submit', async function(e){
    e.preventDefault()

    const formData = new FormData(formEl)
    const jsonData = JSON.stringify(Object.fromEntries(formData))
    const uri = '/admin/module'
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    }
    loader.classList.add('active')
    const response = await fetch(uri, options)
    const res = await response.json()

    switch(res.status){
      case 201:
        success(res)
        formEl.reset()
          break;
      
      default:
        failed(res)
    }
    loader.classList.remove('active')
    resetElHtml(result)
  })
}

if(page == 'delete'){
  const formEl = document.querySelector('.form')
  const courseInput = document.getElementById('course')
  const courseSelector = formEl.querySelector('.select')
  const placeholder = formEl.querySelector('.options-placeholder')
  const liOptions = courseSelector.querySelectorAll('ol li')
  const modulesContainer = document.querySelector('.course-modules')

  for(const option of liOptions){
    option.addEventListener('click', async function(){
      modulesContainer.innerHTML = ''
      courseInput.value = option.textContent.trim()
      placeholder.textContent = option.textContent

      const course = courseInput.value
      const uri = '/admin/course'
      const headers = new Headers()
      headers.append('Content-Type', 'application/json')
      const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({course})
      }
      loader.classList.add('active')
      const response = await fetch(uri, options)
      const res = await response.json()
      const modules = res.modules
      if(modules.length < 1){
        loader.classList.remove('active')
        res.msg = 'No modules found'
        resetElHtml(result)
        return failed(res)
      }
      for(const module of modules){
        const moduleItem = `<form class="delete-module-form form-basic w-100">
          <label class="mg-block-10">
            <span class="label">Module position:</span>
            <input type="text" value="${module.index}" class="module-index w-100" disabled>
          </label>
          <label class="mg-block-10">
            <span class="label">Module title:</span>
            <input type="text" value="${module.title}" class="module-title w-100" disabled>
          </label>
          <label class="mg-block-10">
            <span class="label">YouTube link:</span>
            <input type="text" value="${module.link}" class="module-link w-100" disabled>
          </label>
          <button class="button mg-block-20 w-100 bg-secondary delete-btn">Delete Module</button>
        </form>`
        modulesContainer.innerHTML += moduleItem
        loader.classList.remove('active')
        const forms = document.querySelectorAll('.delete-module-form')
        for(const form of forms){
          form.addEventListener('submit', async function(e) {
            e.preventDefault()
            loader.classList.add('active')
            const uri = '/admin/module'
            const headers = new Headers()
            headers.append('Content-Type', 'application/json')
            const course = courseInput.value.trim().toLowerCase()
            const index = form.querySelector('.module-index').value.trim()
            const jsonData = JSON.stringify({ index, course })
            const options = {
              method: 'DELETE',
              headers,
              body: jsonData
            }
            const response = await fetch(uri, options)
            const res = await response.json()
            switch(res.status){
              case 201: 
                success(res)
                form.remove()
                  break;
              default:
                failed(res)
            }
            loader.classList.remove('active')
            resetElHtml(result)
          })
        }
      }
    })
  }

  courseSelector.addEventListener('click', function(){
    const options = courseSelector.querySelector('.options-menu')
    const display = getComputedStyle(options).display
    display === 'none' ? options.style.display = 'flex' : options.style.display = 'none'
  })

  formEl.addEventListener('submit', function(e){ e.preventDefault() })
}