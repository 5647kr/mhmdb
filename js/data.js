class DataJson {
  // Json 파일에 있는 데이터를 불러오는 함수
  async loadData() {
    try {
      const response = await fetch("/js/index.json");
      // 서버로 부터 응답이 정상적일 때 응답 코드: 200 ~ 299
      if(response.ok) {
        // json이였던 것을 js 객체로 변환
        return response.json();
      } else {
        // response의 상태에 대한 에러를 던진다.
        throw new Error(response.status);
        // 비동기처리를 하지 않았다. fetch를 통해 response에 데이터를 받아야 하지만 js는 동기적으로 실행하기 때문에 바로 다음 코드를 실행한다. 이에 response에 아무것도 없는 상태로 if-else문을 실행한다. 이때 비어있는 response 변수는 if문에서 걸려져 else문으로 와서 error를 뿝는다. 이에 async...await를 사용해야 한다.
      }
    } catch (error) {
      console.log(error);
    }
  }

  async data () {
    const response = await this.loadData();
    return response;
  }
}

export default DataJson;