const verifyForm = document.querySelector('.find-student form'),
      certificateNumber = document.getElementById('certificate'),
      result = document.querySelector('.result')

verifyForm.addEventListener('submit', async function(e){
  e.preventDefault()

  loader.classList.add('active')
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
    result.innerHTML =  `<span class="failed">${res.msg}</span>`
    loader.classList.remove('active')
    return 
  }

  result.innerHTML =  `
    <div class="student-details">
        <div><b for="student-name">Name </b>:<span class="student-name">${res.name.toUpperCase()}</span></div>
      <div><b for="student-number">Student number</b> : <span class="student-number">${res.studentNumber}</span></div>
      <div><b for="student-certificate-num">Certificate code</b> : <span class="student-certificate-num">${res.certificateCode.toUpperCase()}</span></div>
      <div><b for="verification-status">Status</b> : <span class="verification-status">VALID</span></div>
      <div><b for="student-course">Programme</b> : <span class="student-course">${res.programme.toUpperCase()}</span></div>
      <div><b for="date-completed">Date completed</b> : <span class="date-completed">${res.dateCompleted.toUpperCase()}</span></div>
    </div>
`
loader.classList.remove('active')
  })