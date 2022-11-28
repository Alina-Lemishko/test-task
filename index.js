function getRefs() {
  return {
    formInput: document.querySelector(".form__input"),
    pairsList: document.querySelector(".pairs__list"),
    pairsListItem: document.querySelector(".pairs__list_item"),
    formButton: document.querySelector(".form__button"),
    form: document.querySelector(".form"),
    btnSortByName: document.querySelector(".button__sort_name"),
    btnSortByValue: document.querySelector(".button__sort_value"),
    btnDelete: document.querySelector(".button__sort_delete"),
    btnShowXML: document.querySelector(".button__sort_xml"),
    sectionXML: document.querySelector(".section__xml"),
    XMLList: document.querySelector(".xml__list"),
  };
}

const refs = getRefs();

// Listeners
refs.formInput.addEventListener("input", onInputChange);
refs.form.addEventListener("submit", onFormSubmit);
refs.btnSortByName.addEventListener("click", onSortByName);
refs.btnSortByValue.addEventListener("click", onSortByValue);
refs.btnDelete.addEventListener("click", onDelete);
refs.btnShowXML.addEventListener("click", onXMLShow);
refs.pairsList.addEventListener("click", onItemClick);

// Main array for pairs
let arrayOfPairs = [];

// Function for availability of form button
function onInputChange(e) {
  if (e.target.value.trim().length >= 1) {
    refs.formButton.removeAttribute("disabled", false);
  }
  if (e.target.value.trim().length === 0) {
    refs.formButton.setAttribute("disabled", true);
  }
}

function onFormSubmit(e) {
  e.preventDefault();
  const inputPair = e.target.elements.inputQuery.value.trim();
  const name = inputPair.split("=")[0]?.trim();
  const value = inputPair.split("=")[1]?.trim();
  const isAlfaNumeric = validationPairs(name, value);

  // Check pairs for correct format
  if (inputPair !== "" && name && value && isAlfaNumeric) {
    const pair = {
      id: Date.now(),
      name,
      value,
    };

    arrayOfPairs.push(pair);

    addToLocalStorage(arrayOfPairs);
    renderMarkup(arrayOfPairs);
    e.target.elements.inputQuery.value = "";
  } else {
    alert("please add pair");
  }
}

//Function for pairs validation
function validationPairs(name, value) {
  if (/[^a-zA-Z0-9]/.test(name) || /[^a-zA-Z0-9]/.test(value)) {
    alert("Input is not alphanumeric");
    return false;
  }
  return true;
}

function addToLocalStorage(pairs) {
  // convert the array to string then store it.
  localStorage.setItem("pairs", JSON.stringify(pairs));
  // render to screen
  renderMarkup(pairs);
}

// function helps to get everything from local storage
function getFromLocalStorage() {
  const getPairs = localStorage.getItem("pairs");

  if (getPairs) {
    const pairs = JSON.parse(getPairs);
    arrayOfPairs.push(...pairs);
    renderMarkup(pairs);
  }
}

// Function for sort by name
function onSortByName(e) {
  const sortedArrayOfPairs = [...arrayOfPairs].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  renderMarkup(sortedArrayOfPairs);
}

// Function for sort by value
function onSortByValue(e) {
  const sortedArrayOfPairs = [...arrayOfPairs].sort((a, b) =>
    a.value.localeCompare(b.value)
  );
  renderMarkup(sortedArrayOfPairs);
}

// Function for getting id from checked pair and add to localStorage
function onItemClick(e) {
  const checkedItem = e.target.id;

  localStorage.setItem("idForDelete", JSON.stringify(checkedItem));
}

// Function for deleting checked pairs and change main array with pairs
function onDelete(e) {
  const getPairs = localStorage.getItem("idForDelete");
  const pairs = JSON.parse(getPairs);
  const isPairsAvailable = arrayOfPairs.find((el) => el.id === Number(pairs));
  if (!isPairsAvailable) {
    return;
  }
  arrayOfPairs = arrayOfPairs.filter(function (item) {
    return item.id != pairs;
  });

  addToLocalStorage(arrayOfPairs);
}

// Function fro rendering pair in xml format
function onXMLShow() {
  const getPairs = localStorage.getItem("pairs");
  const pairs = JSON.parse(getPairs);
  refs.sectionXML.classList.toggle("visually-hidden");
  renderXML(pairs);
}

// Get pairs from localStorage after reloading page
getFromLocalStorage();

//Template for rendering markup for main list of pairs
function renderMarkup(array) {
  const markup = array
    .map(
      (item) => /*html*/ `
        <li class="pairs__list_item"><button id='${item.id}' class="pairs__list_item_btn">${item.name}=${item.value}</button></li>
  `
    )
    .join("");

  refs.pairsList.innerHTML = markup;
}

//Template for rendering xml markup
function renderXML(array) {
  const markup = array
    .map(
      (item) => /*html*/ `
      <li class='xml__list_item'>&lt;<span>pairsElement id</span>="${item.id}"	&gt;
         <p class='xml__list_text'>&lt;<span>name</span>&gt;${item.name}&lt;<span>/name</span>	&gt;</p>
          <p class='xml__list_text'>&lt;<span>value</span>&gt;${item.value}&lt;<span>/value</span>&gt;</p>
      &lt;<span>/pairsElement</span>&gt;   </li>
  `
    )
    .join("");
  refs.XMLList.innerHTML = markup;
}
