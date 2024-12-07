const formEl = document.querySelector('.cert-add-form'),
resultDiv = document.querySelector('.result')

formEl.addEventListener('submit', async (e) => {
  e.preventDefault()

  const newCertCode = document.getElementById('certificateCode').value.toLowerCase()
  document.getElementById('certificateCode').value = newCertCode
  const formData = new FormData(formEl),
  jsonObject = Object.fromEntries(formData),
  jsonString = JSON.stringify(jsonObject)

  fetch('/admin/certadd', {
    method: 'POST',
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
    if(data.status === 304)
    resultDiv.innerHTML = `
  <i class="add-fail">${data.msg}</i>
  `
  })
})