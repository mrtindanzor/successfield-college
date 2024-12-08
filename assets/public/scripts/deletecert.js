const findEl = document.querySelector('.find-cert-form input'),
    findBtn = document.querySelector('.find-cert-form button'),
    result = document.querySelector('.delete-cert-wrapper .result')


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
                <span class="certificate-code" data-id="${data.user._id}">
                  ${data.user.name.toUpperCase()}
                </span>
                <span class="certificateCode">
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
                      <button>delete</button>
                    </div>
                  </div>
                </div>
              </div>
            `
            const deleteBtn = document.querySelector('.show-found-cert > button')

            deleteBtn.addEventListener('click', () =>prompt.classList.add('active'))

            confirmEl.addEventListener('click', async (e) => {
                let inputValue = confirmEl.querySelector('.contrs input').value.toLowerCase().trim(),
                  certificate = confirmEl.querySelector('.confirm-cert').textContent.toLowerCase()

                const prompt = document.querySelector('.prompt-dialog'),
                  confirmEl = document.querySelector('.prompt-box')

                if(e.target.classList.contains('confirm-delete')){
                  if(inputValue === certificate){
                    const uri = '/admin/deletecert',
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