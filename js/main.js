const button = document.querySelector('a[href="#top"]');

button.addEventListener('click', function(e) {
  e.preventDefault();
  
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// const menuBtn = document.querySelector(".menu-btn");
// const mobileMenu = document.querySelector(".mobile-menu");
          
// let menuOpen = false;
// menuBtn.addEventListener("click", () => {
//               if (!menuOpen) {
//                 menuBtn.classList.add("open");
//                 mobileMenu.classList.add("show");
//                 menuOpen = true;
//               } else {
//                 menuBtn.classList.remove("open");
//                 mobileMenu.classList.remove("show");
//                 menuOpen = false;
//               }
//             });