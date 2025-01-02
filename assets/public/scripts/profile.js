import icons from './icons.js'
const spanSelectors = document.querySelectorAll('.li-heading'),
  subSpanSeletors = document.querySelectorAll('.main-links li ul li span'),
  linksMenu = document.querySelector('.main-links'),
  studentIDSelector = document.querySelector('.student-number'),
  titleBar = document.querySelector('.main-page .title-bar'),
  title = titleBar.querySelector('.title'),
  titleBackBtn = document.querySelector('.title-bar .back-button'), 
  profilePhotoBtn = document.getElementById('profile-photo-editor'),
  result = document.querySelector('.result'),
  profileImage = document.querySelector('.profile-img'),
  viewerProfileImage = document.querySelector('.viewer-profile-img'),
  photoTab = document.querySelector('.photo-tab'),
  viewer = document.querySelector('.view-profile-image'),
  dummyPhotoIcon = document.querySelector('.profile-photo-icon'),
  closePhotoIcon = document.querySelector('.close-photo-icon'),
  formEls = document.querySelectorAll('.account-item form.form-container'),
  showPassword = document.querySelectorAll('.form-eye-open'),
  hidePassword = document.querySelectorAll('.form-eye-close')

let temp  = '',
 page = ''
 studentIDSelector.addEventListener('click', function(){
  navigator.clipboard.writeText(studentIDSelector.textContent)
  result.innerHTML = `<span class="success">Student ID copied</span>`
  resetElHtml(result)
 })
titleBackBtn.innerHTML = (new icons('back-button', 'Go Back')).chevronLeft()
spanSelectors.forEach(el => {
  el.addEventListener('click', function(){
    const ulElement = el.parentElement.parentElement.querySelectorAll('ul')
    ulElement.forEach(el => el.classList.remove('active'))
    const ul = el.nextElementSibling,
      spanText = el.textContent
    ul.classList.add('active')
    linksMenu.classList.add('inactive')
    title.textContent = spanText
    titleBar.classList.add('active')
  })
})
subSpanSeletors.forEach(el => {
  const divElement = el.nextElementSibling
  
  el.addEventListener('click', function(){
    subSpanSeletors.forEach(el => {
      const divElement = el.nextElementSibling
      if(divElement?.classList.contains('active')) divElement.classList.remove('active')
    })
    const ulElement = el.parentElement.parentElement.parentElement,
      nextEl = el.nextElementSibling,
      newTitle = el.textContent
      page = newTitle
      temp = ulElement.parentElement.querySelector('.li-heading').textContent
    title.textContent = newTitle
    ulElement.classList.add('inactive')
    if(nextEl) nextEl.classList.add('active')
  })
})
titleBackBtn.addEventListener('click', function(){
  if(temp === ''){
    linksMenu.classList.remove('inactive')
    titleBar.classList.remove('active')
    for(const subSpanSeletor of subSpanSeletors){
      const ulElement = subSpanSeletor.nextElementSibling
      ulElement.classList.remove('active')
    }
  }
  
  if(temp !== ''){
    for(const subSpanSeletor of subSpanSeletors){
      const divElement = subSpanSeletor.nextElementSibling
      if(divElement?.classList.contains('active')){
        let ulElement = subSpanSeletor.parentElement.parentElement.parentElement
        divElement.classList.remove('active')
        ulElement.classList.remove('inactive')
        title.textContent = temp
        temp  = ''
        page = ''
        break
      } 
    }
  }
})
profilePhotoBtn.addEventListener('change', async function(){

  loader.classList.add('active')
  const image = profilePhotoBtn.files[0],
    uri = '/upload',
    formData = new FormData()
  formData.append('image', image)
  const options = {
      method: 'PUT',
      body: formData
    },
    response = await fetch(uri, options),
    res = await response.json()
  
  if(res.status !== 201){
    result.innerHTML = `<span class="failed">${res.msg}</span>`
    loader.classList.remove('active')
    return resetElHtml(result)
  }
  const photoUrl = {publicId: res.publicId, url: res.url},
    photoUpdateUri = '/users/user-image',
    newOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(photoUrl)
    },
    savePhoto = await fetch(photoUpdateUri, newOptions),
    saved = await savePhoto.json()

  if(saved.status !== 201){
    result.innerHTML = `<span class="failed">${saved.msg}</span>`
    loader.classList.remove('active')
    return resetElHtml(result)
  }
  if(!profileImage){
    const img = document.createElement('img')
    img.classList.add('profile-img')
    img.src = res.url
    dummyPhotoIcon.remove()
    photoTab.prepend(img)
  }
  profileImage?.setAttribute('src', res.url)
  viewerProfileImage?.setAttribute('src', res.url)
  result.innerHTML = `<span class="success">${saved.msg}</span>`
  loader.classList.remove('active')
  profilePhotoBtn.value = ''
  return resetElHtml(result)
})
profileImage?.addEventListener('click', () => togglePhoto('show'))
document.body.addEventListener('click', function(e){
  if(e.target !== viewerProfileImage && e.target !== profileImage) togglePhoto('hide')
})
closePhotoIcon.addEventListener('click', () => togglePhoto('hide'))

formEls.forEach(function(formEl){
  formEl.addEventListener('submit', async function(e){
    e.preventDefault()
  
    loader.classList.add('active')
    let uri
    if(page === 'Name') uri = '/users/account-information/username'
    if(page === 'Phone number') uri = '/users/account-information/phonenumber'
    if(page === 'Email') uri = '/users/account-information/email'
    if(page === 'Change password') uri = '/users/account-information/changepassword'
    if(page === 'Reset password') uri = '/users/forgotpassword'
    if(page === 'Account Region') uri = '/users/account-information/region'
    
    const formData = new FormData(formEl),
      jsonData = JSON.stringify(Object.fromEntries(formData)),
      options = {
      method: page === 'Reset password' ? 'POST' : 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    },
    response = await fetch(uri, options),
    res = await response.json()
  
    if(res.status !== 201){
      result.innerHTML = `<span class="failed"> ${res.msg} </span>`
    }
    if(res.status === 201){
      result.innerHTML = `<span class="success"> ${res.msg} </span>`
    }
    loader.classList.remove('active')
    resetElHtml(result)
  })
})
      
for(let show of showPassword){
  show.addEventListener('click', ()=>{
    show.classList.toggle('state-active')

  const hide = show.parentElement.querySelector('.form-eye-close')
    hide.classList.toggle('state-active')

  const showInput = show.parentElement.querySelector('input')
        showInput.setAttribute("type", 'text')
  })
}
for(let hide of hidePassword){
  hide.addEventListener('click', ()=>{
    hide.classList.toggle('state-active')

  const show = hide.parentElement.querySelector('.form-eye-open')
    show.classList.toggle('state-active')

  const hideInput = hide.parentElement.querySelector('input')
        hideInput.setAttribute("type", 'password')
  })
}

function togglePhoto(view){
  if(view === 'hide') viewer.classList.remove('active')
  if(view === 'show') viewer.classList.add('active')
}