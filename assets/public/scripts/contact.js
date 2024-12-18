const formEl = document.querySelector('form.email-form'),
  result = document.querySelector('.result')

formEl.addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(formEl),
    jsonData = JSON.stringify(Object.fromEntries(formData)),
    uri = '/contact',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    }

    fetch(uri, options)
      .then(res => res.json())
      .then(data => {
        if(data.status === 201) result.innerHTML = `
          <div class="mail-sent">
            <span class="text">
            ${data.mailIcon}
              <span>${data.msg}</span>
            </span>
            <button>OK</button>
          </div>
        `
        if(data.status !== 201) result.innerHTML = `
          <div class="mail-not-sent">
            <span class="text">
              ${data.mailIcon}
              <span>${data.msg}</span>
            </span>
            <button>OK</button>
          </div>
        `

        result.classList.add('active')
        const closeBtn = document.querySelector('.result button')
        closeBtn.addEventListener('click', () => result.classList.remove('active'))

      })
})