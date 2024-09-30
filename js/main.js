class MainPage {
  constructor () {
    const header = document.querySelector("header");
    this.menuBtn = header.querySelector(".menuBtn");
    this.searchBtn = header.querySelector(".searchBtn");
    this.searchWrap = header.querySelector(".searchWrap");

    const main = document.querySelector("main");
    this.aside = main.querySelector("aside");
    this.typeList = main.querySelector(".typeList");
    this.seriesList = main.querySelector(".seriesList");
    this.cardList = main.querySelector(".cardWrap ul");
  }

  // 데이터 받는 함수
  async dataSet(data) {
    this.monsterData(data[0].monsterList);
    this.typeData(data[1].typeList);
    this.seriesData(data[2].seriesList);
  }

  // 카드 생성 함수
  monsterData(data) {
    const docFrag = document.createDocumentFragment();
    data.map((monster) => {
      const monsterItem = document.createElement("li");
      const monsterContents = `
        <a href="/monster?='${monster.name}'" data-name="${monster.name}" data-type="${monster.type}" data-img="${monster.img}" data-weak="${monster.weak}" data-element="${monster.element}" data-alignment="${monster.alignment}">
          <article>
            <p>${monster.type}</p>
            <img src="${monster.icon}" alt="${monster.name}">
            <h3>${monster.name}</h3>
            <p class="a11y-hidden">${monster.seriesId}</p>
          </article>
        </a>
      `;
      monsterItem.innerHTML = monsterContents;
      docFrag.append(monsterItem);
    })
    this.cardList.append(docFrag);
  }

  // type & series checkbox 생성 함수
  typeData(data) {
    const docFrag = document.createDocumentFragment();
    data.map((type) => {
      const typeItem = document.createElement("li");
      const typeContents = `
        <input type="checkbox" id="${type.type}" value="${type.type}">
        <label for="${type.type}">${type.type}</label>
      `;
      typeItem.innerHTML = typeContents;
      docFrag.append(typeItem);
    })
    this.typeList.append(docFrag)
  }

  seriesData(data) {
    const docFrag = document.createDocumentFragment();
    data.map((series) => {
      const seriesItem = document.createElement("li");
      const seriesContents = `
        <input type="checkbox" id="${series.id}" value="${series.id}">
        <label for="${series.id}">
          <abbr title="${series.fullName}">
            ${series.series}
          </abbr>
        </label>
      `;
      seriesItem.innerHTML = seriesContents;
      docFrag.append(seriesItem);
    })
    this.seriesList.append(docFrag)
  }


  // 모바일 태블릿 버튼 기능
  ToggleBtnEvent() {
    // 버튼 클릭시 메뉴창 & 검색창 여닫기 기능
    this.menuBtn.addEventListener("click", () => {
      const isActive = this.aside.classList.contains("active");
      const menuBtnImg = this.menuBtn.querySelector("img");

      this.aside.classList.toggle("active");

      if (isActive) {
        menuBtnImg.src = "./img/common/menu.svg";
        menuBtnImg.alt = "메뉴 버튼";
        this.searchBtn.disabled = false;
      } else {
        menuBtnImg.src = "./img/common/back.svg";
        menuBtnImg.alt = "되돌아가기 버튼";
        this.searchBtn.disabled = true;
        this.searchWrap.classList.remove("active");
      }
    });

    this.searchBtn.addEventListener("click", () => {
      const isActive = this.searchWrap.classList.contains("active");
      const searchBtnImg = this.searchBtn.querySelector("img");

      this.searchWrap.classList.toggle("active");

      if (isActive) {
        searchBtnImg.src = "../img/common/search.svg";
        searchBtnImg.alt = "검색 버튼";
        this.menuBtn.disabled = false;
      } else {
        searchBtnImg.src = "../img/common/close.svg";
        searchBtnImg.alt = "닫기 버튼";
        this.menuBtn.disabled = true;
        this.aside.classList.remove("active");
      }
    });

    // checkbox 클릭시 필터링 기능
    
  }

  // 필터링 기능
  FilterCardEvent() {

  }
}

export default MainPage;












// // 메뉴 버튼 클릭 이벤트


// // 검색 버튼 클릭 이벤트
