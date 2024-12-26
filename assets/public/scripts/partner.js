const page = document.querySelector('[data-section]').dataset.section,
  loader = document.querySelector('footer .loader')

if(page === 'show'){
  const details = document.querySelectorAll('details')

  details.forEach(el => {
    el.addEventListener('click', function(){
      details.forEach(element => {
        if(element === el) return
        element.removeAttribute('open')
      })
    })
  })
}

if(page === 'add'){

const formEl = document.querySelector('.partner-form'),
result = document.querySelector('.result')

formEl.addEventListener('click', e => {
if(e.target.classList.contains('add-more')){
 const input = document.createElement('input'),
 provider = document.querySelector('.approvals')
 input.setAttribute('type', 'text')
 input.setAttribute('placeholder', 'Approved programs')
 provider.append(input)
}
})

formEl.addEventListener('submit', async e => {
e.preventDefault()

result.innerHTML = ''

const approvals = [],
  name = formEl.querySelector('#name').value.toLowerCase().trim(),
  allPartners = formEl.querySelectorAll('.approvals input'),
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

}

if(page === 'edit'){
  const formEl = document.querySelector('.find-partner'),
    result = document.querySelector('.result')

  formEl.addEventListener('submit', async function(e){
    e.preventDefault()

    result.innerHTML = ''
    const id = formEl.querySelector('input').value.trim().toLowerCase()
    if(!id) return result.textContent = 'Enter a valid partner ID'

    loader.classList.add('active')
    const partnerId = {partnerId: id},
      uri = '/admin/partner',
      options = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(partnerId)
      },
      response = await fetch(uri, options),
      res = await response.json()

    if(res.status !== 200){
      result.innerHTML = `
        <span class="failed">
          ${res.msg} 
        </span>
      `

      loader.classList.remove('active')
      return
    }

    result.innerHTML = `
      <form class="partner-form">
        <h3>
          Edit Training Partner Information
        </h3>
        <label>
          <span>
            Training partner name:
          </span>
          <input type="text" id="name" value='${res.name}' required>
        </label>
        <label>
          <span>
            Partner ID:
          </span>
          <input type="text" id="id" value='${res.partnerId}' required>
        </label>
        <label>
          <span>
            Location:
          </span>
          <input type="text" id="location" value='${res.location}' required>
        </label>
        <label>
          <span>
            Program approvals:
          </span>
          <div class='approvals'>
          </div>
        </label>
        <i class="add-more">add more</i>
        <button>
          Add partner
        </button>
        </form>
    `

    const approvalsContainer = document.querySelector('.approvals'),
      approved = res.approvals

    approved.forEach(el => approvalsContainer.innerHTML += `<input type='text' placeholder="Approved program" value='${el.approval}' >`)
    
    const addMore = document.querySelector('.add-more')

    addMore.addEventListener('click', function(){
      const input = document.createElement('input'),
      provider = document.querySelector('.approvals')
      input.setAttribute('type', 'text')
      input.setAttribute('placeholder', 'Approved programs')
      approvalsContainer.append(input)
    })
    loader.classList.remove('active')

    const editFormEl = document.querySelector('.partner-form')

    editFormEl.addEventListener('submit', async function(e){
      e.preventDefault()

      loader.classList.add('active')
      const newApproved = [],
        name = editFormEl.querySelector('#name').value.toLowerCase().trim(),
        allPartners = editFormEl.querySelectorAll('.approvals input'),
        partnerId = editFormEl.querySelector('#id').value.toLowerCase().trim(),
        location = editFormEl.querySelector('#location').value.toLowerCase().trim()

      allPartners.forEach(el => {
        const value = el.value.toLowerCase().trim()
        newApproved.push({approval: value})
      })

      const partnerProfile = JSON.stringify({name, location, oldApproval: id, approvals: newApproved, partnerId}),
      uri = '/admin/partner',
      options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: partnerProfile
      },
      response = await fetch(uri, options),
      res = await response.json()

      if(res.status !== 201){
        const fail = document.createElement('span')
        fail.classList.add('failed')
        fail.textContent = res.msg
        result.insertBefore(fail, editFormEl)
        setTimeout(function(){
          fail.remove()
        }, 5000)
        loader.classList.remove('active')
        return
      }
      
      result.innerHTML = `
        <span class="success">
          ${res.msg} 
        </span>
      `
      loader.classList.remove('active')
    })
  })
}

if(page === 'delete'){
  const formEl = document.querySelector('.find-partner'),
  result = document.querySelector('.result')

formEl.addEventListener('submit', async function(e){
  e.preventDefault()

  result.innerHTML = ''
  const id = formEl.querySelector('input').value.trim().toLowerCase()
  if(!id) return result.textContent = 'Enter a valid partner ID'

  loader.classList.add('active')
  const partnerId = {partnerId: id},
    uri = '/admin/partner',
    options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(partnerId)
    },
    response = await fetch(uri, options),
    res = await response.json()

  if(res.status !== 200){
    result.innerHTML = `
      <span class="failed">
        ${res.msg} 
      </span>
    `

    loader.classList.remove('active')
    return
  }

  result.innerHTML = `
     <div class="delete-wrapper">
        <h3>Revoke Training Partner</h3>
          <h4>Name:</h4>
          <span>${res.name.toUpperCase()}</span>
          <h4>Partner ID:</h4>
          <span>${res.partnerId.toUpperCase()}</span>
          <h4>Location:</h4>
          <span>${res.location.toUpperCase()}</span>
          <h4>Approved:</h4>
          <ol class="approvals">
          </ol>
          <button class="delete-button">delete</button>
      </div>
      <div class="prompt-dialog">
        <span class="confirm-text">
          Type "<span class="confirm">${res.partnerId.toLowerCase()}</span>" to delete
        </span>
        <div class="contrs">
          <input type="text">
          <button class="confirm-delete">delete</button>
        </div>
        <button class="deny-delete">close</button>
      </div>
  `

  const approvalsContainer = document.querySelector('.approvals'),
    approved = res.approvals

  approved.forEach(el => approvalsContainer.innerHTML += `<li>${el.approval.toUpperCase()}</li>`)

  loader.classList.remove('active')

  const deleteWrapper = document.querySelector('.delete-wrapper'),
    prompt = document.querySelector('.prompt-dialog'),
    deleteBtn = document.querySelector('.delete-button'),
    denyBtn = document.querySelector('.deny-delete'),
    confirmDelete = document.querySelector('.confirm-delete')

  deleteBtn.addEventListener('click', function(){
    loader.classList.add('active')
    prompt.classList.add('active')
  })

  confirmDelete.addEventListener('click', async function(e){
    e.preventDefault()

    const confirmText = document.querySelector('.confirm-text .confirm').textContent.trim().toLowerCase(),
      inputValue = document.querySelector('.contrs input').value.trim().toLowerCase()
    if(confirmText !== inputValue) return

    const uri = '/admin/partner',
    options = {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(partnerId)
    },
    response = await fetch(uri, options),
    res = await response.json()

    if(res.status !== 200){
      const fail = document.createElement('span')
      fail.classList.add('failed')
      fail.textContent = res.msg
      result.insertBefore(fail, deleteWrapper)
      setTimeout(function(){
        fail.remove()
      }, 5000)
      loader.classList.remove('active')
      prompt.classList.remove('active')
      return
    }
    
    result.innerHTML = `
      <span class="success">
        ${res.msg} 
      </span>
    `
    loader.classList.remove('active')
    prompt.classList.remove('active')
  })

  denyBtn.addEventListener('click', function(){
    loader.classList.remove('active')
    prompt.classList.remove('active')
  })
})
}