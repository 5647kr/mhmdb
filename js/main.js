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

    this.typeCheckId = new Set();
    this.seriesCheckId = new Set();
    this.monsterDataList = [];
  }

  // 데이터 받는 함수
  async dataSet(data) {
    this.monsterDataList = data[0].monsterList;
    this.typeData(data[1].typeList);
    this.seriesData(data[2].seriesList);

    this.FilterCardEvent();
  }

  // 카드 생성 함수
  // monsterData(data) {
  //   const docFrag = document.createDocumentFragment();
  //   data.map((monster) => {
  //     const monsterItem = document.createElement("li");
  //     const monsterContents = `
  //       <a href="/monster?='${monster.name}'" data-name="${monster.name}" data-type="${monster.type}" data-img="${monster.img}" data-weak="${monster.weak}" data-element="${monster.element}" data-alignment="${monster.alignment}">
  //         <article>
  //           <p>${monster.type}</p>
  //           <img src="${monster.icon}" alt="${monster.name}">
  //           <h3>${monster.name}</h3>
  //           <p class="a11y-hidden">${monster.seriesId}</p>
  //         </article>
  //       </a>
  //     `;
  //     monsterItem.innerHTML = monsterContents;
  //     docFrag.append(monsterItem);
  //   })
  //   this.cardList.append(docFrag);
  // }

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

  // checkbox 클릭시 set에 저장
  ClickCheckBoxEvent() {
    const typeCheck = this.typeList.querySelectorAll("li");
    const seriesCheck = this.seriesList.querySelectorAll("li");

    typeCheck.forEach((type) => {
      type.addEventListener("change", (e) => {
        const checked = e.target.checked;

        checked ? this.typeCheckId.add(e.target.value) : this.typeCheckId.delete(e.target.value);

        this.FilterCardEvent();
      })
    })

    seriesCheck.forEach((series) => {
      series.addEventListener("change", (e) => {
        const checked = e.target.checked;

        checked ? this.seriesCheckId.add(e.target.value) : this.seriesCheckId.delete(e.target.value);

        this.FilterCardEvent();
      })
    })
  }

  // CheckId에 저장된 값을 이용한 필터 기능
  FilterCardEvent() {
    this.cardList.innerHTML = "";
    
    // 선택된 타입과 시리즈에 따라 몬스터 필터링
    const filterCard = this.monsterDataList.filter(monster => {
      const typeFilter = this.typeCheckId.size === 0 || this.typeCheckId.has(monster.type);

      const monsterSeriesIds = monster.seriesId.split(',').map(id => id.trim());
      const seriesFilter = this.seriesCheckId.size === 0 || monsterSeriesIds.some(id => this.seriesCheckId.has(id));

      return typeFilter && seriesFilter;
    });

    // 필터링된 몬스터가 없으면 경고 메시지 표시
    if (filterCard.length === 0) {
      const noCardMatch = document.createElement("strong");
      noCardMatch.textContent = "검색 결과가 없습니다.";
      noCardMatch.classList.add("warnMatch");
      this.cardList.parentNode.appendChild(noCardMatch);

    } else {
      const docFrag = document.createDocumentFragment();

      filterCard.forEach(monster => {
        const monsterItem = document.createElement("li");
        const monsterContents = `
          <a href="#" target="_blank">
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
      });
      this.cardList.append(docFrag);
    }
  }
}

export default MainPage;
