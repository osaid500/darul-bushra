import config from "./config.js";

const apiKey = config.HADITH_API_KEY || env.HADITH_API_KEY;
// const container = document.querySelector(".container");
const kutubContainer = document.querySelector(".kutub-container");

async function fetchKutub() {
  try {
    const response = await fetch(
      `https://hadithapi.com/api/books?apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const kutub = data.books;
    populate(kutub);
    console.log(kutub);
  } catch (error) {
    console.log("error: ", error);
  }
}

function populate(kutub) {
  //map over the kutub/books of hadith
  kutub.map((kitab) => {
    //create the list item
    const listItem = document.createElement("li");
    listItem.classList.add("kitab-container");

    //the a tag which holds book name
    const kitabElement = document.createElement("a");
    kitabElement.classList.add("kitab");
    kitabElement.href = `pages/bookContainer.html?kitabSlug=${kitab.bookSlug}`;
    kitabElement.textContent = kitab.bookName;
    listItem.appendChild(kitabElement);

    //render it
    kutubContainer.appendChild(listItem);
  });
}

document.addEventListener("DOMContentLoaded", fetchKutub);
