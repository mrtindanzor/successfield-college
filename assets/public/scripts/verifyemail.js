const timeout = document.querySelector('.timeout')
let count = 10

if(timeout){
  timeout.textContent = count
  function counter(){
    setInterval(()=> {
      if(count === 1) return
      count--
      timeout.textContent = count
    }, 1000)
  }
  function redirect(){
    setTimeout(() => {
      window.location.href = '/users/login'
    }, 5000);
  }
  counter()
  redirect()
}
