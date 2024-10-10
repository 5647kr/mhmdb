class DetailPage {
  constructor() {
    const header = document.querySelector("header");
    this.searchBtn = header.querySelector(".searchBtn");
    this.searchWrap = header.querySelector(".searchWrap");

    const main = document.querySelector("main");
    this.monsterImg = main.querySelector(".monsterImgWrap");
    this.monsterInfo = main.querySelector(".monsterInfoWrap ul");
    this.monsterWeak = main.querySelector(".monsterWeakWrap table tbody");
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
    const nickname1Main = monster.nickname1.split("/")[0] || "";
    const nickname1Detail = monster.nickname1.split("/")[1] || "";
    const nickname2Main = monster.nickname2.split("/")[0] || "";
    const nickname2Detail = monster.nickname2.split("/")[1] || "";

    const monsterInfoContents = `
      <li>
        <h3>이름</h3>
        <p>${monster.name}</p>
      </li>
      <li>
        <h3>속성</h3>
        <p>${monster.element || "없음"}</p>
      </li>
      <li>
        <h3>종별</h3>
        <p>${monster.type || "없음"}</p>
      </li>
      <li>
        <h3>상태이상</h3>
        <p>${monster.ailment || "없음"}</p>
      </li>
      <li>
        <h3>종</h3>
        <p>${monster.species || "없음"}</p>
      </li>
      <li>
        <h3>크기</h3>
        <p>${monster.small} ~ ${monster.large}</p>
      </li>
      <li>
        <h3>별명</h3>
        <p>${nickname1Main}</p>
        <p class="detail">${nickname1Detail}</p>
        <p>${nickname2Main}</p>
        <p class="detail">${nickname2Detail}</p>
      </li>
      <li>
        <h3>작품</h3>
        <p>${monster.series}</p>
      </li>
    `;
    this.monsterInfo.innerHTML = monsterInfoContents;

    // monsterWeakWrap
    const monsterWeak = monster.weak;

    this.monsterWeak.innerHTML = ''; 

    monsterWeak.forEach((weak) => {
      const tr = document.createElement("tr");

      for (const key in weak) {
        const td = document.createElement("td");
        td.textContent = weak[key] || "없음";
        tr.appendChild(td);
      }
    
      this.monsterWeak.appendChild(tr);
    });

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