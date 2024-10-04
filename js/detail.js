class DetailPage {
  constructor() {
    const header = document.querySelector("header");
    this.searchBtn = header.querySelector(".searchBtn");
    this.searchWrap = header.querySelector(".searchWrap");

    const main = document.querySelector("main");
    this.monsterImg = main.querySelector(".monsterImgWrap");
    this.monsterInfo = main.querySelector(".monsterInfoWrap ul");
    this.monsterWeak = main.querySelector(".monsterWeakWrap");
    this.monsterEco = main.querySelector(".monsterEcoWrap div");
  }

  // 데이터 받는 함수
  async dataSet(data) {
    this.monsterData(data[0].monsterList);
  }

  monsterData(data) {
    const route = window.location.search;
    const urlRoute = new URLSearchParams(route);
    const targetMonster = urlRoute.get("monster");

    const monster = data.find(monster => monster.name === targetMonster);

    // monsterImgWrap
    const monsterImgContents = `
      <h1 class="a11y-hidden">${monster.name}</h1>
      <img src="${monster.imgurl}" alt="${monster.name}">
    `;
    this.monsterImg.innerHTML = monsterImgContents;

    // monsterInfoWrap
    const monsterInfoContents = `
      <li>
        <h3>이름</h3>
        <p>${monster.name}</p>
      </li>
      <li>
        <h3>속성</h3>
        <p>${monster.element}</p>
      </li>
      <li>
        <h3>종별</h3>
        <p>${monster.type}</p>
      </li>
      <li>
        <h3>상태이상</h3>
        <p>${monster.ailment}</p>
      </li>
      <li>
        <h3>종</h3>
        <p>${monster.species}</p>
      </li>
      <li>
        <h3>크기</h3>
        <p>${monster.small} ~ ${monster.large}</p>
      </li>
      <li>
        <h3>별명7</h3>
        <p>${monster.nickname1}</p>
        <p class="detail">${monster.nickname1}</p>
        <p>${monster.nickname2}</p>
        <p class="detail">${monster.nickname2}</p>
      </li>
      <li>
        <h3>작품</h3>
        <p>${monster.series}</p>
      </li>
    `;
    this.monsterInfo.innerHTML = monsterInfoContents;

    // monsterWeakWrap


    // monsterEcoWrap
    const monsterEcoContents = `
      ${monster.eco}
    `;
    this.monsterEco.innerHTML = monsterEcoContents;
  }

  DetailPageEvent() {
    // 검색버튼 이벤트
    this.searchBtn.addEventListener("click", () => {
      const isActive = this.searchWrap.classList.contains("active");
      const searchBtnImg = this.searchBtn.querySelector("img");
  
      this.searchWrap.classList.toggle("active");
  
      if (isActive) {
        searchBtnImg.src = "../img/common/search.svg";
        searchBtnImg.alt = "검색 버튼";
      } else {
        searchBtnImg.src = "../img/common/close.svg";
        searchBtnImg.alt = "닫기 버튼";
      }
    });
  }
}

export default DetailPage;