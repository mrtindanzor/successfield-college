const findFormEl = document.querySelector('.find-certificate'),
  result = document.querySelector('.result')

findFormEl.addEventListener('submit', (e) => {
  e.preventDefault()

  const certificateCode = findFormEl.querySelector('input').value
  fetch(`/verify/${certificateCode}`)
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
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonString
      }

      fetch('/admin/updatecert', options)
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
            if(data.status === 400)
            updateResultContainer.innerHTML = `
          <i class="update-fail">${data.msg}</i>
          `
        })
    })
  })
})