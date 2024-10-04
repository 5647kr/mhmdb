import DataJson from "./data.js";
import DetailPage from "./detail.js";

const dataJson = new DataJson();
const detailPage = new DetailPage();


(async function() {
  const data = await dataJson.data();
  await detailPage.dataSet(data);
  detailPage.DetailPageEvent();
})();
