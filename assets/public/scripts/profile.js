import icons from './icons.js'
const selectLi = document.querySelectorAll('.main-links > li'),
  linksMenu = document.querySelector('.main-links'),
  titleBar = document.querySelector('.main-page .title-bar'),
  titleBackBtn = document.querySelector('.title-bar .back-button'), 
  profilePhotoBtn = document.getElementById('profile-photo-editor'),
  result = document.querySelector('.result'),
  profileImage = document.querySelector('.profile-img'),
  viewerProfileImage = document.querySelector('.viewer-profile-img'),
  photoTab = document.querySelector('.photo-tab'),
  viewer = document.querySelector('.view-profile-image'),
  dummyPhotoIcon = document.querySelector('.profile-photo-icon'),
  closePhotoIcon = document.querySelector('.close-photo-icon')

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
  if(profileImage) profileImage.setAttribute('src', res.url)
  result.innerHTML = `<span class="success">${saved.msg}</span>`
  loader.classList.remove('active')
  profilePhotoBtn.value = ''
  return resetElHtml(result)
})
profileImage.addEventListener('click', () => togglePhoto('show'))
document.body.addEventListener('click', function(e){
  if(e.target !== viewerProfileImage && e.target !== profileImage) togglePhoto('hide')
})
closePhotoIcon.addEventListener('click', () => togglePhoto('hide'))

function togglePhoto(view){
  if(view === 'hide') viewer.classList.remove('active')
  if(view === 'show') viewer.classList.add('active')
}