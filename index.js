const kutubContainer = document.querySelector(".kutub-grid-container");

let kutub = [];

const maxKutub = 7;

async function fetchKutub() {
  const loading = document.createElement("h1");
  loading.textContent = "Loading...";
  loading.classList.add("loading-text");
  kutubContainer.appendChild(loading);

  try {
    const response = await fetch("/.netlify/functions/fetch-resource/books");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    kutub = data.data.books;
    populate(kutub);
  } catch (error) {
    console.log("error: ", error);
  }
}

function populate(kutub) {
  //map over the kutub/books of hadith
  kutub.slice(0, maxKutub).map((kitab) => {
    //create the list item
    const gridItem = document.createElement("article");
    gridItem.classList.add("kutub-grid-item");

    //kitab title
    const kitabTitle = document.createElement("h2");
    kitabTitle.classList.add("kutub-title");
    kitabTitle.textContent = kitab.bookName;
    gridItem.appendChild(kitabTitle);

    //handle info section
    const infoGrid = document.createElement("section");
    infoGrid.innerHTML = `<section class="kutub-info-grid">
      <span>Writer's name:</span>
      <strong>${kitab.writerName}</strong>
      <span>Book count:</span>
      <strong>${kitab.chapters_count}</strong>
      <span>Hadith count:</span>
      <strong>${kitab.hadiths_count}</strong>
    </section>`;

    gridItem.appendChild(infoGrid);

    //render it
    kutubContainer.appendChild(gridItem);
  });
  kutubContainer.removeChild(kutubContainer.querySelector(".loading-text"));
}

function handleRedirection(e) {
  const closest = e.target.closest(".kutub-grid-item");
  if (!closest) return;
  const selectedKitabName = closest.querySelector(".kutub-title").textContent;
  const selectedKitabIndex = kutub.findIndex(
    (kitab) => kitab.bookName === selectedKitabName
  );
  const selectedKitabSlug = kutub[selectedKitabIndex].bookSlug;
  window.location.href = `/pages/bookContainer.html?kitabSlug=${selectedKitabSlug}`;
}

document.addEventListener("DOMContentLoaded", fetchKutub);
kutubContainer.addEventListener("click", handleRedirection);
