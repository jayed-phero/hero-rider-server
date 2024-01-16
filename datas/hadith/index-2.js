const fs = require("fs");

// Category IDs
const categoryIds = ["1", "2", "3", "4", "5", "6", "7"]; // Add more IDs as needed

// Fetch Hadith IDs for each category
async function fetchHadithIds(categoryId) {
  try {
    const response = await fetch(
      `https://hadeethenc.com/api/v1/hadeeths/list/?language=bn&category_id=${categoryId}&page=1&per_page=10`
    );
    const data = await response.json();
    const hadithIds = data.data.map((hadith) => hadith.id);

    return hadithIds;
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
    const hadithIds = await fetchHadithIds(categoryId);

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
