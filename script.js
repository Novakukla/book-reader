const pages = [
  "pages/page-01.webp",
  "pages/page-02.webp",
  "pages/page-03.webp",
  "pages/page-04.webp",
  "pages/page-05.webp",
  "pages/page-06.webp",
  "pages/page-07.webp",
  "pages/page-08.webp",
  "pages/page-09.webp",
  "pages/page-10.webp"
];

const prevButtons = document.querySelectorAll('[data-br-nav="prev"]');
const nextButtons = document.querySelectorAll('[data-br-nav="next"]');
const pageImage = document.getElementById("br-page-image");
const pageStatuses = document.querySelectorAll("[data-br-page-status]");
const pageError = document.getElementById("br-page-error");

let currentPageIndex = 0;

function updateButtons() {
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === pages.length - 1;

  prevButtons.forEach((button) => {
    button.disabled = isFirstPage;
  });

  nextButtons.forEach((button) => {
    button.disabled = isLastPage;
  });
}

function updatePageStatus() {
  const pageLabel = `Page ${currentPageIndex + 1} of ${pages.length}`;

  pageStatuses.forEach((status) => {
    status.textContent = pageLabel;
  });
}

function preloadPage(index) {
  if (index < 0 || index >= pages.length) {
    return;
  }

  const image = new Image();
  image.src = pages[index];
}

function preloadAdjacentPages() {
  preloadPage(currentPageIndex - 1);
  preloadPage(currentPageIndex + 1);
}

function showImageError() {
  pageImage.hidden = true;
  pageError.hidden = false;
}

function showImage() {
  pageImage.hidden = false;
  pageError.hidden = true;
}

function renderPage() {
  const pagePath = pages[currentPageIndex];

  updatePageStatus();
  updateButtons();

  pageImage.alt = `Book page ${currentPageIndex + 1}`;
  pageImage.src = pagePath;

  preloadAdjacentPages();

  // Future enhancement hook: swap this direct image render for a flip animation mode.
}

function goToPage(index) {
  if (index < 0 || index >= pages.length) {
    return;
  }

  currentPageIndex = index;
  renderPage();
}

prevButtons.forEach((button) => {
  button.addEventListener("click", () => {
    goToPage(currentPageIndex - 1);
  });
});

nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    goToPage(currentPageIndex + 1);
  });
});

pageImage.addEventListener("load", showImage);
pageImage.addEventListener("error", showImageError);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    goToPage(currentPageIndex - 1);
  }

  if (event.key === "ArrowRight") {
    goToPage(currentPageIndex + 1);
  }
});

renderPage();
