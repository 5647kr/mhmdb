class MainPage {
  constructor () {
    const header = document.querySelector("header");
    this.menuBtn = header.querySelector(".menuBtn");
    this.searchBtn = header.querySelector(".searchBtn");
    this.searchWrap = header.querySelector(".searchWrap");
    this.searchInput = this.searchWrap.querySelector(".searchForm input");
    this.searchList = header.querySelector(".searchList");

    const main = document.querySelector("main");
    this.aside = main.querySelector("aside");
    this.typeList = main.querySelector(".typeList");
    this.seriesList = main.querySelector(".seriesList");
    this.cardList = main.querySelector(".cardWrap ul");
    this.warnResult = main.querySelector(".warnResult");
    this.monsterTitle = main.querySelector(".title span");

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

  MainPageEvent() {
    // 버튼 클릭시 메뉴창 & 검색창 여닫기 기능
    this.menuBtn.addEventListener("click", () => {
      // 모바일 태블릿 버튼 기능
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
    
    // checkbox 클릭 이벤트
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
  

  // CheckId에 저장된 값을 이용한 필터 기능
  FilterCardEvent() {
    this.cardList.innerHTML = "";

    // 선택된 타입과 시리즈에 따라 몬스터 필터링
    const filterCard = this.monsterDataList.filter(monster => {
      const typeFilter = this.typeCheckId.size === 0 || this.typeCheckId.has(monster.type);

      // monster.seriesId를 처리
      const monsterSeriesIds = monster.seriesId.split(',').map(id => id.trim());

      // 시리즈 체크박스가 선택되지 않았을 경우
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

        const monsterTitleId = monster.titleId.split(",").map(id => id.trim());

        const hasTitle = monster.title && (
          this.seriesCheckId.size === 0 || 
          monsterTitleId.some(id => this.seriesCheckId.has(id))
        );

        const isTitle = hasTitle ? `
          <div class="title" id="${monster.titleId}">
            <span>${monster.title}</span>
          </div>
        ` : "";


        const monsterContents = `
          <a href="/detail.html?monster=${monster.name}">
            <article class="${hasTitle ? "hasTitle" : ""}">
              ${isTitle}
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

  // checkbox 로컬스토리지에 저장
  saveCheckList(checkboxList, key) {
    const saveList = Array.from(checkboxList).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

    localStorage.setItem(key, JSON.stringify(saveList));
  }

  // checkbox 로컬스토리지에서 로드
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

}

export default MainPage;