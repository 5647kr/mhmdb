class MainPage {
  constructor() {
    const header = document.querySelector("header");
    this.menuBtn = header.querySelector(".menuBtn");
    this.searchBtn = header.querySelector(".searchBtn");
    this.searchWrap = header.querySelector(".searchWrap");
    this.searchInput = this.searchWrap.querySelector(".searchForm input");
    this.searchList = header.querySelector(".searchList");

    const main = document.querySelector("main");
    this.slideList = main.querySelector(".slideWrap ul");
    this.aside = main.querySelector("aside");
    this.typeList = main.querySelector(".typeList");
    this.seriesList = main.querySelector("ul.seriesList");
    this.cardList = main.querySelector(".cardWrap ul");
    this.warnResult = main.querySelector(".warnResult");
    this.monsterTitle = main.querySelector(".title span");

    this.typeCheckId = new Set();
    this.seriesCheckId = new Set();
    this.monsterDataList = [];

    this.displayedMonsters = 0; // 현재 표시된 몬스터 수
    this.isLoading = false; // 여러 번 로드 방지

    this.loadCheckList(this.typeList.querySelectorAll("li input[type='checkbox']"), "typeCheckId");
    this.loadCheckList(this.seriesList.querySelectorAll("li input[type='checkbox']"), "seriesCheckId");

    //this.MainPageEvent(); // 이벤트 설정
  }

  // 데이터 설정 함수
  async dataSet(data) {
    this.monsterDataList = data[0].monsterList;
    this.typeData(data[1].typeList);
    this.seriesData(data[2].seriesList);

    this.loadInitialMonsters(); // 초기 15개 몬스터 로드
    this.FilterCardEvent();
    this.setupScrollListener(); // 스크롤 리스너 초기화
  }

  // 초기 15개 몬스터 로드
  loadInitialMonsters() {
    this.displayedMonsters = 15; // 처음 15개를 로드하도록 설정
    this.FilterCardEvent(); // 필터 적용하여 몬스터 표시
  }

  // 타입 & 시리즈 체크박스 생성 함수
  typeData(data) {
    const docFrag = document.createDocumentFragment();
    data.forEach((type) => {
      const typeItem = document.createElement("li");
      const typeContents = `
        <input type="checkbox" id="${type.type}" value="${type.type}">
        <label for="${type.type}">${type.type}</label>
      `;
      typeItem.innerHTML = typeContents;
      docFrag.append(typeItem);
    });
    this.typeList.append(docFrag);
  }

  seriesData(data) {
    const docFrag = document.createDocumentFragment();
    data.forEach((series) => {
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
    });
    this.seriesList.append(docFrag);
  }

  MainPageEvent() {
    // 메뉴 및 검색 버튼 클릭 이벤트
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

    // 체크박스 이벤트
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
      });
    });

    seriesCheck.forEach((series) => {
      series.addEventListener("change", (e) => {
        const checked = e.target.checked;

        checked ? this.seriesCheckId.add(e.target.value) : this.seriesCheckId.delete(e.target.value);

        this.saveCheckList(seriesCheck, "seriesCheckId");
        this.FilterCardEvent();
      });
    });

    // 검색 이벤트
    this.searchInput.addEventListener("input", (e) => {
      const searchInputValue = e.target.value;
      this.SearchMonster(searchInputValue);
    });

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

    // 이미지 슬라이드 기능
    this.ImgSlide();
  }

  // 체크된 아이디를 이용한 필터 기능
  FilterCardEvent() {
    this.cardList.innerHTML = "";
    const filteredMonsters = this.getFilteredMonsters();

    const monstersToDisplay = filteredMonsters.slice(0, this.displayedMonsters);
    this.renderMonsters(monstersToDisplay);

    if (filteredMonsters.length === 0) {
      this.warnResult.classList.add("active");
    } else {
      this.warnResult.classList.remove("active");
    }
  }

  getFilteredMonsters() {
    return this.monsterDataList.filter(monster => {
      const typeFilter = this.typeCheckId.size === 0 || this.typeCheckId.has(monster.type.split("/")[0]);
      const monsterSeriesIds = monster.seriesId.split(',').map(id => id.trim());
      const seriesFilter = this.seriesCheckId.size === 0 || monsterSeriesIds.some(id => this.seriesCheckId.has(id));
      return typeFilter && seriesFilter;
    });
  }

  renderMonsters(monsters) {
    const docFrag = document.createDocumentFragment();

    monsters.forEach(monster => {
      const monsterItem = document.createElement("li");
      const monsterTitleId = monster.titleId.split(",").map(id => id.trim());
      const monsterType = monster.type.split("/")[0];
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
        <a href="./detail.html?monster=${monster.name}">
          <article class="${hasTitle ? "hasTitle" : ""}">
            ${isTitle}
            <p>${monsterType}</p>
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

  setupScrollListener() {
    window.addEventListener('scroll', () => {
      if (this.isLoading) return; // 이미 로딩 중이면 무시

      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100; // 100px 남았을 때
      if (nearBottom) {
        this.loadMoreMonsters();
      }
    });
  }

  loadMoreMonsters() {
    const filteredMonsters = this.getFilteredMonsters();

    // 이미 표시된 몬스터 수만큼 스킵하고 다음 15개 로드
    const nextMonsters = filteredMonsters.slice(this.displayedMonsters, this.displayedMonsters + 15);
    if (nextMonsters.length > 0) {
      this.isLoading = true; // 로딩 중 표시
      this.displayedMonsters += nextMonsters.length; // 현재 표시된 몬스터 수 업데이트
      this.renderMonsters(nextMonsters); // 추가 몬스터 렌더링
      this.isLoading = false; // 로딩 중 표시 해제
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
      if (loadList.includes(checkbox.value)) {
        checkbox.checked = true;
        if (key === "typeCheckId") {
          this.typeCheckId.add(checkbox.value);
        } else {
          this.seriesCheckId.add(checkbox.value);
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
          <a href="./detail.html?monster=${search.name}">
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

  ImgSlide() {
    let currentSlide = 0;
    const slideWidth = 100;
    this.totalSlides = 3;

    setInterval(() => {
      currentSlide++;

      // 인덱스가 총 슬라이드 수에 도달하면 0으로 리셋
      if (currentSlide >= this.totalSlides) {
        currentSlide = 0;
      }

      this.slideList.style.marginLeft = `-${currentSlide * slideWidth}%`;
    }, 5000);
  }
}

export default MainPage;
