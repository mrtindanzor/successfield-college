const verifyForm = document.querySelector('.find-student-form form'),
      certificateNumber = document.getElementById('certificate_num'),
      showFoundStudent = document.querySelector('.show-found-student')

verifyForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let certificateNum = certificateNumber.value
  if(certificateNum.length < 1) return
  fetch(`/verify/${certificateNum}`)
        .then((res) => res.json())
        .then(data => {
          if(data.status === 500) {
            showFoundStudent.innerHTML =  `<b>${data.msg}</b>`
        }
          if(data.status === 404) {
            showFoundStudent.innerHTML =  `<b class="invalid-code">${data.msg}</b>`
        }
          if(data.status === 200) {
            
        }
        })
})