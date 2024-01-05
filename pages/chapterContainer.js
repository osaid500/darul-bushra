const container = document.querySelector(".container");

async function fetchAhadith() {
  //handle the params
  const urlParams = new URLSearchParams(window.location.search);
  const kitabSlug = urlParams.get("kitabSlug") || "sahih-bukhari";
  const bookId = urlParams.get("bookId");

  try {
    const response = await fetch(
      `/.netlify/functions/fetch-resource/hadiths?apiKey=insertapi&book=${kitabSlug}&chapter=${bookId}&paginate=1000`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    populate(data.data.hadiths.data);
  } catch (error) {
    console.log("error: ", error);
    alert(
      "There was a problem finding the ahadith. Redirecting you to the landing page."
    );
    window.location.href = "/";
  }
}

function populate(ahadith) {
  let lastChapter;

  // handle the ahadith
  ahadith.map((hadith) => {
    const kitabName = hadith.book.bookName;
    const bookNumber = Number(hadith.chapter.chapterNumber);
    const hadithNumber = hadith.hadithNumber;
    let hadithEnglishText = hadith.hadithEnglish;

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

    //hadith title
    const hadithTitle = document.createElement("h3");
    hadithTitle.classList.add("hadith-narrator");
    if (hadith.englishNarrator) {
      hadithTitle.textContent = hadith.englishNarrator;
    } else if (hadith.hadithEnglish) {
      let narratorIndex = hadith.hadithEnglish.indexOf(":");
      hadithEnglishText = hadith.hadithEnglish.slice(narratorIndex + 1);
      hadithTitle.textContent = hadith.hadithEnglish.slice(
        0,
        narratorIndex + 1
      );
    } else {
      hadithEnglishText = hadith.hadithUrdu;
    }

    englishSection.appendChild(hadithTitle);

    //hadith text
    const hadithText = document.createElement("p");
    hadithText.classList.add(
      hadith.hadithEnglish ? "hadith-text" : "urdu-text"
    );
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
                  <td>: Book ${bookNumber}, Hadith ${hadithNumber}</td>
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
}

document.addEventListener("DOMContentLoaded", fetchAhadith);
