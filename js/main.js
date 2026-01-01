import { fetchContentData, fetchFilterData } from "./fetch.js";

const main = document.querySelector("main");
const noticeWrap = main.querySelector("#notice");
const searchWrap = main.querySelector("#search");
const contentWrap = main.querySelector("#content");
const filterWrap = main.querySelector("#filter");

const contentLength = searchWrap.querySelector(".contentLength");
const searchBtn = searchWrap.querySelector("button");
const bannerBtn = noticeWrap.querySelector("button");
const filterBtn = searchWrap.querySelector(".filterBtn");
const closeBtn = filterWrap.querySelector(".closeBtn");
const layoutBtns = searchWrap.querySelectorAll(".layoutBtn button");
const topBtn = main.querySelector(".topBtn");

// 데이터 배열
let contentArr = [];
let displayArr = [];
let searchArr = [];

// 무한스크롤 기능을 위한 변수
const contentNum = 20;
let loadedCount = 0;
let isContentLast = false;
let isContentLoading = false;

// 필터링 기능을 위한 변수
let filterTypeArr = JSON.parse(localStorage.getItem("typeFilter")) || [];
let filterSeriesArr = JSON.parse(localStorage.getItem("seriesFilter")) || [];
let layoutState = localStorage.getItem("layoutState") || "grid";
let bannerState = localStorage.getItem("bannerActive") || "true";

// 이미지URL
const BASE_URL =
  "https://res.cloudinary.com/dx71aeltq/image/upload/f_auto,q_auto:eco,dpr_auto,c_scale/";

async function fetchInitialContent() {
  contentArr = await fetchContentData();

  contentFilterState();
  restoreScrollState();
  manageLayoutState();
  initBanner();

  window.addEventListener("scroll", contentInfiniteScroll);
}
fetchInitialContent();

function contentFilterState() {
  if (filterTypeArr.length === 0 && filterSeriesArr.length === 0) {
    displayArr = [...contentArr];
    return;
  }

  displayArr = contentArr.filter((content) => {
    const typeMatch =
      filterTypeArr.length === 0 ||
      filterTypeArr.includes(content.type.split("/")[0]);

    const seriesArr = content.seriesId.split(",").map((id) => id.trim());
    const seriesMatch =
      filterSeriesArr.length === 0 ||
      seriesArr.some((id) => filterSeriesArr.includes(id));

    return typeMatch && seriesMatch;
  });
}

function restoreScrollState() {
  const savedLoaded = Number(sessionStorage.getItem("loadedCount"));
  const savedScroll = Number(sessionStorage.getItem("scrollY"));
  const listElement = contentWrap.querySelector("ul");

  loadedCount = 0;
  isContentLast = false;
  isContentLoading = false;
  listElement.innerHTML = "";

  const targetCount = savedLoaded > 0 ? savedLoaded : contentNum;

  while (loadedCount < targetCount && !isContentLast) {
    displayContentItem();
  }

  if (savedScroll > 0) {
    requestAnimationFrame(() => {
      window.scrollTo(0, savedScroll);
    });
  }
}

// 켄텐츠 출력 함수
function displayContentItem() {
  if (isContentLoading || isContentLast) return;

  isContentLoading = true;

  const slice = displayArr.slice(loadedCount, loadedCount + contentNum);

  if (slice.length === 0) {
    isContentLast = true;
    isContentLoading = false;
    return;
  }

  createContentItem(slice);
  loadedCount += slice.length;

  if (loadedCount >= displayArr.length) {
    isContentLast = true;
  }

  contentLength.innerHTML = `검색결과: <strong>${displayArr.length}</strong>`;

  isContentLoading = false;

  requestAnimationFrame(() => {
    if (
      !isContentLast &&
      document.documentElement.scrollHeight <= window.innerHeight
    ) {
      displayContentItem();
    }
  });
}

// 컨텐츠 생성 함수
function createContentItem(content) {
  const listElement = contentWrap.querySelector("ul");
  const fragment = document.createDocumentFragment();

  content.forEach((item) => {
    const li = document.createElement("li");

    const titleIds = item.titleId
      ? item.titleId.split(",").map((id) => id.trim())
      : [];

    const hasTitleText = item.title && item.title.trim() !== "";

    const isTitle =
      (hasTitleText && filterSeriesArr.length === 0) ||
      titleIds.some((id) => filterSeriesArr.includes(id));

    const titleHTML =
      isTitle && hasTitleText
        ? `<strong data-content="${item.title}">${item.title}</strong>`
        : "";

    if (layoutState === "grid") {
      li.className = "gridItem";
      li.innerHTML = `
      <a href="/detail.html?id=${item.id}">
        <div class="itemWrap ${isTitle ? "title" : ""}">
          <div class="itemBg">
            ${titleHTML}
            <img src="${BASE_URL}${item.icon}" alt="${
        item.name
      }" loading="lazy" />
          </div>
          <div class="itemContent">
            <h3>${item.name}</h3>
            <p>${item.type.split("/")[0]}</p>
          </div>
        </div>
      </a>
    `;

      const itemBg = li.querySelector(".itemBg");
      itemBg.style.setProperty("--bg", item.color);
    } else {
      li.className = "listItem";
      li.innerHTML = `
        <a href="./detail.html?id=${item.id}">
          <div class="itemWrap">
            <img src="${BASE_URL}${item.icon}" alt="${item.name}" />
            <div class="itemContent">
              <p>${item.type.split("/")[0]}</p>
              <h3>${item.name}</h3>
            </div>
          </div>
        </a>
      `;
    }

    fragment.appendChild(li);
  });
  listElement.appendChild(fragment);

  contentLength.innerHTML = `검색결과: <strong>${displayArr.length}<strong>`;
}

// 컨텐츠 무한스크롤 기능
let scrollTicking = false;

function contentInfiniteScroll() {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      sessionStorage.setItem("scrollY", window.scrollY);
      sessionStorage.setItem("loadedCount", loadedCount);
      scrollTicking = false;
    });
    scrollTicking = true;
  }

  if (isContentLoading || isContentLast) return;

  const isBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

  if (isBottom) displayContentItem();
}

// 필터데이터 fetch함수
async function filterDataFetch() {
  let filterJson = localStorage.getItem("filter");

  if (filterJson) {
    const filterStorage = JSON.parse(filterJson);
    filterRender(filterStorage.type, filterStorage.series);
    return;
  } else {
    const data = await fetchFilterData();
    localStorage.setItem("filter", JSON.stringify(data));
    filterRender(data.type, data.series);
  }
}

// 네트워크 속도 테스트비교용 절대 삭제 금지
// async function filterDataFetch() {
//   const data = await fetchFilterData();
//   filterRender(data.type, data.series);
// }

// 필터링 아이템 생성 부모 함수
function filterRender(type, series) {
  const typeList = filterWrap.querySelector(".type ul");
  const seriesList = filterWrap.querySelector(".series ul");

  typeList.innerHTML = "";
  seriesList.innerHTML = "";

  createFilterItem(typeList, type, "type");
  createFilterItem(seriesList, series, "series");
}

// 필터링 아이템 생성함수
function createFilterItem(listElement, data, category) {
  const fragment = document.createDocumentFragment();
  data.forEach((item) => {
    const li = document.createElement("li");
    let liContent;
    let isChecked = "";

    // 필터링 활성화 여부 확인
    if (category === "type") {
      isChecked = filterTypeArr.includes(item.title) ? "checked" : "";
    } else {
      isChecked = filterSeriesArr.includes(item.id) ? "checked" : "";
    }

    if (item.fullName) {
      liContent = `
        <input class="a11y-hidden" type="checkbox" id=${item.id} value=${item.title} ${isChecked} />
        <label for=${item.id}>
        <abbr title="${item.fullName}">
          ${item.title}
        </abbr>
        </label>
      `;
    } else {
      liContent = `
        <input class="a11y-hidden" type="checkbox" id=${item.id} value=${item.title} ${isChecked} />
        <label for=${item.id}>${item.title}</label>
      `;
    }
    li.innerHTML = liContent;
    fragment.appendChild(li);
  });
  listElement.appendChild(fragment);
}

// 필터링 기능 함수
function filterClickEvent() {
  const typeFilter = filterWrap.querySelectorAll(
    ".type ul input[type='checkbox']"
  );
  const seriesFilter = filterWrap.querySelectorAll(
    ".series ul input[type='checkbox']"
  );

  handleFilter(typeFilter, "type");
  handleFilter(seriesFilter, "series");
}

// 필터링 조작 기능 구현
function handleFilter(filterList, type) {
  filterList.forEach((filter) => {
    filter.addEventListener("change", (e) => {
      const id = e.target.id;
      const value = e.target.value;
      const checked = e.target.checked;

      if (type === "type") {
        if (checked) {
          filterTypeArr.push(value);
        } else {
          filterTypeArr = filterTypeArr.filter((item) => item !== value);
        }
        filterStorage("typeFilter", filterTypeArr);
      } else if (type === "series") {
        if (checked) {
          filterSeriesArr.push(id);
        } else {
          filterSeriesArr = filterSeriesArr.filter((item) => item !== id);
        }
        filterStorage("seriesFilter", filterSeriesArr);
      }
    });
  });
}

// 필터링 로컬스토리지 저장
function filterStorage(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

// 필터링 기능 구현
function contentFilter(userAction = true) {
  const listElement = contentWrap.querySelector("ul");
  listElement.innerHTML = "";
  loadedCount = 0;
  isContentLast = false;
  isContentLoading = false;

  contentFilterState();

  if (displayArr.length === 0) {
    const warnItem = `
      <li class="warnItem">
        <strong>조건에 만족하는 몬스터가 없습니다.</strong>
      </li>
    `;
    listElement.innerHTML = warnItem;

    contentLength.innerHTML = `검색결과: <strong>0<strong>`;
  } else {
    displayContentItem();
  }

  if (userAction) {
    sessionStorage.clear();
    bannerState ? moveTop(592.5) : moveTop(120);
  }
}

// 필터링 토클 기능
filterBtn.addEventListener("click", async () => {
  await filterDataFetch();
  filterClickEvent();
  filterWrap.classList.add("active");
  document.body.style.overflow = "hidden";
});

const searchInput = searchWrap.querySelector("input");
searchInput.addEventListener("input", (e) => {
  const value = e.target.value;

  searchContent(value);
  createSearchListItem(value);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchAction(e);
    searchInput.value = "";
  }
});

searchBtn.addEventListener("click", (e) => {
  searchAction(e);
  searchInput.value = "";
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

    return search
      .split("")
      .every((text) => new RegExp(text, "i").test(targetText));
  });
}

function createSearchListItem(value) {
  const searchList = searchWrap.querySelector("ul");
  const fragment = document.createDocumentFragment();
  searchList.innerHTML = "";

  if (value === "") {
    searchArr = [];
  }
  searchArr.forEach((item) => {
    const li = document.createElement("li");

    const searchItem = `
        <a href="./detail.html?id=${item.id}">
          <img src="${BASE_URL}${item.icon}" alt="${item.name}" />
          <span>${item.nickname1.split("/")[0]}</span>
          <strong>${item.name}</strong>
        </a>
      `;

    li.innerHTML = searchItem;
    fragment.appendChild(li);
  });
  searchList.appendChild(fragment);
}

closeBtn.addEventListener("click", () => {
  contentFilter(true);
  bannerState ? moveTop(592.5) : moveTop(120);
  filterWrap.classList.remove("active");
  document.body.style.overflow = "visible";
});

// top버튼 클릭시 최상단으로 이동
topBtn.addEventListener("click", () => {
  moveTop(0);
});

function moveTop(yScale) {
  window.scrollTo({ top: yScale, behavior: "smooth" });
}

const listBtn = searchWrap.querySelector(".list");
const gridBtn = searchWrap.querySelector(".grid");

[listBtn, gridBtn].forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const selectedLayout = e.currentTarget.classList.contains("list")
      ? "list"
      : "grid";
    if (layoutState === selectedLayout) return;

    layoutState = selectedLayout;
    updateLayout();

    setTimeout(() => (bannerState ? moveTop(592.5) : moveTop(120)), 50);
  });
});

function updateLayout() {
  resetLayoutState();
  manageLayoutState();

  localStorage.setItem("layoutState", layoutState);

  const listElement = contentWrap.querySelector("ul");
  listElement.innerHTML = "";
  loadedCount = 0;
  isContentLast = false;

  displayContentItem();
}

function resetLayoutState() {
  layoutBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
}

function manageLayoutState() {
  if (layoutState === "grid") {
    gridBtn.classList.add("active");
  } else {
    listBtn.classList.add("active");
  }
}

bannerBtn.addEventListener("click", () => {
  const bannerWrap = noticeWrap.querySelector(".noticeWrap");

  bannerState = String(bannerState) === "true" ? false : true;

  bannerWrap.classList.toggle("active", bannerState);
  bannerBtn.textContent = bannerState ? "배너 닫기" : "배너 열기";

  localStorage.setItem("bannerActive", bannerState);
});

function initBanner() {
  const bannerWrap = noticeWrap.querySelector(".noticeWrap");

  if (localStorage.getItem("bannerActive") === "false") {
    bannerState = false;
  } else {
    bannerState = true;
  }

  bannerBtn.textContent = bannerState ? "배너 닫기" : "배너 열기";
  bannerWrap.classList.toggle("active", bannerState);
}
