const page = document.querySelector('[data-section]').dataset.section
const form = document.querySelector('form.register-student')
const selector = document.querySelector('.select')
const placeholder = document.querySelector('.options-placeholder')
const menu = document.querySelector('.options-menu')
const courseInput = document.getElementById('course')
const options = menu.querySelectorAll('li')

selector.addEventListener('click', function(){
  menu.classList.toggle('active')
})

for(const option of options){
  option.addEventListener('click', function(){
    courseInput.value = option.textContent.trim()
    placeholder.textContent = option.textContent
  })
}
form.addEventListener('submit', async function(e){
  e.preventDefault()
  const studentNumberEl = form.querySelector('.student-number')
  const studentNumber = studentNumberEl.value.toLowerCase().trim()
  studentNumberEl.value = studentNumber
  loaderActive()
  const formData = new FormData(form)
  const jsonData = JSON.stringify(Object.fromEntries(formData))
  const uri = '/admin/register/'
  const method = page === 'add' ? 'PUT' : 'DELETE'
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  const options = {
    method,
    headers,
    body: jsonData
  }
  const response = await fetch(uri, options)
  const res = await response.json()

  switch(res.status){
    case 201:
      form.reset()
      success(res)
        break
    default:
      failed(res)
  }
  loaderInactive()
  resetElHtml(result)
})