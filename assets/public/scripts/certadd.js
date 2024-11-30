const formEl = document.querySelector('.add-certificate'),
resultDiv = document.querySelector('.result')

formEl.addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = new FormData(formEl),
  jsonObject = Object.fromEntries(formData),
  jsonString = JSON.stringify(jsonObject)

  fetch('/certadd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonString
  })
  .then(res => res.json())
  .then(data => {
    resultDiv.innerHTML = data.msg
  })
})