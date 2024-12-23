const findPartner = document.querySelector('.find-partner-form'),
  result = document.querySelector('.result')

findPartner.addEventListener('submit', async function(e){
  e.preventDefault()

  let partnerId = findPartner.querySelector('input').value.trim().toLowerCase()
  if(!partnerId) return
  partnerId = { partnerId }
  
  const uri = '/admin/findpartner',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(partnerId)
    },
    data = await fetch(uri, options),
    res = await data.json()

    if(res.status !== 201 ){
      result.innerHTML = `
        <span class='fail'> ${res.msg} </span>
      `
    }

    if(res.status === 201 ){
      const approves = res.partner.approvals
      result.innerHTML = `
        <div class="provider-wrapper">
        <form class="provider-form">
          <h3>
            Update Training Partner
          </h3>
          <label for="provider-name">
            <span>
              Training provider name:
            </span>
            <input type="text" id="name" value='${res.partner.name}' required>
          </label>
          <label for="provider-id">
            <span>
              Partner ID:
            </span>
            <input type="text" id="id" value='${res.partner.partnerId}' required>
          </label>
          <label for="provider-id">
            <span>
              Location:
            </span>
            <input type="text" id="location"  value='${res.partner.location}' required>
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
            Add provider
          </button>
        </form>
        </div>
      `
      const approvals = document.querySelector('.provider-wrapper div.approvals')
      approves.forEach(el => {
        approvals.innerHTML +=  `<input type='text' value='${el.approval}'>`
      })
    }


})