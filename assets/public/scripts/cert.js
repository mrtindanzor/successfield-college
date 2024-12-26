const page = document.querySelector('[data-section]').dataset.section
if(page === 'add'){
  const formEl = document.querySelector('.cert-add-form'),
resultDiv = document.querySelector('.result')

formEl.addEventListener('submit', async (e) => {
  e.preventDefault()

  loader.classList.add('active')
  resultDiv.innerHTML = ''
  const newCertCode = document.getElementById('certificateCode').value.toLowerCase()
  document.getElementById('certificateCode').value = newCertCode
  const formData = new FormData(formEl),
    jsonObject = Object.fromEntries(formData),
    jsonString = JSON.stringify(jsonObject),
    uri = '/admin/cert',
    options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonString
    },
    response = await fetch(uri, options),
    res = await response.json()
  if(res.status === 201){
    resultDiv.innerHTML = `
      <span class="success">${res.msg}</span>
    `
    loader.classList.remove('active')
    return
  }
    
  resultDiv.innerHTML = `
    <span class="failed">${res.msg}</span>
  `
  loader.classList.remove('active')
})
}
if(page === 'edit'){
  const findFormEl = document.querySelector('.find-certificate'),
  result = document.querySelector('.result')

  findFormEl.addEventListener('submit', async function(e){
  e.preventDefault()

  loader.classList.add('active')
  result.innerHTML = ''
  const certificateCode = findFormEl.querySelector('input').value.toLowerCase().trim()
  if(certificateCode.length < 1) return
  const uri = '/verify',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({certificateCode})
    },
    response = await fetch(uri, options),
    res = await response.json()
  if(res.status !== 200) {
    result.innerHTML =  `<span class="failed">${data.msg}</span>`
    loader.classList.remove('active')
    return
  }

  let name = res.name,
    newCertificateCode = res.certificateCode,
    programme = res.programme,
    studentNumber = res.studentNumber,
    dateCompleted = res.dateCompleted,
    id = res._id

  const updateForm =  `
    <div class="update-result" >
    </div>
      <form class="cert-update-form">
      <span>
        Update Certificate
      </span>
      <label for="name">
        <b>Name</b>
        <input type="text" name="name" id="name" value="${name}" placeholder="Update name" title="Update name">
      </label>
      <label for="studentNumber">
        <b>Student number</b>
        <input type="text" name="studentNumber" id="studentNumber" value="${studentNumber}" placeholder="Update student number" title="Update student number">
      </label>
      <label for="certificateCode">
        <b>Certificate ID</b>
        <input type="text" name="certificateCode" id="certificateCode" value="${newCertificateCode}" placeholder="Update certificate number" title="Update certificate number">
      </label>
        <input type="hidden" name="oldCertificateCode" id="oldCertificateCode" value="${newCertificateCode}">
        <input type="hidden" name="id" id="oldCertificateCode" value="${id}">
      <label for="programme">
        <b>Programme</b>
        <input type="text" name="programme" id="programme" value="${programme}" placeholder="Update programme" title="Update programme">
      </label>
      <label for="dateCompleted">
        <b>Date of Completion</b>
        <input type="text" name="dateCompleted" id="dateCompleted" value="${dateCompleted}" placeholder="Update date completed" title="Update date completed">
      </label>
      <input type="submit" value="update">
    </form>
      `
  loader.classList.remove('active')
  result.innerHTML = updateForm
  const updateFormEl = document.querySelector('.cert-update-form')
    
  updateFormEl.addEventListener('submit', async function(e){
    e.preventDefault()

    loader.classList.add('active')
    const formData = new FormData(updateFormEl),
    jsonData = Object.fromEntries(formData.entries()),
    jsonString = JSON.stringify(jsonData),
    uri = '/admin/cert',
    options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonString
    },
    response = await fetch(uri, options),
    res = await response.json(),
    updateResultContainer = document.querySelector('.update-result')
    if(res.status !== 204 ){
      updateResultContainer.innerHTML = `
      <span class="failed">${res.msg}</span>
      `
      loader.classList.remove('active')
      return
    }
      updateResultContainer.innerHTML = `
    <span class="success">${res.msg}</span>
    `
    loader.classList.remove('active')
    })
  })
}

if(page === 'delete'){
  const findEl = document.querySelector('.find-cert'),
    findForm = document.querySelector('.find-cert'),
    result = document.querySelector('.delete-cert-wrapper .result')


  findForm.addEventListener('submit', async function(e){
    e.preventDefault()

    loader.classList.add('active')
    result.innerHTML = ''
    const certificateCode = findEl.querySelector('input').value.trim().toLowerCase(),
      uri = '/verify',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({certificateCode})
      },
      response = await fetch(uri, options),
      res = await response.json()
    if(res.status !== 200){
      result.innerHTML = `
        <span class="invalid-code">${data.msg}</span>
      `
      loader.classList.remove('active')
      return 
    }
    result.innerHTML = `
        <div class="show-found-cert">
          <span class="cert-name" data-id="${res._id}">
            ${res.name.toUpperCase()}
          </span>
          <span class="certificate-code">
            ${res.certificateCode}
          </span>
          <button>Delete</button>
          <div class="prompt-dialog">
            <div class="prompt-box">
              <span class="confirm-text">
                Type "<span class="confirm-cert">${res.certificateCode.toLowerCase()}</span>" to delete
              </span>
              <div class="contrs">
                <input type="text">
                <button class="confirm-delete">delete</button>
              </div>
            <button class="deny-delete">close</button>
            </div>
          </div>
        </div>
      `
    loader.classList.remove('active')
    const deleteBtn = document.querySelector('.result > button'),
      prompt = document.querySelector('.prompt-dialog'),
      confirmEl = document.querySelector('.prompt-box')

    deleteBtn.addEventListener('click', () => prompt.classList.add('active'))

    confirmEl.addEventListener('click', async function(e){
      let inputValue = confirmEl.querySelector('.contrs input').value.toLowerCase().trim(),
        certificate = confirmEl.querySelector('.confirm-cert').textContent.toLowerCase()
      if(e.target.classList.contains('confirm-delete') && inputValue === certificate){
        loader.classList.add('active')
        const uri = '/admin/cert',
          options = {
            method: 'delete',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({certificateCode})
          },
        response = await fetch(uri, options),
        res = await res.json()
        if(res.status !== 200){
          result.innerHTML =  `
          <span class="is-not-deleted">
            ${data.msg}
          </span>
          `
        prompt.classList.remove('active')
        loader.classList.remove('active')
        return 
        }

        result.innerHTML =  `
          <span class="is-deleted">
            ${data.msg}
          </span>
          `
      }
      if(e.target.classList.contains('deny-delete')){
        prompt.classList.remove('active')
        loader.classList.remove('active')
      }
    })
  })
}