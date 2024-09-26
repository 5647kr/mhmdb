import DataJson from "./data.js";
import MainPageEvent from "./main.js";

const dataJson = new DataJson();
const mainPageEvent = new MainPageEvent();


(async function() {
  const data = await dataJson.data();
  await mainPageEvent.dataSet(data);
})();