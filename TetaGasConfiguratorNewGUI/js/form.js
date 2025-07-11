// Tworzenie opcji dla selecta dot. rodzaju struktury
function createStructureTypesListSelect() {
  const select = document.getElementById("structureType");
  const fragment = document.createDocumentFragment();

  STRUCTURE_TYPES.forEach((elem) => {
    const option = createOption(elem.type[lang], elem.type[lang], {
      class: "structureOption",
      selected: elem.type[lang] === STRUCTURE_TYPES[0].type[lang],
    });
    fragment.appendChild(option);
  });

  select.innerHTML = "";
  select.appendChild(fragment);
  structureSelectHandler();
  createDetectedGasListSelect();
}

function getFirstDetector(structure, deviceName) {
  return structure.devices.find((device) => device.type === deviceName);
}

function structureSelectHandler() {
  const structureSelect = document.getElementById(`structureType`);
  structureSelect.addEventListener(`change`, (event) => {
    const gasDetectionSelect = document.getElementById(`gasDetected`);
    const selectedStructure = STRUCTURE_TYPES.find((structure) => structure.type[lang] === event.target.value);
    initSystem.selectedStructure = selectedStructure;
    createDetectedGasListSelect();
    initSystem.detector = getFirstDetector(selectedStructure, gasDetectionSelect.options[0].dataset.devicename);
  });
}

function gasListSelectHandler(select) {
  select.addEventListener("change", (event) => {
    const opt = event.target.selectedOptions[0];
    initSystem.detector = getFirstDetector(initSystem.selectedStructure, opt.dataset.devicename);
  });
}

function createDetectedGasListSelect() {
  const select = document.getElementById("gasDetected");
  const fragment = document.createDocumentFragment();

  select.innerHTML = "";

  const structure = initSystem.selectedStructure;
  if (!structure) return;

  structure.detection.forEach((gas, i) => {
    const device = structure.devices[i];
    if (device.class !== "detector") return;
    const option = createOption(gas, gas, {
      class: "gasOption",
      "data-devicename": device.type,
      "data-devicetype": device.class,
      selected: gas === initSystem.gasDetected,
    });
    fragment.appendChild(option);
  });

  select.appendChild(fragment);
  gasListSelectHandler(select);
}

function createBatteryBackUpListSelect() {
  const select = document.getElementById("batteryBackUp");
  const fragment = document.createDocumentFragment();

  const yesOption = createOption(TRANSLATION.batteryBackUpYes[lang], TRANSLATION.batteryBackUpYes[lang], {
    class: "batteryBackupOption",
  });

  const noOption = createOption(TRANSLATION.batteryBackUpNo[lang], TRANSLATION.batteryBackUpNo[lang], {
    class: "batteryBackupOption",
    selected: true,
  });

  fragment.appendChild(yesOption);
  fragment.appendChild(noOption);

  select.innerHTML = "";
  select.appendChild(fragment);
}

// Pomocnicza funkcja do tworzenia opcji
function createOption(value, text, attributes = {}) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  Object.entries(attributes).forEach(([key, val]) => {
    if (val === true) option.setAttribute(key, key);
    else if (val !== false && val != null) option.setAttribute(key, val);
  });
  return option;
}

// Ustawienie domyślnych wartości dla inputa liczby urządzeń oraz odległości między urządzeniami
function setInputDefaultData() {
  document.getElementById("amountOfDetectors").value = initSystem.amountOfDetectors;
  document.getElementById("EWL").value = initSystem.EWL;
}

function checkBusLength() {
  const amountOfDetectors = initSystem.amountOfDetectors;
  const busLength = systemData.bus[0].wireLength;
  return amountOfDetectors * busLength;
}

// Inicjowanie formularza wraz z domyślnymi ustawieniami
function formInit() {
  createStructureTypesListSelect();
  createDetectedGasListSelect();
  createBatteryBackUpListSelect();
  setInputDefaultData();
}

function handleErrorPopup(message) {
  const popupcontainer = document.querySelector(".configuratorPanel ");
  const df = document.createDocumentFragment();
  const paragraph = document.createElement(`p`);
  const paragraphContainer = document.createElement(`div`);
  const closeButton = document.createElement(`button`);
  closeButton.classList.add(`formPopUpParagraphCloseButton`);
  closeButton.classList.add(`formButton`);
  closeButton.innerText = "X";
  paragraph.classList.add(`formPopupParagraph`);
  paragraphContainer.classList.add(`formPopupContainer`);

  paragraphContainer.classList.add("formPopupContainerToggle");
  paragraphContainer.classList.add("panelContainer");
  paragraph.innerHTML = message;
  closeButton.addEventListener(`click`, () => {
    paragraphContainer.replaceChildren();
    paragraphContainer.classList.remove(`formPopupContainerToggle`);
    paragraphContainer.classList.remove(`panelContainer`);
  });
  paragraphContainer.appendChild(closeButton);
  paragraphContainer.appendChild(paragraph);
  df.appendChild(paragraphContainer);
  popupcontainer.appendChild(df);
}

function findControlUnit() {
  const batteryBackUp = document.getElementById("batteryBackUp").value;
  const backUpOption =
    batteryBackUp === `Nie`
      ? CONTROLUNITLIST.find((unit) => unit.possibleUPS === `no`)
      : CONTROLUNITLIST.find((unit) => unit.possibleUPS === `yes`);
  return backUpOption;
}

function showOverlayPanel(data) {
  const overlay = document.getElementById('overlayPanel');
  const list = document.getElementById('overlayList');
  list.querySelectorAll('.panel-col:not(.template)').forEach(e => e.remove()); // wyczyść poprzednie (nie szablon!)

  const template = document.getElementById('colTemplate');

  data.forEach(item => {
    const col = template.cloneNode(true);
    col.classList.remove('template');
    col.id = ''; // usuwamy id z klona!
    col.style.display = '';

    // Obrazek
    const img = col.querySelector('.img');
    img.src = `./PNG/${item.supplyType.img}.png`;
    img.alt = item.supplyType.type;

    // Nazwa
    col.querySelector('.name').textContent = item.supplyType.type;
    // Dodatkowa wartość
    col.querySelector('.productKey').textContent = item.supplyType.productKey;
    // col.querySelector(`.totalPower`).textContent = item.

    // Kabel: select dla wielu, info dla jednego
    const select = col.querySelector('.cable-select');
    if (item.validCables.length > 0) {
      item.validCables.forEach(cable => {
        const option = document.createElement(`option`);
        option.textContent = cable.cableType.type;
        option.value = cable.cableType.type;
        select.appendChild(option);
      })
    }
    select.value = item.validCables[0].cableType.type;
    select.addEventListener(`change`, e => updateDataInOverlay(e, col, item));
    col.querySelector(`.totalPower`).textContent = `Pobór mocy: ${item.validCables[0].totalPower}W`;
    col.querySelector(`.totalCurrent`).textContent = `Prąd: ${item.validCables[0].totalCurrent}A`;
    col.querySelector(`.totalVoltage`).textContent = `Napięcie: ${item.validCables[0].totalVoltage}V`;

    // Przycisk
    col.querySelector('.choose-btn').onclick = () => {
      updateModControlAndCable(item, select.value)
      hideOverlayPanel();
    };

    list.appendChild(col);
  });

  overlay.classList.remove('hidden');
}

function updateModControlAndCable(item, newCable) {
  const modControl = CONTROLUNITLIST.find(unit => unit.productKey === item.supplyType.productKey);
  const elem = item.validCables.find(cable => cable.cableType.type === newCable);

  systemData.supplyType = modControl;
  systemData.totalCurrent = elem.totalCurrent;
  systemData.totalPower = elem.totalPower;
  systemData.totalVoltage = elem.totalVoltage;
  systemData.wireType = elem.cableType.type
}

function updateDataInOverlay(event, col, item) {
  const newCable = item.validCables.find(cable => cable.cableType.type === event.target.value);
  col.querySelector(`.totalPower`).textContent = `Pobór mocy: ${newCable.totalPower}W`;
  col.querySelector(`.totalCurrent`).textContent = `Prąd: ${newCable.totalCurrent}A`;
  col.querySelector(`.totalVoltage`).textContent = `Napięcie: ${newCable.totalVoltage}V`;
}

document.querySelector('.close-btn').onclick = hideOverlayPanel;
document.querySelector('.overlay-panel-backdrop').onclick = hideOverlayPanel;

function hideOverlayPanel() {
  document.getElementById('overlayPanel').classList.add('hidden');
}

// Przetwarzanie formularza dot. systemu
function handleFormSubmit() {
  //Zatwierdzenie formularza, przypisanie wybranych przez użytkownika parametrów do obiektu inicjującego podgląd systemu i wygenerowanie podglądu
  const form = document.querySelector(".form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    systemData.supplyType = findControlUnit(batteryBackUp);
    initSystem.amountOfDetectors = parseInt(document.getElementById("amountOfDetectors").value);
    systemData.devicesTypes = { detectors: [], signallers: [] };
    systemData.bus = [];
    systemData.amountOfDetectors = initSystem.amountOfDetectors;
    for (let i = 0; i < initSystem.amountOfDetectors; i++) {
      systemData.bus.push({
        index: i + 1,
        detector: initSystem.detector,
        wireLength: parseInt(document.getElementById("EWL").value),
        description: "",
      });
    }
    systemData.selectedStructure = initSystem.selectedStructure;
    const res = calculateAllSystemVariants();
    const selectedPSU = res.find(element => element.isUserSelected === true ? element : '');
    if (selectedPSU) {
      systemData.supplyType = selectedPSU.supplyType;
      systemData.wireType = selectedPSU.validCables[0].cableType.type;
      systemData.totalPower = selectedPSU.validCables[0].totalPower;
      systemData.totalCurrent = selectedPSU.validCables[0].totalCurrent;
      systemData.totalVoltage = selectedPSU.validCables[0].totalVoltage;
    } else {

    }
    showOverlayPanel(res);
    setSystem();
    system.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
