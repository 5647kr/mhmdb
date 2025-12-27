export async function fetchData() {
  try {
    const response = await fetch("/js/db.json");

    if (!response.ok) {
      throw new Error("Fetch 실패");
    }
    return await response.json();

  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchFilterData() {
  const data = await fetchData();

  const filterData = {
    type: data.type,
    series: data.series
  }

  return filterData
}

export async function fetchContentData() {
  const data = await fetchData();

  const contentData = data.monster;

  return contentData
}