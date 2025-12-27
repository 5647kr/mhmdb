import { fetchContentData, fetchFilterData } from "./fetch.js";

const main = document.querySelector("main");
const searchWrap = document.querySelector("#search");
const navigateWrap = main.querySelector("#navigate");
const titleWrap = main.querySelector("#title");
const imgWrap = main.querySelector("#image");
const basicInfoWrap = main.querySelector("#basicInfo");
const seriesInfoWrap = main.querySelector("#seriesInfo");
const weakWrap = main.querySelector("#weakInfo");
const ecoWrap = main.querySelector("#ecoInfo");
const relateWrap = main.querySelector("#relate");

const searchBtn = searchWrap.querySelector("button");
const topBtn = main.querySelector(".topBtn");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// 데이터 저장 변수
let contentArr = [];
let seriesArr = [];
let content = null;
let searchArr = [];

// 초기 데이터 fetch
async function fetchInitialContent() {
  try {
    contentArr = await fetchContentData();
    seriesArr = (await fetchFilterData()).series;

    if (!id) {
      alert("잘못된 접근입니다.");
      window.location.href = "index.html";
      return;
    }

    findContentData();

    if (content) {
      createContent();
    }
  } catch (error) {
    console.error("데이터를 불러오는 중 오류 발생:", error);
  }
}
fetchInitialContent();

function findContentData() {
  const currentIndex = contentArr.findIndex((item) => item.id === id);

  if (currentIndex === -1) {
    console.error("해당 ID의 데이터를 찾을 수 없습니다.");
    return;
  }

  content = contentArr[currentIndex];

  const nav = navigateWrap.querySelector("nav");
  nav.className = "";

  const prevItem = contentArr[currentIndex - 1];
  const nextItem = contentArr[currentIndex + 1];

  let navContent = "";

  if (!prevItem && nextItem) {
    // 첫 번째 아이템
    nav.classList.add("first");
    navContent = createNavElement(null, nextItem);
  } else if (prevItem && nextItem) {
    // 중간 아이템
    nav.classList.add("middle");
    navContent = createNavElement(prevItem, nextItem);
  } else if (prevItem && !nextItem) {
    // 마지막 아이템
    nav.classList.add("last");
    navContent = createNavElement(prevItem, null);
  }

  nav.innerHTML = navContent;
}

function createNavElement(prev, next) {
  let navContent = "";
  if (prev) {
    navContent += `
      <a class="prevContent" href="/detail.html?id=${prev.id}">
        <i class="fa-solid fa-angle-left"></i> ${prev.name}
      </a>`;
  }
  if (next) {
    navContent += `
      <a class="nextContent" href="/detail.html?id=${next.id}">
        ${next.name} <i class="fa-solid fa-angle-right"></i>
      </a>`;
  }
  return navContent;
}

function createContent() {
  // 타이틀 섹션
  const title = titleWrap.querySelector("h2");
  title.textContent = content.name;

  // 이미지 섹션
  const BASE_URL =
    "https://res.cloudinary.com/dx71aeltq/image/upload/f_auto,q_auto:eco,dpr_auto,c_scale/";

  const imgContent = `
    <div>
      <img src="${BASE_URL}${content.img}" alt=${content.name} loading="lazy" >
      <p>${content.small} ~ ${content.large}</p>
    </div>
  `;
  imgWrap.innerHTML = imgContent;

  // 기본정보 섹션
  const infoList = basicInfoWrap.querySelector(".infoList");

  const infoContent = `
  <li class="type">
    <h3>종별</h3>
    <p><span>${content.type.split("/")[0]}</span><br />${
    content.type.split("/")[1]
  }</p>
  </li>
  <li class="species">
    <h3>종</h3>
    <p><span>${content.species}</span></p>
  </li>
  <li class="nickname">
    <h3>별명</h3>
    <p><span>${content.nickname1.split("/")[0]}</span><br />${
    content.nickname1.split("/")[1] || ""
  }</p>
  ${
    content.nickname2 && content.nickname2.split("/")[0]
      ? `<p>
            <span>${content.nickname2.split("/")[0]}</span>
            <br />
            ${content.nickname2.split("/")[1] || ""}
          </p>`
      : ""
  }
  </li>
  <li class="element">
    <h3>속성</h3>
    <p>${content.element}</p>
  </li>
  <li class="ailment">
    <h3>상태이상</h3>
    <p>${content.ailment}</p>
  </li>
  <li class="weakEl">
    <h3>약점 속성</h3>
    <p>${content.weakEl}</p>
  </li>
  `;

  infoList.innerHTML = infoContent;

  // 등장정보 섹션
  const lastSeries = seriesArr[seriesArr.length - 1].series;
  const seriesList = seriesInfoWrap.querySelector("ul");

  for (let i = 0; i < lastSeries; i++) {
    const li = document.createElement("li");
    const title = document.createElement("h3");
    const titleWrap = document.createElement("div");
    title.textContent = `${i + 1}세대`;

    li.appendChild(title);

    // 각 세대별 시리즈 생성
    seriesArr.forEach((item) => {
      if (i + 1 === parseInt(item.series)) {
        const strong = document.createElement("strong");
        strong.textContent = item.title;
        strong.id = item.id;

        strong.classList.remove();

        if (content.seriesId.includes(strong.id)) {
          strong.classList.add("title");
        }

        titleWrap.appendChild(strong);
      }
    });

    li.appendChild(titleWrap);
    seriesList.appendChild(li);
  }

  // 약점정보 섹션
  const weakTable = weakWrap.querySelector("tbody");
  {
    content.weak.forEach((item) => {
      const tr = document.createElement("tr");

      for (const key in item) {
        const td = document.createElement("td");
        td.innerHTML = item[key];
        tr.appendChild(td);
      }

      weakTable.appendChild(tr);
    });
  }

  // 생태정보 섹션
  const ecoContent = ecoWrap.querySelector("div");
  ecoContent.innerHTML = content.eco;

  // 관련컨텐츠 섹션
  const relateArr = relateContent();
  const relateList = relateWrap.querySelector("ul");

  relateList.innerHTML = "";

  if (relateArr.length > 0) {
    relateArr.forEach((relate) => {
      const item = document.createElement("li");

      const itemContent = `
        <a href="detail.html?id=${relate.id}">
          ${relate.name}
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      `;

      item.innerHTML = itemContent;

      relateList.appendChild(item);
    });
  } else {
    const item = document.createElement("li");

    item.textContent = "관련 몬스터가 없습니다.";

    relateList.appendChild(item);
  }
}

function relateContent() {
  const result = [];

  if (content.relate) {
    const names = content.relate.split(", ");

    contentArr.forEach((item) => {
      if (names.includes(item.name)) {
        result.push({
          id: item.id,
          name: item.name,
        });
      }
    });
  }

  return result;
}

const searchInput = searchWrap.querySelector("input");
window.addEventListener("pageshow", () => {
  searchInput.value = "";
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchAction(e);
  }
});

searchBtn.addEventListener("click", (e) => {
  searchAction(e);
});

searchInput.addEventListener("input", (e) => {
  const value = e.target.value;

  searchContent(value);
});

function searchAction(e) {
  e.preventDefault();

  if (searchArr.length === 0) {
    alert("검색 결과가 없습니다.");
    searchInput.value = "";
  }

  if (searchArr.length > 0) {
    window.location.href = `detail.html?id=${searchArr[0].id}`;
  }
}

function searchContent(value) {
  const search = value.trim().replace(/\s/g, "");

  searchArr = contentArr.filter((item) => {
    const content = item.name || "";
    const nickname = item.nickname1 ? item.nickname1.split("/")[0] : "";

    const targetText = (content + nickname).replace(/\s/g, "");

    const searchChar = search.split("");
    return searchChar.every((search) => {
      const regex = new RegExp(search, "i");

      return regex.test(targetText);
    });
  });

  return searchArr;
}

// top버튼 클릭시 최상단으로 이동
topBtn.addEventListener("click", () => {
  moveTop();
});

function moveTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
