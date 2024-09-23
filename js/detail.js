function ActiveBtn () {
  const header = document.querySelector("header");
  const backBtn = header.querySelector(".backBtn");
  const searchBtn = header.querySelector(".searchBtn");
  
  backBtn.addEventListener("click", () => {

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