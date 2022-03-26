let formObj;

// UI
const btnCreateForm = document.getElementById("btn-create-form");
const btnDeleteForm = document.getElementById("btn-delete-form");

// Event
document
  .getElementById("file")
  .addEventListener("change", handleFileSelect, false);
btnCreateForm.addEventListener("click", renderForm);
btnDeleteForm.addEventListener("click", clearContainer);

// Handler
function handleFileSelect(e) {
  let file = e.target.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function () {
    getResult(JSON.parse(reader.result));
  };

  reader.onerror = function () {
    console.log(reader.error);
  };
}

function getResult(result) {
  formObj = result;
}

function renderForm() {
  if (!formObj) {
    alert("сперва выберете файл");
    return;
  }
  const formContainer = document.querySelector(".form-container");

  if (formContainer.children.length) {
    clearContainer();
  }

  let fields = createFields();
  let buttons = createButtons();
  let fragment = formTemplate(fields, buttons);
  formContainer.insertAdjacentHTML("afterbegin", fragment);
  addClassBootstrap();
}

function addClassBootstrap() {
  let colorsType = document.querySelectorAll('input[type="color"]');
  let colorsArray = Array.from(colorsType);
  colorsArray.forEach((input) => input.classList.add("form-control-color"));

  let checkboxType = document.querySelectorAll('input[type="checkbox"]');
  let checkboxsArray = Array.from(checkboxType);
  checkboxsArray.forEach((input) => input.classList.add("form-check-input"));
}

function clearContainer() {
  const formContainer = document.querySelector(".form-container");
  formContainer.innerHTML = "";
}

function createFields() {
  let fragment = "";
  if (!formObj.fields) {
    return "";
  }

  formObj.fields.forEach((field) => {
    if(field.input.type === 'textarea') {
      fragment += `
      <div class="mb-3">
        <label for="${field.label || ""}" class="form-label">${field.label || ""}</label>
        <textarea class="form-control" id="${field.label || ""}" rows="3"></textarea>
      </div>
    `;
    }
    else {
      fragment += `
      <div class="mb-3">
        <label for="${field.label || ""}" class="form-label">${field.label || ""}</label>
        <input type="${field.input.type}" class="form-control" placeholder='${field.input.placeholder || ""}' id="${field.label || ""}">
      </div>
    `;
    }
  });

  return fragment;
}

function createButtons() {
  let fragment = "";
  if (!formObj.buttons) {
    return "";
  }
  formObj.buttons.forEach((button) => {
    fragment += `
    <button type="button" class="btn btn-primary mt-3">${button.text}</button>
    `;
  });
  return fragment;
}

function formTemplate(fields, buttons) {
  return `
    <h2 class="form-title mt-5 d-flex justify-content-center">${formObj.name}</h2>
    <form>
      ${fields}
      ${buttons}
    </form>
  `;
}
