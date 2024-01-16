const fs = require("fs");

// Category IDs
const categoryIds = ["1", "2", "3", "4", "5", "6", "7"];

// Fetch all Hadith IDs for a category
async function fetchAllHadithIds(categoryId) {
  const allHadithIds = [];
  let page = 1;

  try {
    while (true) {
      const response = await fetch(
        `https://hadeethenc.com/api/v1/hadeeths/list/?language=bn&category_id=${categoryId}&page=${page}&per_page=50`
      );
      const data = await response.json();
      const pageHadithIds = data.data.map((hadith) => hadith.id);

      if (pageHadithIds.length === 0) {
        break; // No more pages
      }

      allHadithIds.push(...pageHadithIds);
      page++;
    }

    return allHadithIds;
  } catch (error) {
    console.error(
      `Error fetching Hadith IDs for Category ID ${categoryId}:`,
      error.message
    );
    return [];
  }
}

// Fetch and save full Hadiths for each category
async function fetchAndSaveForCategories() {
  for (const categoryId of categoryIds) {
    const hadithIds = await fetchAllHadithIds(categoryId);

    // Fetch and save full Hadiths for each category
    const fullHadiths = await Promise.all(hadithIds.map(fetchFullHadith));

    // Save all full Hadiths for a category in a single file
    fs.writeFileSync(
      `Category_${categoryId}_Hadiths.json`,
      JSON.stringify(fullHadiths, null, 2)
    );

    console.log(
      `Full Hadiths for Category ID ${categoryId} saved successfully.`
    );
  }
}

// Fetch full Hadith for an ID
async function fetchFullHadith(hadithId) {
  try {
    const response = await fetch(
      `https://hadeethenc.com/api/v1/hadeeths/one/?language=bn&id=${hadithId}`
    );
    const fullHadith = await response.json();

    return fullHadith;
  } catch (error) {
    console.error(
      `Error fetching Full Hadith for ID ${hadithId}:`,
      error.message
    );
    return null;
  }
}

// Execute the fetch and save process
fetchAndSaveForCategories();
