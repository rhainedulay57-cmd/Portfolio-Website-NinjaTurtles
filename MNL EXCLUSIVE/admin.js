const sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu_bar');
const closeBtn = document.querySelector('#close_btn');

const themeToggler = document.querySelector('.theme-toggler');

menuBtn.addEventListener('click',()=>{
    sideMenu.style.display = "block"
})
closeBtn.addEventListener('click',()=>{
    sideMenu.style.display = "none"
})

themeToggler.addEventListener('click',()=>{

    document.body.classList.toggle('dark-theme-variables')

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active')
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active')
})

  document.getElementById("logoutBtn").addEventListener("click", function (event) {
    event.preventDefault(); // para di agad mag-refresh or redirect
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      alert("Logged out successfully!");
      window.location.href = "LoginPage.html";
}
})
