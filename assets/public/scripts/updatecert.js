const findFormEl = document.querySelector('.find-user-form'),
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
      dateCompleted = data.user.dateCompleted

      const updateForm =  `
      <form class="update-form">
        <input type="text" name="name" value="${name}" placeholder="Update name" title="Update name">
        <input type="text" name="studentNumber" value="${studentNumber}" placeholder="Update student number" title="Update student number">
        <input type="hidden" name="oldCertificateCode" value="${certificateCode}">
        <input type="text" name="certificateCode" value="${certificateCode}" placeholder="Update certificate number" title="Update certificate number">
        <input type="text" name="programme" value="${programme}" placeholder="Update programme" title="Update programme">
        <input type="text" name="dateCompleted" value="${dateCompleted}" placeholder="Update date completed" title="Update date completed">
        <button>Update</button>
    </form>
    <div class="update-result" > </div>
      `
    result.innerHTML = updateForm
    const updateFormEl = document.querySelector('.update-form')
    
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

      fetch('/updatecert', options)
        .then(res => res.json())
        .then(data => {
          const updateResultContainer = document.querySelector('.update-result')
          updateResultContainer.innerHTML =  `
            <b> ${data.msg} </b>
          `
        })
    })
  })
})