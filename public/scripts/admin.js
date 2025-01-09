const showOp = document.querySelectorAll('.side-wrapper ul li span')
  
showOp.forEach(el => {
  el.addEventListener('click', function(){
    const operation = el.nextElementSibling
    operation.classList.toggle('active')
  })
})
