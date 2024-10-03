import DataJson from "./data.js";
import MainPage from "./main.js";

const dataJson = new DataJson();
const mainPage = new MainPage();


(async function() {
  const data = await dataJson.data();
  await mainPage.dataSet(data);
  mainPage.MainPageEvent();
})();