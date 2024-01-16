const fs = require("fs");
const axios = require("axios");

// Category IDs
const categoryIds = ["1", "2", "3", "4", "5", "6", "7"];

// Fetch Hadith IDs for each category
async function fetchHadithIds(categoryId) {
  try {
    const response = await axios.get(
      `https://hadeethenc.com/api/v1/hadeeths/list/?language=bn&category_id=${categoryId}&page=1&per_page=10`
    );
    const hadithIds = response.data.data.map((hadith) => hadith.id);

    return hadithIds;
  } catch (error) {
    console.error(
      `Error fetching Hadith IDs for Category ID ${categoryId}:`,
      error.message
    );
    return [];
  }
}

// Fetch and save full Hadith for each ID
async function fetchAndSaveFullHadith(hadithId) {
  try {
    const response = await axios.get(
      `https://hadeethenc.com/api/v1/hadeeths/one/?language=bn&id=${hadithId}`
    );
    const fullHadith = response.data;

    // Save the full Hadith to a JSON file
    fs.writeFileSync(
      `Hadith_${hadithId}.json`,
      JSON.stringify(fullHadith, null, 2)
    );

    console.log(`Full Hadith for ID ${hadithId} saved successfully.`);
  } catch (error) {
    console.error(
      `Error fetching Full Hadith for ID ${hadithId}:`,
      error.message
    );
  }
}

// Fetch Hadith IDs for each category and save full Hadith
async function fetchAndSaveForCategories() {
  for (const categoryId of categoryIds) {
    const hadithIds = await fetchHadithIds(categoryId);

    // Fetch and save full Hadith for each ID
    for (const hadithId of hadithIds) {
      await fetchAndSaveFullHadith(hadithId);
    }
  }
}

// Execute the fetch and save process
fetchAndSaveForCategories();
