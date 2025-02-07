document.addEventListener("DOMContentLoaded", function () {
  const img = document.getElementById("coverImage");

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "attributes" && mutation.attributeName === "src") {
        if (img.complete) {
          extractColors();
        } else {
          img.addEventListener("load", extractColors);
        }
      }
    });
  });

  observer.observe(img, {
    attributes: true,
    attributeFilter: ["src"],
  });

  // Ensure the image is fully loaded before extracting colors
  if (img.complete) {
    extractColors();
  } else {
    img.addEventListener("load", extractColors);
  }

  function extractColors() {
    const colorThief = new ColorThief();
    const colorSchemeUl = document.getElementById("colorScheme");

    try {
      const colors = colorThief.getPalette(img, 5); // Get 5 colors from the image

      colorSchemeUl.innerHTML = ""; // Clear existing colors

      colors.forEach((color) => {
        const colorItem = document.createElement("li");
        colorItem.classList.add("color-squares");
        colorItem.setAttribute("contenteditable", "false");
        const colorHex = rgbToHex(color[0], color[1], color[2]);
        colorItem.style.backgroundColor = colorHex;
        colorSchemeUl.appendChild(colorItem);
      });
    } catch (error) {
      console.error("Error extracting colors: ", error);
    }
  }

  img.crossOrigin = "anonymous"; // Enable CORS

  function rgbToHex(r, g, b) {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  }
});

//make text editable

//image upload on click

const albumCover = document.getElementById("albumCover");
const coverImage = document.getElementById("coverImage");
const fileInput = document.getElementById("fileInput");

albumCover.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      coverImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// add/delete song

const songList = document.getElementById("songList");

const addSong = document.createElement("div");
addSong.textContent = "Add a new song";
addSong.style.cursor = "pointer";
addSong.style.color = "rgb(38, 163, 33)";
addSong.style.position = "absolute";
addSong.style.bottom = "54px";
addSong.style.left = "35px";
addSong.style.zIndex = "9999";
addSong.style.userSelect = "none";
addSong.id = "addSong";
addSong.style.display = "none"; // Hide by default

songList.appendChild(addSong);

const deleteSong = document.createElement("div");
deleteSong.textContent = "Delete last song";
deleteSong.style.cursor = "pointer";
deleteSong.style.color = "rgb(255, 0, 0)";
deleteSong.style.position = "absolute";
deleteSong.style.bottom = "54px";
deleteSong.style.left = "100px";
deleteSong.style.zIndex = "9999";
deleteSong.style.userSelect = "none";
deleteSong.id = "deleteSong";
deleteSong.style.display = "none"; // Hide by default
songList.appendChild(deleteSong);

// Create a new div element for change code
const changeCodeDiv = document.createElement("div");
changeCodeDiv.textContent = "Change Code";
changeCodeDiv.id = "changeCode";
changeCodeDiv.style.cursor = "pointer";
changeCodeDiv.style.color = "rgb(38, 163, 33)";
changeCodeDiv.style.position = "absolute";
changeCodeDiv.style.bottom = "80px";
changeCodeDiv.style.left = "208px";
changeCodeDiv.style.zIndex = "9999";
changeCodeDiv.style.userSelect = "none";
changeCodeDiv.style.display = "none"; // Hide by default

// Append the new div element to the songList element
songList.appendChild(changeCodeDiv);

changeCodeDiv.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];
    const spotifyCodeImage = document.getElementById("spotifyCodeImage");
    spotifyCodeImage.src = URL.createObjectURL(selectedFile);
  });
  fileInput.click();
});

// Create a new div element for delete code
const hide = document.createElement("div");
hide.textContent = "Hide Code";
hide.style.cursor = "pointer";
hide.style.color = "rgb(255, 0, 0)";
hide.style.position = "absolute";
hide.style.bottom = "80px";
hide.style.left = "264px";
hide.style.zIndex = "9999";
hide.style.userSelect = "none";
hide.style.display = "none"; // Hide by default

// Append the new div element to the songList element
songList.appendChild(hide);

hide.addEventListener("click", () => {
  const spotifyCode = document.querySelector(".spotify-code");
  spotifyCode.style.display =
    spotifyCode.style.display === "none" ? "block" : "none";
  hide.textContent =
    hide.textContent === "Hide Code" ? "Show Code" : "Hide Code";
});

deleteSong.addEventListener("click", () => {
  const songs = songList.querySelectorAll("li:not(#addSong):not(:last-child)");
  if (songs.length > 0) {
    songList.removeChild(songs[songs.length - 1]);
  }
});

addSong.addEventListener("click", () => {
  const newSong = document.createElement("li");
  newSong.textContent = "New Song";
  newSong.contentEditable = true;
  newSong.spellcheck = false;
  songList.insertBefore(newSong, addSong);
});
//remove red underlined text
const style = document.createElement("style");
style.innerHTML = `
  li[contenteditable="true"] {
    text-decoration: none;
  }
`;
document.head.appendChild(style);
document
  .querySelectorAll(
    ".template li, .album-info .album-date, .album-info .album-name span, .color-scheme-container h2"
  )
  .forEach((element) => {
    element.contentEditable = false;
    element.spellcheck = false;
  });

// Download template as image

saveButton.addEventListener("click", () => {
  const template = document.getElementById("template");
  const addSong = document.getElementById("addSong");
  const deleteSong = document.getElementById("deleteSong");

  const editButton = document.getElementById("editButton");
  if (editButton.classList.contains("editable")) {
    editButton.click(); // Simulate a click on the editButton to toggle it off
  }

  // Hide addSong and deleteSong buttons
  addSong.style.display = "none";
  deleteSong.style.display = "none";
  changeCodeDiv.style.display = "none";
  hide.style.display = "none";

  // Remove border
  template.style.border = "none";

  // Add a new class to the template element to prevent edit-mode styles
  template.classList.add("save-mode");

  // Remove the change-image-text element
  const changeImageText = document.querySelector(".change-image-text");
  const changeImageTextParent = changeImageText.parentNode;
  changeImageTextParent.removeChild(changeImageText);

  html2canvas(template, { scale: 2, useCORS: true, dpi: 300 }).then(
    (canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png", 1.0); // Set quality to 1.0 for max quality
      link.download = "template.png";
      link.click();

      // Remove the save-mode class
      template.classList.remove("save-mode");

      // Only restore border if not in edit mode
      if (!template.classList.contains("editable")) {
        template.style.border = "4px solid rgb(0, 0, 0)";
      }

      // Re-add the change-image-text element
      changeImageTextParent.appendChild(changeImageText);

      // Restore addSong and deleteSong buttons only if edit mode is on
      if (template.classList.contains("editable")) {
        addSong.style.display = "";
        deleteSong.style.display = "";
        changeCodeDiv.style.display = "";
        hide.style.display = "";
      }
    }
  );
});

// Change image in edit state only

document.getElementById("editButton").addEventListener("click", function () {
  const template = document.getElementById("template");
  const fileInput = document.getElementById("fileInput");
  const addSong = document.getElementById("addSong");

  if (template.classList.contains("editable")) {
    template.classList.remove("editable");
    fileInput.disabled = true;
    addSong.style.pointerEvents = "none";
    addSong.style.color = "rgb(38, 163, 33)";
    addSong.style.position = "absolute";
    addSong.style.bottom = "54px";
    addSong.style.left = "35px";
    addSong.style.zIndex = "9999";
    addSong.style.userSelect = "none";
    template.style.border = "4px solid rgb(0, 0, 0)"; // Show border
  } else {
    template.classList.add("editable");
    fileInput.disabled = false;
    addSong.style.pointerEvents = "auto";
    addSong.style.color = "rgb(38, 163, 33)";
    addSong.style.position = "absolute";
    addSong.style.bottom = "54px";
    addSong.style.left = "35px";
    addSong.style.zIndex = "9999";
    addSong.style.userSelect = "none";
    template.style.border = "none"; // Hide border
  }

  // Add this code here
  const changeImageText = document.querySelector(".change-image-text");
  const changeImageTextParent = changeImageText.parentNode;
  changeImageTextParent.appendChild(changeImageText);

  if (changeImageText) {
    if (template.classList.contains("editable")) {
      changeImageText.style.display = "block";
    } else {
      changeImageText.style.display = "none";
    }
  }
});

// Toggle addSong, deleteSong, and contentEditable when editButton is clicked
const editButton = document.getElementById("editButton");
editButton.addEventListener("click", toggleEditMode);

function toggleEditMode() {
  const template = document.getElementById("template");
  const addSong = document.getElementById("addSong");
  const deleteSong = document.getElementById("deleteSong");
  const editableElements = template.querySelectorAll(
    ".template li, .album-info .album-date, .album-info .album-name span, .color-scheme-container h2"
  );

  if (template.classList.contains("save-mode")) {
    template.classList.remove("save-mode");
  }

  if (addSong.style.display === "none") {
    addSong.style.display = "block";
    deleteSong.style.display = "block";
    changeCodeDiv.style.display = "block"; // Show when edit button is clicked
    hide.style.display = "block";
    editableElements.forEach((element) => {
      element.contentEditable = true;
    });
  } else {
    addSong.style.display = "none";
    deleteSong.style.display = "none";
    changeCodeDiv.style.display = "none"; // Hide when edit button is clicked again
    hide.style.display = "none";
    editableElements.forEach((element) => {
      element.contentEditable = false;
    });
  }
}

//Change Image Hover While in Edit Mode

document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.getElementById("editButton");
  const albumCover = document.querySelector(".album-cover");

  let isEditMode = false;

  editButton.addEventListener("click", () => {
    isEditMode = !isEditMode;

    if (isEditMode) {
      albumCover.classList.add("edit-mode");
    } else {
      albumCover.classList.remove("edit-mode");
    }
  });
});

//

const template = document.getElementById("template");

editButton.addEventListener("click", () => {
  const editableElements = template.querySelectorAll(
    ".template li, .album-info .album-date, .album-info .album-name span, .color-scheme-container h2"
  );

  editableElements.forEach((element) => {
    element.contentEditable = !element.isContentEditable;
  });
});

// Initially set contentEditable to false
const initialEditableElements = template.querySelectorAll(
  ".template li, .album-info .album-date, .album-info .album-name span, .color-scheme-container h2"
);

initialEditableElements.forEach((element) => {
  element.contentEditable = false;
});

const styleElement = document.createElement("style");
document.head.appendChild(styleElement);

editButton.addEventListener("click", () => {
  const editableElements = template.querySelectorAll(
    ".template li, .album-info .album-date, .album-info .album-name span, .color-scheme-container h2"
  );

  if (editButton.classList.contains("editing")) {
    styleElement.innerHTML = "";
    editableElements.forEach((element) => {
      element.contentEditable = false;
    });
    editButton.classList.remove("editing");
  } else {
    styleElement.innerHTML = `
      .template li, .album-info .album-date, .album-info .album-name span, .color-scheme-container h2 {
        -webkit-user-modify: read-write-plaintext-only;
      }
    `;
    editableElements.forEach((element) => {
      element.contentEditable = true;
    });
    editButton.classList.add("editing");
  }
});

//
// Add this to your JavaScript code

editButton.addEventListener("click", () => {
  template.classList.toggle("edit-mode");
});
document.getElementById("editButton").addEventListener("click", function () {
  this.classList.toggle("active");
});

//Reset button
document.getElementById("resetButton").addEventListener("click", function () {
  location.reload();
  return false;
});

//Blur background

const historyPopup = document.getElementById("history-popup");
const backdrop = document.querySelector(".history-popup-backdrop");

// Show the popup and backdrop

//
// Show the popup and backdrop
historyButton.addEventListener("click", () => {
  historyPopup.classList.add("show");
  backdrop.classList.add("active");
});

// Hide the popup and backdrop
closeButton.addEventListener("click", () => {
  historyPopup.classList.remove("show");
  backdrop.classList.remove("active");
});

//

// Function to save template content and generate preview
function saveTemplateContent() {
  const template = document.getElementById("template");
  const historySquares = document.querySelectorAll(".square");
  const emptySquare = Array.from(historySquares).find(
    (square) => !square.querySelector("img")
  );

  if (emptySquare) {
    html2canvas(template, { scale: 2, useCORS: true, dpi: 300 }).then(
      (canvas) => {
        const preview = document.createElement("img");
        preview.src = canvas.toDataURL("image/png", 1.0);
        preview.dataset.templateContent = template.innerHTML; // Store template content as data attribute
        emptySquare.appendChild(preview);

        // Add event listener to apply content to template when preview is clicked
        preview.addEventListener("click", () => {
          const templateContent = preview.dataset.templateContent;
          const template = document.getElementById("template");
          template.innerHTML = templateContent;
        });

        // Save the preview image data to localStorage
        const imageData = canvas.toDataURL("image/png", 1.0);
        const historyIndex = Array.from(historySquares).indexOf(emptySquare);
        localStorage.setItem(`previewImage${historyIndex}`, imageData);

        // Add the has-image class to the square
        emptySquare.classList.add("has-image");
      }
    );
  }
}

// Populate history squares with saved preview images
const historySquares = document.querySelectorAll(".square");
historySquares.forEach((square, index) => {
  const previewImage = localStorage.getItem(`previewImage${index}`);
  if (previewImage) {
    const img = document.createElement("img");
    img.src = previewImage; // Update the src attribute to point to the newly generated preview image
    square.appendChild(img);
    square.classList.add("has-history");
    setTimeout(() => {
      square.classList.add("has-image");
    }, 0);
  }
});

//

const historyData = localStorage.getItem("history");
if (historyData) {
  historyData = JSON.parse(historyData);
  historySquares.forEach((square, index) => {
    const img = square.querySelector("img");
    if (img) {
      img.src = historyData[index];
      square.classList.add("has-history");
      setTimeout(() => {
        square.classList.remove("has-image");
        square.classList.add("has-image");
      }, 0);
    }
  });
} else {
  console.log("No history data found in localStorage.");
}

// Clear History

let isAnimationInProgress = false;

document.getElementById("clearHistory").addEventListener("click", () => {
  if (isAnimationInProgress) {
    return; // Do nothing if an animation is already in progress
  }

  isAnimationInProgress = true; // Set the flag to indicate an animation is starting

  // Clear history data from localStorage
  const historySquares = document.querySelectorAll(".square");
  let hasHistory = false;

  historySquares.forEach((square, index) => {
    const img = square.querySelector("img");
    if (img) {
      hasHistory = true;
      localStorage.removeItem(`previewImage${index}`);
    }
  });

  if (!hasHistory) {
    // Show a pop-up notification
    const notification = document.createElement("div");
    notification.textContent = "Create a template first!";
    notification.style.fontFamily = "Poppins, sans-serif";
    notification.style.fontSize = "13px";
    notification.style.width = "200px";
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.left = "-200px"; // start from outside left
    notification.style.right = "0";
    notification.style.padding = "10px";
    notification.style.color = "white";
    notification.style.backgroundColor = "black";
    notification.style.borderTop = "1px solid #ccc";
    notification.style.borderRadius = "0px 5px 5px 0px";
    notification.style.textAlign = "center";
    notification.style.zIndex = "100000";
    notification.style.transition = "left 0.5s ease-in-out"; // add transition
    document.body.appendChild(notification);

    // animate the notification to come in from left
    setTimeout(() => {
      notification.style.left = "0";
    }, 0);

    // Remove the notification after 2 seconds
    setTimeout(() => {
      notification.style.left = "-300px"; // animate back to outside left
      setTimeout(() => {
        notification.remove();
        isAnimationInProgress = false; // Reset the flag after the animation is finished
      }, 500); // wait for animation to finish
    }, 3000);
  } else {
    // Clear all localStorage items
    localStorage.clear();

    // Refresh the page
    location.reload();
  }
});

//History Preview

// Save template content and generate preview
document.getElementById("saveButton").addEventListener("click", () => {
  // Save template content and generate preview
  saveTemplateContent();

  // Refresh the page after a short delay to allow the download to complete
  setTimeout(() => {
    location.reload();
  }, 1000);

  // Other actions to happen when saveButton is clicked
  const template = document.getElementById("template");
  const addSong = document.getElementById("addSong");
  const deleteSong = document.getElementById("deleteSong");

  const editButton = document.getElementById("editButton");
  if (editButton.classList.contains("editable")) {
    editButton.click(); // Simulate a click on the editButton to toggle it off
  }

  // Hide addSong and deleteSong buttons
  addSong.style.display = "none";
  deleteSong.style.display = "none";
  changeCodeDiv.style.display = "none";
  hide.style.display = "none";
});

// Move the history popup to be on top of add and delete song
historyPopup.style.zIndex = "99999";

// Close History Popup when a preview is clicked and download the image
document.querySelectorAll(".square img").forEach((img) => {
  img.addEventListener("click", () => {
    const previewImage = img.src;
    const link = document.createElement("a");
    link.href = previewImage;
    link.download = "template.png";

    // Check if the link is a data URL
    if (link.href.startsWith("data:")) {
      // If it's a data URL, use the canvas.toDataURL() method to generate a downloadable URL
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.src = previewImage;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
    } else {
      link.click();
    }

    document.getElementById("history-popup").style.display = "none";
    document
      .querySelector(".history-popup-backdrop.active")
      .classList.remove("active");
  });
});
