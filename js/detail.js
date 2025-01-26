class DetailPage {
  constructor() {
    const header = document.querySelector("header");
    this.searchBtn = header.querySelector(".searchBtn");
    this.searchWrap = header.querySelector(".searchWrap");
    this.searchInput = header.querySelector(".searchForm input");
    this.searchList = header.querySelector(".searchList");

    const main = document.querySelector("main");
    this.monsterWrap = main.querySelector(".monsterWrap")
    this.monsterImg = main.querySelector(".monsterImgWrap");
    this.monsterInfo = main.querySelector(".monsterInfoWrap ul");
    this.monsterWeak = main.querySelector(".monsterWeakWrap table tbody");
    this.monsterEco = main.querySelector(".monsterEcoWrap div");

    this.monsterDataList = [];

    this.metaDesc = document.querySelector('meta[name="description"]');

  }

  // 데이터 받는 함수
  async dataSet(data) {
    this.monsterData(data[0].monsterList);
    this.monsterDataList = data[0].monsterList;
  }

  monsterData(data) {
    const route = window.location.search;
    const urlRoute = new URLSearchParams(route);
    const targetMonster = urlRoute.get("monster");

    const monster = data.find(monster => monster.name === targetMonster);

    // title
    document.title = "몬헌 몬스터 DB - " + `${monster.name}` + " 상세 정보"

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

    // monsterRelateWrap
    if(monster.relate) {
      const relateWrap = document.createElement("div");
      const relateContent = `
        <h2>연관 몬스터</h2>
        <ul>
        </ul>
      `
      relateWrap.classList.add("monsterRelateWrap");
      relateWrap.innerHTML = relateContent;
      this.monsterWrap.appendChild(relateWrap);

      const relateList = monster.relate.split(", ");
      
      for(let i = 0; i < relateList.length; i++) {
        data.filter((monster) => {
          if(monster.name === relateList[i]) {
            const relateItem = document.createElement("li");
            const relateItemContent = `
            <a href="/detail.html?monster=${monster.name}">
              <img src="${monster.icon}" alt="${monster.name}">
              ${monster.name}
              </a>
            `
            relateItem.innerHTML = relateItemContent;
            const relateUl = relateWrap.querySelector("ul");
            relateUl.appendChild(relateItem)
          }
        });
      }
    } else {
      return;
    }
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

    // 검색이벤트
    this.searchInput.addEventListener("input", (e) => {
      const searchInputValue = e.target.value;

      this.SearchMonster(searchInputValue);
    })

    // Enter 키 이벤트
    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const firstResult = this.searchList.querySelector("li a");

        if (firstResult) {
          window.location.href = firstResult.href; 
        }
      }
    });

  }

  SearchMonster(searchInputValue) {
    this.searchList.innerHTML = "";
  
    const searchMonster = this.monsterDataList.filter(monster => {
      const monsterName = monster.name;
      const searchTerms = searchInputValue.trim().split(" ");
  
      return searchTerms.every(term => monsterName.includes(term));
    });
  
    this.searchResult = searchMonster;
  
    if (this.searchInput.value === "") {
      this.searchList.innerHTML = "";
    } else {
      const docFrag = document.createDocumentFragment();
    
      searchMonster.forEach(search => {
        const searchItem = document.createElement("li");
    
        const searchContents = `
          <a href="/detail.html?monster=${search.name}">
            <img src="${search.icon}" alt="${search.name}">
            <p>${search.name}</p>
          </a>
        `;
        searchItem.innerHTML = searchContents;
        docFrag.append(searchItem);
      });
      this.searchList.append(docFrag);
    }
  }
  

  HandleSearchMonster(searchInputValue) {
    const searchMonster = this.monsterDataList.filter(monster => 
      monster.name.startsWith(searchInputValue) || monster.name.includes(searchInputValue)
    );

    if (searchMonster.length > 0) {
      const firstMonster = searchMonster[0];
      const newUrl = `/detail.html?monster=${encodeURIComponent(firstMonster.name)}`;
      window.location.href = newUrl;
    }
  }

  UpdateMetaDesc(monster) {
    if (this.metaDesc) {
      const description = `몬헌(몬스터 헌터)시리즈 ${monster.name} 상세 정보 - 몬헌(몬스터 헌터)시리즈에 나오는 ${monster.name}의 정보를 제공합니다. 몬헌(몬스터 헌터)부터 몬헌 선브레이크(몬스터 헌터 라이즈: 선브레이크)까지 모든 걸 확인할 수 있습니다.`;
      this.metaDesc.setAttribute('content', description);
    } else {
      console.warn('메타 디스크립션이 없습니다.');
    }
}  
}

export default DetailPage;