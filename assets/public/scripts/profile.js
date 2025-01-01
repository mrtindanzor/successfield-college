import icons from './icons.js'
const selectLi = document.querySelectorAll('.main-links > li'),
  linksMenu = document.querySelector('.main-links'),
  titleBar = document.querySelector('.main-page .title-bar'),
  titleBackBtn = document.querySelector('.title-bar .back-button'), 
  profilePhotoBtn = document.getElementById('profile-photo-editor'),
  result = document.querySelector('.result'),
  profileImage = document.querySelector('.profile-img')

titleBackBtn.innerHTML = (new icons('back-button', 'Go Back')).chevronLeft()
selectLi.forEach(el => {
el.addEventListener('click', function(){
const ulElement = el.parentElement.querySelectorAll('ul')
ulElement.forEach(el => el.classList.remove('active'))
  const ul = el.querySelector('ul'),
    spanText = el.querySelector('span').textContent,
    title = titleBar.querySelector('.title')
  ul.classList.add('active')
  linksMenu.classList.add('inactive')
  title.textContent = spanText
  titleBar.classList.add('active')
})
})

titleBackBtn.addEventListener('click', function(){
linksMenu.classList.remove('inactive')
titleBar.classList.remove('active')
selectLi.forEach(el => {
  const ulElement = el.querySelector('ul')
  ulElement.classList.remove('active')
})
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
  const photoUrl = {image: res.url},
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
  result.innerHTML = `<span class="success">${saved.msg}</span>`
  profileImage.setAttribute('src', res.url)
  loader.classList.remove('active')
  return resetElHtml(result)
})