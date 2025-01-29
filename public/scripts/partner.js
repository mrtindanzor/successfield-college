const page = document.querySelector('[data-section]').dataset.section

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

const formEl = document.querySelector('.partner-form')

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


loaderActive()

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
const response = await fetch(uri, options),
  res = await response.json()

if(res.status !== 201){
  failed(res)
  document.formEl.scrollTo = 0
  loaderInactive()
  resetElHtml(result)
  return
}

success(res)
loaderInactive()
resetElHtml(result)
})

}

if(page === 'edit'){
  const formEl = document.querySelector('.find-partner')

  formEl.addEventListener('submit', async function(e){
    e.preventDefault()

    
    const id = formEl.querySelector('input').value.trim().toLowerCase()
    if(!id) return result.textContent = 'Enter a valid partner ID'

    loaderActive()
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
      failed(res)
      loaderInactive()
      resetElHtml(result)
      return
    }
    const editResult = document.querySelector('.edit-result')
    editResult.innerHTML = `
      <form class="partner-form form-basic gap-20 bg-white">
        <h2 class="head ff-pb clr-white bg-primary">
          Edit Training Partner Information
        </h2>
        <label>
          <span  class="label" class="label">
            Training partner name:
          </span>
          <input type="text" class="br-1px br-primary" id="name" value='${res.name}' required>
        </label>
        <label>
          <span  class="label">
            Partner ID:
          </span>
          <input type="text" class="br-1px br-primary" id="id" value='${res.partnerId}' required>
        </label>
        <label>
          <span  class="label">
            Location:
          </span>
          <input type="text" class="br-1px br-primary" id="location" value='${res.location}' required>
        </label>
        <label>
        <span  class="label">
          Program approvals:
        </span>
        <div class='approvals dp-f fl-dr-c gap-10'>
        </div>
        </label>
        <i class="add-more button bg-primary clr-white pd-5 w-fc br-radius-4 ff-pl">add more</i>
        <button class="clr-white">
          Edit partner
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
      input.classList.add('mg-bottom-10')
      input.setAttribute('type', 'text')
      input.setAttribute('placeholder', 'Approved programs')
      approvalsContainer.append(input)
    })
    loaderInactive()

    const editFormEl = document.querySelector('.partner-form')

    editFormEl.addEventListener('submit', async function(e){
      e.preventDefault()

      loaderActive()
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
        result.insertBefore(failed(res), editFormEl)
        resetElHtml(result)
        loaderInactive()
        return
      }
      
      success(res)
      loaderInactive()
      resetElHtml(result)
    })
  })
}

if(page === 'delete'){
  const formEl = document.querySelector('.find-partner')

formEl.addEventListener('submit', async function(e){
  e.preventDefault()

  
  const id = formEl.querySelector('input').value.trim().toLowerCase()
  if(!id) return result.textContent = 'Enter a valid partner ID'

  loaderActive()
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
    failed(res)
    loaderInactive()
    resetElHtml(result)
    return
  }
  const deleteResult = document.querySelector('.delete-result')
  deleteResult.innerHTML = `
     <div class="delete-wrapper">
        <h3>Revoke Training Partner</h3>
          <h4>Name:</h4>
          <span>${res.name}</span>
          <h4>Partner ID:</h4>
          <span>${res.partnerId}</span>
          <h4>Location:</h4>
          <span>${res.location}</span>
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

  approved.forEach(el => approvalsContainer.innerHTML += `<li>${el.approval}</li>`)

  loaderInactive()

  const deleteWrapper = document.querySelector('.delete-wrapper'),
    prompt = document.querySelector('.prompt-dialog'),
    deleteBtn = document.querySelector('.delete-button'),
    denyBtn = document.querySelector('.deny-delete'),
    confirmDelete = document.querySelector('.confirm-delete')

  deleteBtn.addEventListener('click', function(){
    loaderActive()
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
      result.insertBefore(failed(res), deleteWrapper)
      resetElHtml(result)
      loaderInactive()
      prompt.classList.remove('active')
      return
    }
    resetElHtml(deleteResult)
    success(res)
    loaderInactive()
    prompt.classList.remove('active')
    resetElHtml(result)
  })

  denyBtn.addEventListener('click', function(){
    loaderInactive()
    prompt.classList.remove('active')
  })
})
}
