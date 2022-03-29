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
    formObj = JSON.parse(reader.result);
  };

  reader.onerror = function () {
    console.log(reader.error);
  };
}

function onChangeColor() {
  let checkboxColor = document.getElementById("Turnondarktheme?");
  let colorValue = document.getElementById("colorValue").value;

  if (checkboxColor.checked === true) {
    document.body.style.setProperty("--var-color", colorValue);
    checkboxColor.checked = false;
  }
}

function turnThemeColor() {
  let checkboxColor = document.getElementById("Turnondarktheme?");
  if (!checkboxColor) return;
  checkboxColor.addEventListener("change", onChangeColor);
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

  let fields = fieldsTemplate();
  let references = referencesTemplate();
  let buttons = buttonsTemplate();
  let fragment = formTemplate(fields, references, buttons);
  formContainer.insertAdjacentHTML("afterbegin", fragment);
  turnThemeColor();
}

function clearContainer() {
  const formContainer = document.querySelector(".form-container");
  formContainer.innerHTML = "";
}

function fieldsTemplate() {
  let fragment = "";
  if (!formObj.fields) {
    return "";
  }
  formObj.fields.forEach((field) => {
    if (field.input.type === "textarea") {
      fragment += `
      <div class="mb-3">
        <label class="form-label">${field.label || ""}</label>
        <textarea class="form-control" rows="3"></textarea>
      </div>
    `;
    } else if (field.input.type === "color") {
      let optionColors = "";
      field.input.colors.forEach((item) => {
        optionColors += `
          <option value='${item}'>${item}</option>
        `;
      });
      fragment += `
      <label  class="form-label">Choose color scheme</label>
      <input type="color" list="color" id="colorValue" class="form-control form-control-color" value="${field.input.colors[0]}" >
      <datalist id="color">
        ${optionColors}
      </datalist>
        <br>
      `;
    } else if (field.input.type === "technology") {
      let technologies = "";
      field.input.technologies.forEach((item) => {
        technologies += `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="${item}">
            <label class="form-check-label" for="${item}">
              ${item}
            </label>
          </div>
        `;
      });
      fragment += `
        <div class="mb-3">
          <label class="form-label">
            ${field.label || ""}
          </label>
          ${technologies}
        </div>
      `;
    } else if (field.input.mask) {
      field.id = Math.round(Math.random() * 1000);
      $(function () {
        $(`#${field.id}`).mask(`${field.input.mask}`);
      });
      fragment += `
        <div class="mb-3">
          <label for='${field.id}' class="form-label">
            ${field.label || ""}
          </label>
          <input type="text" class="form-control" id='${field.id}' />
        </div>
      `;
    } else if (field.input.type === "checkbox") {
      fragment += `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="${field.label
          .split(" ")
          .join("")}">
        <label class="form-check-label">
          ${field.label || ""}
        </label>
      </div>
    `;
    } else if (field.input.type === "file") {
      fragment += `
        <div class="mb-3">
          <label class="form-label">${field.label || ""}</label>
          <input class="form-control" type="file" accept="image/png, image/jpeg, .pdf" multiple>
        </div>
      `;
    } else {
      fragment += `
      <div class="mb-3">
        <label class="form-label">
          ${field.label || ""}
        </label>
        <input type="${field.input.type}" class="form-control" placeholder='${
        field.input.placeholder || ""
      }' >
      </div>
    `;
    }
  });

  return fragment;
}

function referencesTemplate() {
  let fragment = "";
  if (!formObj.references) {
    return "";
  }

  let referncesWithCheckbox = formObj.references.filter((item) => item.input);
  if (referncesWithCheckbox.length) {
    formObj.references.forEach((reference) => {
      if (!reference.text || !reference.ref) return;
      fragment += `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
          <div class='col-lg d-flex'>
            <div >${reference.text} ${
        reference["text without ref"] || ""
      } </div>
            <div class='link'><a href="#">${reference.ref}</a></div>
          </div>
        </div>
      `;
    });
  } else {
    formObj.references.forEach((reference) => {
      if (!reference.text || !reference.ref) return;
      fragment += `
        <div class='col-lg d-flex'>
          <div >${reference.text} ${reference["text without ref"] || ""} </div>
          <div class='link'><a href="#">${reference.ref}</a></div>
        </div>
      `;
    });
  }
  return fragment;
}

function buttonsTemplate() {
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

function formTemplate(fields, references, buttons) {
  return `
    <h2 class="form-title mt-5 d-flex justify-content-center">${formObj.name}</h2>
    <form>
      ${fields}
      <div class='row'>
        ${references}
      </div>
      ${buttons}
    </form>
    <hr>
  `;
}
