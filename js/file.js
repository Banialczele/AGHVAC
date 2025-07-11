function saveToFile(dataToSave) {
	const date = new Date();
	const saveFileName = `TetaSystem_${date.getFullYear()}_${getMonth(date)}_${date.getDate()}__${date.getHours()}_${date.getMinutes()}`;
	const anchor = document.createElement('a');
	anchor.style = 'display:none';
	const fileName = prompt("Nazwa pliku?", `${saveFileName}`);
	if( fileName === null ) return;
	const dataAsString = JSON.stringify(dataToSave);
	const blob = new Blob([ dataAsString ], { type: "text/javascript" });
	anchor.href = window.URL.createObjectURL(blob);
	anchor.download = `${fileName}.json`;
	anchor.click();
}

function getMonth(date) {
	const month = new Date().getMonth() + 1;
	return month < 10 ? `0${month}` : month;
}

function dragenter(e) {
	e.stopPropagation();
	e.preventDefault();
}

function dragover(e) {
	e.stopPropagation();
	e.preventDefault();
}

function readFromFile() {
	const element = document.getElementById('file-input');
	element.addEventListener('change', e => handleDroppedFile(e));
	element.click();
}

function fileButtons() {
	const fileButtonsDiv = document.createElement('div');
	const saveToFile = document.createElement('input');
	const fileInput = document.createElement('input');
	const readFromFile = document.createElement('button');

	fileInput.setAttribute('id', "file-input");
	fileInput.type = "file";
	fileInput.name = "name";
	fileInput.setAttribute("style", "display: none;");

	saveToFile.setAttribute('id', 'saveSystemToFile');
	readFromFile.setAttribute('id', 'readSystemFromFile');
	readFromFile.setAttribute('type', 'file');

	saveToFile.classList.add('saveFileAnchor');
	readFromFile.classList.add('readFile');
	fileButtonsDiv.classList.add('fileDiv');

	saveToFile.type = 'button';
	saveToFile.value = chooseText(usedText.zachowajSystem);

	readFromFile.innerText = chooseText(usedText.wczytajSystem);
	const powerSupplyContainer = document.querySelector('.configurationPanel');

	fileButtonsDiv.append(fileInput);
	fileButtonsDiv.append(saveToFile);
	fileButtonsDiv.append(readFromFile);
	powerSupplyContainer.prepend(fileButtonsDiv);
}

function handleDroppedFile(e) {
	e.stopPropagation();
	e.preventDefault();
	const dataTransfer = e.dataTransfer;
	const files = e.target.files || dataTransfer.files;
	const installationContainer = document.querySelector('.installationContainer');
	for (let file of files) {
		const blob = new Blob([file], { type: "application/json" });
		const fr = new FileReader();

		fr.addEventListener('load', () => {
			Array.from(installationContainer.children).forEach(child => child.parentNode.removeChild(child));
			const data = JSON.parse(fr.result);

			Cable.usedIndexes = [];

			getSystem(setSystem(data));
			(document.querySelector('.powerSupply')).value = data.supplyType;

			const segments = document.querySelectorAll('.installationSegment');

			segments.forEach((segment, i) => {
				if (i !== 0) {
					segment.querySelector('.copyButton').setAttribute('id', `Skopiuj${i}`);
					segment.querySelector('.deleteButton').setAttribute('id', `Usun${i}`);
				}
			});
			updateSystemInfo();

		});
		fr.readAsText(blob);
	}
}

function handleDragAndDrop() {
	const dragAndDropContainer = document.querySelector('body');
	dragAndDropContainer.addEventListener('dragenter', dragenter);
	dragAndDropContainer.addEventListener('dragover', dragover);
	dragAndDropContainer.addEventListener('drop', handleDroppedFile);
}
