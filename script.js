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
const pageFigure = document.querySelector(".br-reader__figure");
const pageStatuses = document.querySelectorAll("[data-br-page-status]");
const pageError = document.getElementById("br-page-error");
const zoomInButton = document.getElementById("br-zoom-in");
const zoomOutButton = document.getElementById("br-zoom-out");
const readerElement = document.querySelector(".br-reader");

let currentPageIndex = 0;
let currentZoom = 1;
const minZoom = 0.6;
const swipeThreshold = 50;

let touchMode = null;
let swipeStartX = 0;
let swipeStartY = 0;
let pinchStartDistance = 0;
let pinchStartZoom = 1;

function getTouchDistance(touches) {
  const [firstTouch, secondTouch] = touches;
  const deltaX = secondTouch.clientX - firstTouch.clientX;
  const deltaY = secondTouch.clientY - firstTouch.clientY;

  return Math.hypot(deltaX, deltaY);
}

function getMaxZoom() {
  if (pageImage.hidden || pageImage.offsetWidth === 0) {
    return 1;
  }

  const imageRect = pageImage.getBoundingClientRect();
  const imageCenter = imageRect.left + imageRect.width / 2;
  const renderedZoom = parseFloat(
    getComputedStyle(readerElement).getPropertyValue("--br-zoom-scale")
  ) || 1;
  const baseWidth = imageRect.width / renderedZoom;
  const baseLeft = imageCenter - baseWidth / 2;
  const spaceLeft = Math.max(baseLeft, 0);
  const spaceRight = Math.max(window.innerWidth - (baseLeft + baseWidth), 0);
  const edgeRoom = Math.min(spaceLeft, spaceRight);
  const maxZoom = 1 + (edgeRoom * 2) / baseWidth;

  return Math.max(minZoom, maxZoom);
}

function updateZoom() {
  const maxZoom = getMaxZoom();
  currentZoom = Math.min(Math.max(currentZoom, minZoom), maxZoom);

  readerElement.style.setProperty("--br-zoom-scale", currentZoom.toFixed(2));

  const layoutShift = Math.max(0, pageImage.offsetHeight * (currentZoom - 1));
  pageFigure.style.marginBottom = `${layoutShift.toFixed(2)}px`;

  zoomOutButton.disabled = currentZoom <= minZoom;
  zoomInButton.disabled = currentZoom >= maxZoom - 0.01;
}

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
  updateZoom();
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

function handleTouchStart(event) {
  if (event.touches.length === 2) {
    touchMode = "pinch";
    pinchStartDistance = getTouchDistance(event.touches);
    pinchStartZoom = currentZoom;
    return;
  }

  if (event.touches.length === 1) {
    touchMode = "swipe";
    swipeStartX = event.touches[0].clientX;
    swipeStartY = event.touches[0].clientY;
  }
}

function handleTouchMove(event) {
  if (touchMode === "pinch" && event.touches.length === 2) {
    event.preventDefault();

    const pinchDistance = getTouchDistance(event.touches);
    if (!pinchStartDistance) {
      return;
    }

    currentZoom = pinchStartZoom * (pinchDistance / pinchStartDistance);
    updateZoom();
  }
}

function handleTouchEnd(event) {
  if (touchMode === "pinch") {
    if (event.touches.length < 2) {
      touchMode = event.touches.length === 1 ? "swipe" : null;

      if (event.touches.length === 1) {
        swipeStartX = event.touches[0].clientX;
        swipeStartY = event.touches[0].clientY;
      }
    }

    return;
  }

  if (touchMode === "swipe" && event.changedTouches.length === 1) {
    const endTouch = event.changedTouches[0];
    const deltaX = endTouch.clientX - swipeStartX;
    const deltaY = endTouch.clientY - swipeStartY;

    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        goToPage(currentPageIndex + 1);
      } else {
        goToPage(currentPageIndex - 1);
      }
    }
  }

  if (event.touches.length === 0) {
    touchMode = null;
    pinchStartDistance = 0;
  }
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

zoomOutButton.addEventListener("click", () => {
  currentZoom -= 0.1;
  updateZoom();
});

zoomInButton.addEventListener("click", () => {
  currentZoom += 0.1;
  updateZoom();
});

pageImage.addEventListener("load", showImage);
pageImage.addEventListener("error", showImageError);
pageFigure.addEventListener("touchstart", handleTouchStart, { passive: true });
pageFigure.addEventListener("touchmove", handleTouchMove, { passive: false });
pageFigure.addEventListener("touchend", handleTouchEnd);
pageFigure.addEventListener("touchcancel", handleTouchEnd);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    goToPage(currentPageIndex - 1);
  }

  if (event.key === "ArrowRight") {
    goToPage(currentPageIndex + 1);
  }
});

window.addEventListener("resize", updateZoom);

updateZoom();
renderPage();
