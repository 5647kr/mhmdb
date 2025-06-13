# MHMDB


## 0. 목차

1.  [프로젝트 소개](#1-프로젝트-소개)
2.  [기술 개발 구현](#2-기술-개발-구현)
3.  [트러블 슈팅](#3-트러블-슈팅)
4.  [기술 스택](#4-기술-스택)
5.  [코딩 컨벤션](#5-코딩-컨벤션)
6.  [시연 이미지](#6-시연-이미지)
7.  [미래 개선 방향](#7-미래-개선-방향)
8.  [성과 및 느낀 점](#8-성과-및-느낀-점)
<br>

<br>

## 1. 프로젝트 소개
몬스터 헌터라는 게임이 2024년 20주년을 맞이하였습니다. 20년동안 시리즈를 이어온 게임인 만큼 게임 속 방대한 몬스터를 정리해보고 싶은 마음에 시작하였습니다. 해당 사이트는 총 227개의 몬스터를 한 페이지에서 확인할 수 있으며, 자세한 내용은 상세페이지로 이동해 자세히 볼 수 있습니다. 검색과 필터링 기능을 통해 좀 더 편하게 컨텐츠를 볼 수 있으며, 반응형을 고려해 모바일, 태블릿, 노트북, PC 까지 모든 플랫폼에서 컨텐츠를 보기 편리합니다.

배포 URL: 

<br>

## 2. 기술 개발 구현

### 1. 검색 기능
<br>
사용자가 입력한 값의 앞뒤 공백을 제거한 뒤 문자별로 나눠 모든 문자가 포함되어있는 값을 반환해 이에 만족하는 결과를 반환하는 코드입니다. 반환한 값에 따라 만족하는 결과를 li를 생성하여 리스트로 나열합니다.
<br>

```
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
```
<br>

### 2. 필터링 기능
<br>
사용자가 클릭한 checkbox의 id값을 이용하여 만족하는 경우에만 몬스터카드를 필터링하는 기능입니다. 사용자가 아무것도 선택하지 않을 경우 모든 몬스터카드를 포함하지만, 선택한 경우 해당 조건을 만족하는 몬스터카드만을 포함합니다.
<br>

```
  // 선택된 타입과 시리즈에 따라 몬스터 필터링
  const filterCard = this.monsterDataList.filter(monster => {
    const typeFilter = this.typeCheckId.size === 0 || this.typeCheckId.has(monster.type);

    // monster.seriesId를 처리
    const monsterSeriesIds = monster.seriesId.split(',').map(id => id.trim());

    // 시리즈 체크박스가 선택되지 않았을 경우
    const seriesFilter = this.seriesCheckId.size === 0 || monsterSeriesIds.some(id => this.seriesCheckId.has(id));

    return typeFilter && seriesFilter;
  });
```

<br>

## 3. 트러블 슈팅

### 1. 초기화 되는 필터링 기능
<br>
checkbox를 이용한 필터링 기능 이후 몬스터카드를 클릭해 상세페이지로 이동한 뒤 다시 메인 페이지로 돌아오면 checkbox에 체크한 필터링 기능이 초기화하게 됩니다. 매번 메인 페이지로 돌아올 때마다 checkbox를 다시 클릭해야 하면 사용자 접근성이 떨어지게 됩니다. 이 문제를 해결하기 위해 로컬스토리지를 이용해 checkbox의 id값을 저장하고 로드하며 필터링 기능을 유지하게 하였습니다.
<br>

```
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
```
<br>

### 2. PC 경로 문제
<br>
html&css를 통해 UI 작업을 마무리한 뒤 JS에서 json파일과 통신하는 중 문제가 생겼습니다. 분명 제대로 호출하고 있다 생각했으나 문제가 생겨 확인해보니, 경로를 제대로 작성하지 않아 생긴 문제였습니다. 이에 전체적으로 경로를 확인해 통신문제를 해결할 수 있었습니다.

```
  async loadData() {
    try {
      const response = await fetch("./js/index.json");
      // 서버로 부터 응답이 정상적일 때 응답 코드: 200 ~ 299
      if(response.ok) {
        // json이였던 것을 js 객체로 변환
        return response.json();
      } else {
        // response의 상태에 대한 에러를 던진다.
        throw new Error(response.status);
      }
    } catch (error) {
      console.log(error);
    }
  }
```

<br>

## 4. 기술 스택

<table>
  <tr>
    <td align="center" width="100px">사용 기술</td>
    <td width="800px">
      <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">&nbsp  
      <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">&nbsp 
      <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> &nbsp
    </td>
  </tr>
  <tr>
    <td align="center">기술 도구</td>
    <td>
      <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white"/>&nbsp 
      <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
    </td>
  <tr>
    <td align="center">디자인</td>
    <td>
      <img src="https://img.shields.io/badge/Figma-d90f42?style=for-the-badge&logo=Figma&logoColor=white"/>&nbsp  
    </td>
  </tr>
  <tr>
    <td align="center">IDE</td>
    <td>
      <img src="https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white"/>&nbsp
  </tr>
</table>

<br>

## 5. 코딩 컨벤션

<br>

<detail>
  <table>
    <tr>
      <th>커밋 유형</th>
      <th>커밋 메세지</th>
      <th>의미</th>
    </tr>
    <tr>
      <td>✨</td>
      <td>Feat</td>
      <td>새로운 기능 추가</td>
    </tr>
    <tr>
      <td>🐛</td>
      <td>Fix</td>
      <td>버그 & 에러 수정</td>
    </tr>
    <tr>
      <td>📝</td>
      <td>File</td>
      <td>리드미 등 문서 수정, 라이브러리 설치</td>
    </tr>
    <tr>
      <td>🎨</td>
      <td>Style</td>
      <td>코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우</td>
    </tr>
    <tr>
      <td>🖌</td>
      <td>Design</td>
      <td>UI 디자인 변경</td>
    </tr>
    <tr>
      <td>🔨</td>
      <td>Refactor</td>
      <td>코드 리팩토링</td>
    </tr>
    <tr>
      <td>🤔</td>
      <td>Test</td>
      <td>테스트 코드, 리팩토링 테스트 코드 추가</td>
    </tr>
    <tr>
      <td>⚙</td>
      <td>Chore</td>
      <td>빌드 업무 수정, 패키지 매니저 수정</td>
    </tr>
    <tr>
      <td>🗒</td>
      <td>Rename</td>
      <td>파일명 혹은 폴더명 수정, 위치 옮기기</td>
    </tr>
    <tr>
      <td>🔥</td>
      <td>Remove</td>
      <td>파일 삭제</td>
    </tr>
  </table>
</detail>

<br>
<br>

## 6. 시연 이미지


<br>
<br>

## 7. 미래 개선 방향
<br>
웹사이트 배포까지 성공적으로 마무리 하였습니다. 하지만 개선할 점이 보여 추후 개선 방향을 잡아보았습니다.

### 1. 클릭이 가능한 자동 슬라이드 배너 완성
현재 자동 슬라이드 배너는 사용자가 다음 배너로 넘기는 기능 없이 일정 시간 이후 다음 배너로 이동하도록 구현하였습니다. 이에 사용자 편의성을 위해 사용자가 클릭하여 배너를 넘길 수 있는 기능으로 리펙토링할 계획입니다.

### 2. 무한 스크롤 기능 구현
현재 메인 페이지에는 총 227개의 몬스터카드가 나열되어있습니다. 이는 초반 로딩 속도는 물론 최적화에 영향을 미쳐 초반 일부의 카드만 보이게 한 뒤, 스크롤을 내리면 카드가 추가로 생성되게 하는 무한 스크롤 기능으로 리펙토링할 계획입니다.

<br>

## 8. 성과 및 느낀 점
<br>
대부분의 프로젝트를 하면서 깃허브 페이지, 네틀리파이 등 다양한 무료 배포 사이트를 통해 배포해보았으나, 실제 웹사이트를 배포한 경험을 가져보고 싶어 도메인을 구매하여 직접 배포한 경험을 가지게 되었습니다. 이에 많은 지인과 몬스터 헌터 게임을 즐기는 유저들에게서 긍정적인 반응을 얻었으며, 구글 연관검색어 2위, 클릭수 한달만에 350회를 달성하였습니다. 또한 이번 프로젝트를 통해 다시 한번 더 반응형에 대해 딥하게 공부할 수 있는 계기가 되었으며, async...await 문법을 이해하는데 도움이 되는 프로젝트 였습니다.









