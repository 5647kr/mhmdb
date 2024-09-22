function ActiveBtn () {
  const header = document.querySelector("header");
  const main = document.querySelector("main")
  const menuBtn = header.querySelector(".menuBtn");
  const searchBtn = header.querySelector(".searchBtn");
  
  menuBtn.addEventListener("click", () => {
    const aside = main.querySelector(".asideWrap");
    const isActive = aside.classList.contains("active");
    const menuBtnImg = menuBtn.querySelector("img");

    aside.classList.toggle("active");

    if (isActive) {
      menuBtnImg.src = "../img/common/메뉴창.svg";
      menuBtnImg.alt = "메뉴 버튼";
      searchBtn.disabled = false;
    } else {
      menuBtnImg.src = "../img/common/되돌아가기.svg";
      menuBtnImg.alt = "되돌아가기 버튼";
      searchBtn.disabled = true;
      search.classList.remove("active");
    }
  });

  searchBtn.addEventListener("click", () => {
    const search = header.querySelector(".searchWrap");
    const isActive = search.classList.contains("active");
    const searchBtnImg = searchBtn.querySelector("img");

    search.classList.toggle("active");

    if (isActive) {
      searchBtnImg.src = "../img/common/검색.svg";
      searchBtnImg.alt = "검색 버튼";
      menuBtn.disabled = false;
    } else {
      searchBtnImg.src = "../img/common/닫기.svg";
      searchBtnImg.alt = "닫기 버튼";
      menuBtn.disabled = true;
      aside.classList.remove("active");
    }
  });
}
ActiveBtn();
