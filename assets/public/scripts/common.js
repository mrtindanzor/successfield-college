const cartButton = document.querySelector('#cart-button-checkbox'),
      cartForm = document.querySelector('.cart-form'),
      closeCart = document.querySelector('.cart-close'),
      courseButton = document.querySelector('.menu-item span.button'),
      menuBtn = document.querySelector('.menu-button'),
      svgs = document.querySelector('svg')

svgs.style.opacity = 1
if(courseButton != null){
  courseButton.addEventListener('click', ()=> {
    document.querySelector('.courses-categories').classList.toggle('active')
  })
}

if(menuBtn != null) menuBtn.addEventListener('click', () => document.querySelector('.menu').classList.toggle('active'))

document.body.addEventListener('click', (e)=>{
  if(menuBtn != null) if(!e.target.classList.contains('button') && !e.target.classList.contains('course-option') && !e.target.classList.contains('course-categories')) document.querySelector('.courses-categories').classList.remove('active')
    
    if(menuBtn != null) if(!e.target.classList.contains('menu-button') && !e.target.classList.contains('menu-button-icon') && !e.target.classList.contains('menu-item') && !e.target.parentElement.classList.contains('menu-item')) document.querySelector('.menu').classList.remove('active')
  })

// if(cartButton != null){
//   document.body.addEventListener('click', (e) => {
//   if(!e.target.classList.contains('cart-button') && !e.target.classList.contains('cart-button-icon') && !e.target.classList.contains('cart-close') && !e.target.classList.contains('cart-checkout') && !e.target.classList.contains('cart-list'))
//     if(cartForm.classList.contains('active')){
//       cartForm.classList.remove('active')
//     }
//   })
// } 
 
if(cartButton != null) cartButton.addEventListener('click', () => cartForm.classList.toggle('active'))
if(closeCart != null) closeCart.addEventListener('click', (event) => {
  event.preventDefault()
  cartForm.classList.remove('active')
})
