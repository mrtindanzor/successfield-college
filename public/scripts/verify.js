const verifyForm = document.querySelector('.find-student form'),
      certificateNumber = document.getElementById('certificate')

verifyForm.addEventListener('submit', async function(e){
  e.preventDefault()

  loaderActive()
  let certificateCode = certificateNumber.value.toLowerCase().trim()
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
  const showCertificate = document.querySelector('.show-certificate')
  showCertificate.innerHTML =  `
    <div class="student-details">
        <div><b for="student-name">Name </b>:<span class="student-name">${res.name}</span></div>
      <div><b for="student-number">Student number</b> : <span class="student-number">${res.studentNumber}</span></div>
      <div><b for="student-certificate-num">Certificate code</b> : <span class="student-certificate-num">${res.certificateCode}</span></div>
      <div><b for="verification-status">Status</b> : <span class="verification-status">VALID</span></div>
      <div><b for="student-course">Programme</b> : <span class="student-course">${res.programme}</span></div>
      <div><b for="date-completed">Date completed</b> : <span class="date-completed">${res.dateCompleted}</span></div>
    </div>
`
loaderInactive()
  })