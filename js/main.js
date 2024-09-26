class MainPageEvent {
  constructor () {
    this.cardList = document.querySelector(".cardWrap ul");
    const aside = document.querySelector("aside");
    this.typeList = aside.querySelector(".typeList");
    this.seriesList = aside.querySelector(".seriesList");
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
      const monsterCard = `
        <a href="#" data-name="${monster.name}" data-type="${monster.type}" data-img="${monster.img}" data-weak="${monster.weak}" data-element="${monster.element}" data-alignment="${monster.alignment}">
          <article>
            <p>${monster.type}</p>
            <img src="${monster.img}" alt="${monster.name}">
            <h3>${monster.name}</h3>
            <p class="a11y-hidden">${monster.seriesId}</p>
          </article>
        </a>
      `;

      monsterItem.innerHTML = monsterCard;
      docFrag.append(monsterItem);
    })
    this.cardList.append(docFrag);
  }
}

export default MainPageEvent;































  // 카드 생성 함수
//   function ActiveBtn {
//     const header = document.querySelector("header");
//     const main = document.querySelector("main")
//     const menuBtn = header.querySelector(".menuBtn");
//     const searchBtn = header.querySelector(".searchBtn");

//     menuBtn.addEventListener("click", () => {
//       const aside = main.querySelector(".asideWrap");
//       const isActive = aside.classList.contains("active");
//       const menuBtnImg = menuBtn.querySelector("img");

//       aside.classList.toggle("active");

//       if (isActive) {
//         menuBtnImg.src = "./img/common/menu.svg";
//         menuBtnImg.alt = "메뉴 버튼";
//         searchBtn.disabled = false;
//       } else {
//         menuBtnImg.src = "./img/common/back.svg";
//         menuBtnImg.alt = "되돌아가기 버튼";
//         searchBtn.disabled = true;
//         search.classList.remove("active");
//       }
//     });

//     searchBtn.addEventListener("click", () => {
//       const search = header.querySelector(".searchWrap");
//       const isActive = search.classList.contains("active");
//       const searchBtnImg = searchBtn.querySelector("img");

//       search.classList.toggle("active");

//       if (isActive) {
//         searchBtnImg.src = "../img/common/search.svg";
//         searchBtnImg.alt = "검색 버튼";
//         menuBtn.disabled = false;
//       } else {
//         searchBtnImg.src = "../img/common/close.svg";
//         searchBtnImg.alt = "닫기 버튼";
//         menuBtn.disabled = true;
//         aside.classList.remove("active");
//       }
//     });
//   }
// // ActiveBtn();