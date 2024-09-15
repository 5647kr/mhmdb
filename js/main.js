const header = document.querySelector("header");
const main = document.querySelector("main")
const menuBtn = header.querySelector(".menuBtn");

menuBtn.addEventListener("click", () => {
  const aside = main.querySelector("aside");
  const isActive = aside.classList.contains("active");
  const menuBtnImg = menuBtn.querySelector("img");

  aside.classList.toggle("active");
  isActive ? menuBtnImg.src="../img/common/메뉴창.svg" : menuBtnImg.src="../img/common/되돌아가기.svg"
})