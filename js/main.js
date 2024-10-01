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
    this.warnResult = main.querySelector(".warnResult");

    this.typeCheckId = new Set();
    this.seriesCheckId = new Set();
    this.monsterDataList = [];

    this.loadCheckList(this.typeList.querySelectorAll("li input[type='checkbox'"), "typeCheckId");
    this.loadCheckList(this.seriesList.querySelectorAll("li input[type='checkbox'"), "seriesCheckId");

  }


  // 데이터 받는 함수
  async dataSet(data) {
    this.monsterDataList = data[0].monsterList;
    this.typeData(data[1].typeList);
    this.seriesData(data[2].seriesList);

    this.FilterCardEvent();
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
      console.log(this.aside, this.searchWrap);
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
  }

  // checkbox 클릭시 set에 저장
  ClickCheckBoxEvent() {
    const typeCheck = this.typeList.querySelectorAll("li input[type='checkbox']");
    const seriesCheck = this.seriesList.querySelectorAll("li input[type='checkbox']");

    this.loadCheckList(typeCheck, "typeCheckId");
    this.loadCheckList(seriesCheck, "seriesCheckId");
    
    this.FilterCardEvent();
    
    typeCheck.forEach((type) => {
      type.addEventListener("change", (e) => {
        const checked = e.target.checked;

        checked ? this.typeCheckId.add(e.target.value) : this.typeCheckId.delete(e.target.value);

        this.saveCheckList(typeCheck, "typeCheckId");
        this.FilterCardEvent();
      })
    })
    
    seriesCheck.forEach((series) => {
      series.addEventListener("change", (e) => {
        const checked = e.target.checked;
        
        checked ? this.seriesCheckId.add(e.target.value) : this.seriesCheckId.delete(e.target.value);
        
        this.FilterCardEvent();
        this.saveCheckList(seriesCheck, "seriesCheckId");
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
      this.warnResult.classList.add("active");
    } else {
      this.warnResult.classList.remove("active");
      
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

  saveCheckList(checkboxList, key) {
    const saveList = Array.from(checkboxList).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

    localStorage.setItem(key, JSON.stringify(saveList));
  }

  loadCheckList(checkboxList, key) {
    const loadList = JSON.parse(localStorage.getItem(key)) || [];

    checkboxList.forEach((checkbox) => {
      if(loadList.includes(checkbox.value)) {
        checkbox.checked = true;

        if(key === "typeCheckId") {
          this.typeCheckId.add(checkbox.value);
        } else {
          this.seriesCheckId.add(checkbox.value);
        }
      }
    })
  }

}

export default MainPage;
