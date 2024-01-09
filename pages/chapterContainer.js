const container = document.querySelector(".container");

//handle the params
const urlParams = new URLSearchParams(window.location.search);
const kitabSlug = urlParams.get("kitabSlug") || "sahih-bukhari";
const bookId = urlParams.get("bookId");
const maximumHadithToFetch = 1000;
let ahadith = [];

async function fetchAhadith() {
  const loading = document.createElement("h1");
  loading.textContent = "Loading...";
  loading.classList.add("loading-text");
  container.appendChild(loading);
  try {
    const response = await fetch(
      `/.netlify/functions/fetch-resource/hadiths?apiKey=insertapi&book=${kitabSlug}&chapter=${bookId}&paginate=${maximumHadithToFetch}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    ahadith = data.data.hadiths.data;
    populate(ahadith);
  } catch (error) {
    console.log("error: ", error);
    alert(
      "There was a problem finding the ahadith. Redirecting you to the landing page."
    );
    window.location.href = "/";
  }
}

function checkThenFixText(text) {
  if (text.includes("رضی اللہ عنہ")) {
    return text.replace(/رضی اللہ عنہ/g, "رضي الله عنه");
  } else if (text.includes("صلی ‌اللہ ‌علیہ ‌وسلم")) {
    return text.replace(
      /صلی\s*[\u200C\u200B]*اللہ\s*[\u200C\u200B]*علیہ\s*[\u200C\u200B]*وسلم/g,
      "صلى الله عليه وسلم"
    );
  }
}

function populate(ahadith) {
  let lastChapter;

  // handle the ahadith
  ahadith.map((hadith, index) => {
    const kitabName = hadith.book.bookName;
    const bookNumber = Number(hadith.chapter.chapterNumber);
    const hadithNumber = hadith.hadithNumber;

    if (index > 0) {
      if (
        Number(hadithNumber.split(", ")[0]) -
          Number(ahadith[index - 1].hadithNumber.split(", ").slice(-1)) !==
        1
      ) {
        return;
      }
    }

    const hadithNumberInBook = bookId === "0" ? index : index + 1;
    let hadithEnglishText = hadith.hadithEnglish;
    // duplicate hadith
    let isIndication;

    const hadithWholeContainer = document.createElement("article");
    hadithWholeContainer.classList.add("whole-hadith-container");

    //create a header if the hadith has one
    if (hadith.headingEnglish) {
      //container
      const hadithHeadContainer = document.createElement("section");
      hadithHeadContainer.classList.add("chapter-description-container");

      // ************children************

      //english header
      const englishHeader = document.createElement("p");
      englishHeader.classList.add("chapter-description");
      englishHeader.textContent = hadith.headingEnglish;

      //english header
      const arabicHeader = document.createElement("p");
      arabicHeader.classList.add("chapter-arabic-description");
      arabicHeader.textContent = hadith.headingArabic;

      //put them both in the container
      hadithHeadContainer.appendChild(englishHeader);
      hadithHeadContainer.appendChild(arabicHeader);

      //put the head container in the whole hadith container
      hadithWholeContainer.appendChild(hadithHeadContainer);
    }

    const hadithBodyContainer = document.createElement("section");
    hadithBodyContainer.classList.add("hadith-container");

    const hadithTextContainer = document.createElement("section");
    hadithTextContainer.classList.add("hadith-text-container");

    //english hadith section
    const englishSection = document.createElement("section");
    englishSection.classList.add("english-container");

    let futureNarratorTitle;

    //hadith title
    const hadithTitle = document.createElement("h3");
    hadithTitle.classList.add("hadith-narrator");
    if (hadith.englishNarrator) {
      futureNarratorTitle = hadith.englishNarrator;
    } else if (hadith.hadithEnglish) {
      let narratorIndex;
      narratorIndex = hadith.hadithEnglish.includes(":")
        ? hadith.hadithEnglish.indexOf(":")
        : hadith.hadithEnglish.includes("that") &&
          hadith.hadithEnglish.indexOf("that") + 3;
      if (narratorIndex) {
        hadithEnglishText = hadith.hadithEnglish.slice(narratorIndex + 1);
        futureNarratorTitle = hadith.hadithEnglish.slice(0, narratorIndex + 1);
      } else {
        isIndication = true;
      }
    } else {
      hadithEnglishText = hadith.hadithUrdu;
    }

    if (futureNarratorTitle) {
      let fixedText = checkThenFixText(futureNarratorTitle);
      if (fixedText) futureNarratorTitle = fixedText;
    }

    hadithTitle.textContent = futureNarratorTitle;
    englishSection.appendChild(hadithTitle);

    //hadith text
    const hadithText = document.createElement("p");
    hadithText.classList.add(
      hadith.hadithEnglish ? "hadith-text" : "urdu-text"
    );
    if (isIndication) {
      hadithText.classList.add("indication-text");
    } else {
      let fixedText = checkThenFixText(hadithEnglishText);
      if (fixedText) hadithEnglishText = fixedText;
    }
    hadithText.textContent = hadithEnglishText;
    englishSection.appendChild(hadithText);

    // ***********************************************************************

    //arabic hadith section
    const arabicSection = document.createElement("section");
    arabicSection.classList.add("arabic-container");

    //arabic hadith text
    const arabicHadithText = document.createElement("p");
    arabicHadithText.classList.add("arabic-hadith-text");
    arabicHadithText.textContent = hadith.hadithArabic;
    arabicSection.appendChild(arabicHadithText);

    //add sections to hadithBodyContainer
    hadithTextContainer.appendChild(englishSection);
    hadithTextContainer.appendChild(arabicSection);
    hadithBodyContainer.appendChild(hadithTextContainer);

    //put the hadith header and body together
    hadithWholeContainer.appendChild(hadithBodyContainer);

    // check if the chapter info isn't there
    if (
      !lastChapter ||
      lastChapter.chapterEnglish !== hadith.chapter.chapterEnglish
    ) {
      //book container
      const bookContainer = document.createElement("section");
      bookContainer.classList.add("book-container");

      //the chapter title
      const chapterEnglish = document.createElement("h2");
      chapterEnglish.classList.add("book-title");
      chapterEnglish.textContent = `${hadith.chapter.chapterNumber} - ${hadith.chapter.chapterEnglish}`;
      bookContainer.appendChild(chapterEnglish);

      //the chapter arabic title
      const chapterArabic = document.createElement("h2");
      chapterArabic.classList.add("book-arabic-title");
      chapterArabic.textContent = `${hadith.chapter.chapterArabic}`;
      bookContainer.appendChild(chapterArabic);

      //put the book info out there on the dom
      container.appendChild(bookContainer);

      lastChapter = hadith.chapter;
    }

    //handle the table/references
    const referenceSection = document.createElement("section");
    referenceSection.classList.add("reference-container");

    const hadithNumberHeader = document.createElement("h2");
    hadithNumberHeader.classList.add("hadith-number");
    hadithNumberHeader.textContent = hadithNumber;
    referenceSection.appendChild(hadithNumberHeader);

    const table = document.createElement("table");
    table.innerHTML = `<table>
              <tbody>
                <tr>
                  <td><b>Reference</b></td>
                  <td>: ${kitabName} ${hadithNumber}</td>
                </tr>
                <tr>
                  <td>In-book reference</td>
                  <td>: Book ${bookNumber}, Hadith ${hadithNumberInBook}</td>
                </tr>
              </tbody>
            </table>`;

    table.classList.add("table-reference");

    //render the hadith container/hadithBodyContainer
    referenceSection.appendChild(table);
    hadithBodyContainer.appendChild(referenceSection);
    hadithWholeContainer.appendChild(hadithBodyContainer);
    container.appendChild(hadithWholeContainer);
  });
  container.removeChild(container.querySelector(".loading-text"));
}

document.addEventListener("DOMContentLoaded", fetchAhadith);
