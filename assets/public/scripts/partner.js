const details = document.querySelectorAll('details')

  details.forEach(el => {
    el.addEventListener('click', function(){
      details.forEach(element => {
        if(element === el) return
        element.removeAttribute('open')
      })
    })
  })