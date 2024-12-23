const verifyForm = document.querySelector('.find-student-form form'),
      certificateNumber = document.getElementById('certificate_num'),
      showFoundStudent = document.querySelector('.show-found-student')

verifyForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let certificateCode = certificateNumber.value.toLowerCase().trim()
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
  .then((res) => res.json())
  .then(data => {
  if(data.status === 500) {
    return showFoundStudent.innerHTML =  `<b>${data.msg}</b>`
  }
  if(data.status === 404 || data.status === 400) {
    return showFoundStudent.innerHTML =  `<b class="invalid-code">${data.msg}</b>`
  }

  let name = data.user.name
  let programme = data.user.programme
  showFoundStudent.innerHTML =  `
    <div class="student-details">
        <div><b for="student-name">Name </b>:<span class="student-name">${name.toUpperCase()}</span></div>
      <div><b for="student-number">Student number</b> : <span class="student-number">${data.user.studentNumber}</span></div>
      <div><b for="student-certificate-num">Certificate code</b> : <span class="student-certificate-num">${data.user.certificateCode.toUpperCase()}</span></div>
      <div><b for="verification-status">Status</b> : <span class="verification-status">VALID</span></div>
      <div><b for="student-course">Programme</b> : <span class="student-course">${programme.toUpperCase()}</span></div>
      <div><b for="date-completed">Date completed</b> : <span class="date-completed">${data.user.dateCompleted.toUpperCase()}</span></div>
    </div>
`
  })
})