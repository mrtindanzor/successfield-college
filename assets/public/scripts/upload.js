const formEl = document.querySelector('form')

formEl.addEventListener('submit', e => {
  e.preventDefault()

  const uri = '/upload',
    formData = new FormData(formEl),
    options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    }

    fetch(uri, options)
      .then(res => res.json())
      .then(data => console.log(data))
})