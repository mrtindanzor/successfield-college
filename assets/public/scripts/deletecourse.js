const findEl = document.querySelector('.find-course-form input'),
    findBtn = document.querySelector('.find-course-form button'),
    result = document.querySelector('.delete-course-wrapper .result'),
    prompt = document.querySelector('.prompt-dialog'),
    confirmEl = document.querySelector('.prompt-box')


  findBtn.addEventListener('click', async () => {
    const course = findEl.value.trim().toLowerCase(),
      uri = '/admin/findcourse',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({course})
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
              <div class="show-found-course">
                <span class="course-name" data-id="${data.isCourse._id}">
                  ${data.isCourse.course.toUpperCase()}
                </span>
                <span class="course-overview">
                  ${data.isCourse.overview}
                </span>
                <button>Delete</button>
                <div class="prompt-dialog">
                  <div class="prompt-box">
                    <span class="confirm-text">
                      Type "<span class="confirm-course">${data.isCourse.course.toLowerCase()}</span>" to delete
                    </span>
                    <div class="contrs">
                      <input type="text">
                      <button>delete</button>
                    </div>
                  </div>
                </div>
              </div>
            `
            const deleteBtn = document.querySelector('.show-found-course > button')

            deleteBtn.addEventListener('click', () =>prompt.classList.add('active'))

            confirmEl.addEventListener('click', async (e) => {
                let inputValue = confirmEl.querySelector('.contrs input').value.toLowerCase().trim(),
                  courseName = confirmEl.querySelector('.confirm-course').textContent.toLowerCase()

                if(e.target.classList.contains('confirm-delete')){
                  if(inputValue === courseName){
                    const uri = '/admin/deletecourse',
                      options = {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({course})
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