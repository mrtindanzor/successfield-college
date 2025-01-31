const page = document.querySelector('[data-section]').dataset.section
if(page === 'add'){
  const formEl = document.querySelector('.cert-add-form')

formEl.addEventListener('submit', async (e) => {
  e.preventDefault()

  loaderActive()
  result.innerHTML = ''
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
    success(res)
    loaderInactive()
    resetElHtml(result)
    return
  }
    
  failed(res)
  loaderInactive()
  resetElHtml(result)
})
}
if(page === 'edit'){
  const findFormEl = document.querySelector('.find-certificate')
  findFormEl.addEventListener('submit', async function(e){
  e.preventDefault()

  loaderActive()
  
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
    failed(res)
    loaderInactive()
    resetElHtml(result)
    return
  }

  let name = res.name,
    newCertificateCode = res.certificateCode,
    programme = res.programme,
    studentNumber = res.studentNumber,
    dateCompleted = res.dateCompleted,
    id = res._id

  const updateForm =  `
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
      `,
    resultForm = document.querySelector('.update-result')
  loaderInactive()
  resultForm.innerHTML = updateForm
  const updateFormEl = document.querySelector('.cert-update-form')
    
  updateFormEl.addEventListener('submit', async function(e){
    e.preventDefault()

    loaderActive()
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
    res = await response.json()
    if(res.status !== 204 ){
      failed(res)
      loaderInactive()
      return
    }
      success(res)
    loaderInactive()
    resetElHtml(result)
    })
  })
}

if(page === 'delete'){
  const findEl = document.querySelector('.find-cert'),
    findForm = document.querySelector('.find-cert')

  findForm.addEventListener('submit', async function(e){
    e.preventDefault()

    loaderActive()
    
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
      failed(res)
      loaderInactive()
      resetElHtml(result)
      return 
    }
    result.innerHTML = `
      <div class="show-found-cert">
        <h3 data-id="${res._id}">Delete Certificate</h3>
        <h4>Name:</h4>
        <span>${res.name}</span>
        <h4>Student ID:</h4>
        <span>${res.studentNumber}</span>
        <h4>Certificate Code:</h4>
        <span>${res.certificateCode}</span>
        <h4>Program:</h4>
        <span>${res.programme}</span>
        <h4>Date Completed:</h4>
        <span>${res.dateCompleted}</span>
        <button class="delete-button">delete</button>
      `
    loaderInactive()
    const deleteBtn = document.querySelector('.result .delete-button'),
      prompt = document.querySelector('.prompt-dialog'),
      denyBtn = document.querySelector('.deny-delete'),
      confirmEl = document.querySelector('.confirm-delete')
    deleteBtn.addEventListener('click', () => {
      loaderActive()
      prompt.classList.add('active')
    })
    denyBtn.addEventListener('click', () => {
      prompt.classList.remove('active')
      loaderInactive()
    })

    confirmEl.addEventListener('click', async function(e){
      let inputValue = document.querySelector('.contrs input').value.toLowerCase().trim(),
        certificate = document.querySelector('.confirm').textContent.toLowerCase()

      if(!inputValue) return 
      if(e.target.classList.contains('confirm-delete') && inputValue === certificate){
        loaderActive()
        const uri = '/admin/cert',
          options = {
            method: 'delete',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({certificateCode})
          },
        response = await fetch(uri, options),
        res = await response.json()
        if(res.status !== 200){
          failed(res)
        prompt.classList.remove('active')
        loaderInactive()
        resetElHtml(result)
        return 
        }

        success(res)
        loaderInactive()
        prompt.classList.remove('active')
        resetElHtml(result)
      }
    })
  })
}
