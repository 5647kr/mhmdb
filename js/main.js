const header = document.querySelector("header");
const main = document.querySelector("main")
const menuBtn = header.querySelector(".menuBtn");
const searchBtn = header.querySelector(".searchBtn");

menuBtn.addEventListener("click", () => {
  const aside = main.querySelector("aside");
  const isActive = aside.classList.contains("active");
  const menuBtnImg = menuBtn.querySelector("img");

  aside.classList.toggle("active");
  isActive ? menuBtnImg.src="../img/common/메뉴창.svg" : menuBtnImg.src="../img/common/되돌아가기.svg"
});

searchBtn.addEventListener("click", () => {
  const search = header.querySelector(".searchWrap");
  const isActive = search.classList.contains("active");
  const searchBtnImg = searchBtn.querySelector("img");

  search.classList.toggle("active");
  isActive ? searchBtnImg.src="../img/common/검색.svg" : searchBtnImg.src="../img/common/닫기.svg"
})