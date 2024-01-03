// const container = document.querySelector(".container");
const bookContainer = document.querySelector(".book-grid-container");

let books = [];

const urlParams = new URLSearchParams(window.location.search);
const kitabSlug = urlParams.get("kitabSlug") || "sahih-bukhari";

const isLocal = window.location.hostname === "127.0.0.1/";

async function fetchBooks() {
  try {
    // Update the URL based on the environment
    const apiUrl = isLocal
      ? "http://localhost:3000/fetch-api/"
      : "/.netlify/functions/fetch-api/";

    const response = await fetch(`${apiUrl}${kitabSlug}slashchapters`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    books = data.data.chapters;
    console.log(books);

    populate(books);
  } catch (error) {
    console.log("error: ", error);
  }
}

function populate(books) {
  console.log(books);

  //map over each book
  books.map((book) => {
    //create an item for the list that holds the books
    const gridItem = document.createElement("article");
    gridItem.classList.add("book-grid-item");

    //handle the number container
    const numberContainer = document.createElement("figure");
    numberContainer.classList.add("number-container");

    const numberHeader = document.createElement("h2");
    numberHeader.classList.add("book-number");
    numberHeader.textContent = book.chapterNumber;
    numberContainer.appendChild(numberHeader);

    gridItem.appendChild(numberContainer);
    //handled the figure.. time for the book names

    const titleContainer = document.createElement("section");
    titleContainer.classList.add("title-container");

    const englishBookTitle = document.createElement("h2");
    englishBookTitle.classList.add("book-english-title");
    englishBookTitle.textContent = book.chapterEnglish;
    titleContainer.appendChild(englishBookTitle);

    const arabicBookTitle = document.createElement("h2");
    arabicBookTitle.classList.add("book-arabic-title");
    arabicBookTitle.textContent = book.chapterArabic;
    titleContainer.appendChild(arabicBookTitle);

    gridItem.appendChild(titleContainer);

    // bookElement.href = `chapterContainer.html?kitabSlug=${book.bookSlug}&bookId=${book.chapterNumber}`;

    bookContainer.appendChild(gridItem);
  });
}

function redirectToBookPage(e) {
  const closest = e.target.closest(".book-grid-item");
  if (!closest.classList.contains("book-grid-item")) return;
  const bookNumber = Number(closest.querySelector(".book-number").textContent);
  console.log(bookNumber);
  console.log("redirecting...");
  window.location.href = `/pages/chapterContainer.html?kitabSlug=${kitabSlug}&bookId=${bookNumber}`;
}

document.addEventListener("DOMContentLoaded", fetchBooks);
bookContainer.addEventListener("click", redirectToBookPage, { capture: true });
