const page = document.querySelector('[data-section]').dataset.section
if(page === 'add'){
  const formEl = document.querySelector('.cert-add-form'),
resultDiv = document.querySelector('.result')

formEl.addEventListener('submit', async (e) => {
  e.preventDefault()

  resultDiv.innerHTML = ''
  const newCertCode = document.getElementById('certificateCode').value.toLowerCase()
  document.getElementById('certificateCode').value = newCertCode
  const formData = new FormData(formEl),
  jsonObject = Object.fromEntries(formData),
  jsonString = JSON.stringify(jsonObject)

  fetch('/admin/cert', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonString
  })
  .then(res => res.json())
  .then(data => {
    if(data.status === 201)
    resultDiv.innerHTML = `
  <i class="add-success">${data.msg}</i>
  `
    if(data.status !== 201)
    resultDiv.innerHTML = `
  <i class="add-fail">${data.msg}</i>
  `
  })
})
}
if(page === 'edit'){
  const findFormEl = document.querySelector('.find-certificate'),
  result = document.querySelector('.result')

findFormEl.addEventListener('submit', (e) => {
  e.preventDefault()

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
    }
  fetch(uri, options)
  .then(res => res.json())
  .then(data => {
    if(data.status === 500) {
      return result.innerHTML =  `<b>${data.msg}</b>`
    }
    if(data.status === 404) {
      return result.innerHTML =  `<b class="invalid-code">${data.msg}</b>`
    }

    let name = data.user.name,
      certificateCode = data.user.certificateCode,
      programme = data.user.programme,
      studentNumber = data.user.studentNumber,
      dateCompleted = data.user.dateCompleted,
      id = data.user._id

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
        <input type="text" name="certificateCode" id="certificateCode" value="${certificateCode}" placeholder="Update certificate number" title="Update certificate number">
      </label>
        <input type="hidden" name="oldCertificateCode" id="oldCertificateCode" value="${certificateCode}">
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
    result.innerHTML = updateForm
    const updateFormEl = document.querySelector('.cert-update-form')
    
    updateFormEl.addEventListener('submit', (e) => {
      e.preventDefault()

      const formData = new FormData(updateFormEl),
      jsonData = Object.fromEntries(formData.entries()),
      jsonString = JSON.stringify(jsonData),
      uri = '/admin/cert',
      options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonString
      }

      fetch(uri, options)
        .then(res => res.json())
        .then(data => {
          const updateResultContainer = document.querySelector('.update-result')

          if(data.status === 403)
            updateResultContainer.innerHTML = `
          <i class="update-fail">${data.msg}</i>
          `

          if(data.status === 204)
            updateResultContainer.innerHTML = `
          <i class="update-success">${data.msg}</i>
          `
            if(data.status === 404)
            updateResultContainer.innerHTML = `
          <i class="update-fail">${data.msg}</i>
          `
        })
    })
  })
})
}

if(page === 'delelte'){
  const findEl = document.querySelector('.find-cert-form input'),
    findForm = document.querySelector('.find-cert-form'),
    findBtn = document.querySelector('.find-cert-form button'),
    result = document.querySelector('.delete-cert-wrapper .result')


  findForm.addEventListener('submit', e => e.preventDefault())
  findBtn.addEventListener('click', async () => {

    result.innerHTML = ''
    const certificateCode = findEl.value.trim().toLowerCase(),
      uri = '/verify',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({certificateCode})
      }

      fetch(uri, options)
        .then(res => res.json())
        .then(data => {
          if(data.status !== 200){
            return result.innerHTML = `
              <span class="invalid-code">${data.msg}</span>
            `
          }
          result.innerHTML = `
              <div class="show-found-cert">
                <span class="cert-name" data-id="${data.user._id}">
                  ${data.user.name.toUpperCase()}
                </span>
                <span class="certificate-code">
                  ${data.user.certificateCode}
                </span>
                <button>Delete</button>
                <div class="prompt-dialog">
                  <div class="prompt-box">
                    <span class="confirm-text">
                      Type "<span class="confirm-cert">${data.user.certificateCode.toLowerCase()}</span>" to delete
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
            const deleteBtn = document.querySelector('.show-found-cert > button'),
              prompt = document.querySelector('.prompt-dialog'),
              confirmEl = document.querySelector('.prompt-box')

            deleteBtn.addEventListener('click', () => prompt.classList.add('active'))

            confirmEl.addEventListener('click', async (e) => {
                let inputValue = confirmEl.querySelector('.contrs input').value.toLowerCase().trim(),
                  certificate = confirmEl.querySelector('.confirm-cert').textContent.toLowerCase()

                if(e.target.classList.contains('confirm-delete')){
                  if(inputValue === certificate){
                    const uri = '/admin/cert',
                      options = {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({certificateCode})
                      }
                    fetch(uri, options)
                      .then(res => res.json())
                      .then(data => {
                        if(data.status !== 200){
                          return result.innerHTML =  `
                          <span class="is-not-deleted">
                            ${data.msg}
                          </span>
                          `
                        }
                        if(data.status === 200){
                          return result.innerHTML =  `
                          <span class="is-deleted">
                            ${data.msg}
                          </span>
                          `
                        }
                      })
                    prompt.classList.remove('active')
                  }
                }
                if(e.target.classList.contains('deny-delete')) prompt.classList.remove('active')
            })
        })
  })
}