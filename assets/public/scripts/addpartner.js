
const formEl = document.querySelector('.provider-form'),
result = document.querySelector('.result')

formEl.addEventListener('click', e => {
if(e.target.classList.contains('add-more')){
 const input = document.createElement('input'),
 provider = document.querySelector('.provider-form label:nth-child(5)')
 provider.append(input)
}
})

formEl.addEventListener('submit', async e => {
e.preventDefault()

result.innerHTML = ''

const approvals = [],
  name = formEl.querySelector('#name').value.toLowerCase().trim(),
  allPartners = formEl.querySelectorAll('form label:nth-child(5) input'),
  partnerId = formEl.querySelector('#id').value.toLowerCase().trim(),
  location = formEl.querySelector('#location').value.toLowerCase().trim()


allPartners.forEach(el => {
  const value = el.value.toLowerCase().trim()
  approvals.push({approval: value})
})

const partnerProfile = JSON.stringify({name, location, approvals, partnerId})

const uri = '/admin/partner',
  options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: partnerProfile
  }
const data = await fetch(uri, options),
  res = await data.json()

if(res.status === 201){
  result.innerHTML = `
    <span class="add-success">
      ${res.msg}
    </span>
  `
}
if(res.status !== 201){
  result.innerHTML = `
    <span class="add-fail">
      ${res.msg}
    </span>
  `
}
})
