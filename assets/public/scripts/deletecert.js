const findEl = document.querySelector('.find-cert-form input'),
    findForm = document.querySelector('.find-cert-form'),
    findBtn = document.querySelector('.find-cert-form button'),
    result = document.querySelector('.delete-cert-wrapper .result')


  findForm.addEventListener('submit', e => e.preventDefault())
  findBtn.addEventListener('click', async () => {
    const certificateCode = findEl.value.trim().toLowerCase(),
      uri = '/verify',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({certificateCode})
      }

      fetch(uri, options)
        .then(res => res.json())
        .then(data => {
          if(data.status !== 200){
            return result.innerHTML = `
              <span class="invalid-code">${data.msg}</span>
            `
          }
          result.innerHTML = `
              <div class="show-found-cert">
                <span class="cert-name" data-id="${data.user._id}">
                  ${data.user.name.toUpperCase()}
                </span>
                <span class="certificate-code">
                  ${data.user.certificateCode}
                </span>
                <button>Delete</button>
                <div class="prompt-dialog">
                  <div class="prompt-box">
                    <span class="confirm-text">
                      Type "<span class="confirm-cert">${data.user.certificateCode.toLowerCase()}</span>" to delete
                    </span>
                    <div class="contrs">
                      <input type="text">
                      <button class="confirm-delete">delete</button>
                    </div>
                  <button class="deny-delete">close</button>
                  </div>
                </div>
              </div>
            `
            const deleteBtn = document.querySelector('.show-found-cert > button'),
              prompt = document.querySelector('.prompt-dialog'),
              confirmEl = document.querySelector('.prompt-box')

            deleteBtn.addEventListener('click', () => prompt.classList.add('active'))

            confirmEl.addEventListener('click', async (e) => {
                let inputValue = confirmEl.querySelector('.contrs input').value.toLowerCase().trim(),
                  certificate = confirmEl.querySelector('.confirm-cert').textContent.toLowerCase()

                if(e.target.classList.contains('confirm-delete')){
                  if(inputValue === certificate){
                    const uri = '/admin/deletecertificate',
                      options = {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({certificateCode})
                      }
                    fetch(uri, options)
                      .then(res => res.json())
                      .then(data => {
                        if(data.status !== 200){
                          return result.innerHTML =  `
                          <span class="is-not-deleted">
                            ${data.msg}
                          </span>
                          `
                        }
                        if(data.status === 200){
                          return result.innerHTML =  `
                          <span class="is-deleted">
                            ${data.msg}
                          </span>
                          `
                        }
                      })
                    prompt.classList.remove('active')
                  }
                }
                if(e.target.classList.contains('deny-delete')) prompt.classList.remove('active')
            })
        })
  })