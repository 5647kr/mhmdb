class DetailPage {
  constructor() {
    const header = document.querySelector("header");
    this.searchBtn = header.querySelector(".searchBtn");
    this.searchWrap = header.querySelector(".searchWrap");

    const main = document.querySelector("main");
    this.monsterImg = main.querySelector(".monsterImgWrap");
    this.monsterInfo = main.querySelector(".monsterInfoWrap");
    this.monsterWeak = main.querySelector(".monsterWeakWrap");
    this.monsterEco = main.querySelector(".monsterEcoWrap");
  }

  // 데이터 받는 함수
  async dataSet(data) {
    this.monsterData(data[0].monsterList);
  }

  monsterData(data) {

  }

  DetailPageEvent() {
    // 검색버튼 이벤트
    this.searchBtn.addEventListener("click", () => {
      const search = header.querySelector(".searchWrap");
      const isActive = search.classList.contains("active");
      const searchBtnImg = searchBtn.querySelector("img");
  
      search.classList.toggle("active");
  
      if (isActive) {
        searchBtnImg.src = "../img/common/search.svg";
        searchBtnImg.alt = "검색 버튼";
        backBtn.disabled = false;
      } else {
        searchBtnImg.src = "../img/common/close.svg";
        searchBtnImg.alt = "닫기 버튼";
        backBtn.disabled = true;
      }
    });
  }
}

export default DetailPage;