const dataToInsert = {
	cableType: '',
	cableIndex: '',
	deviceType: '',
	deviceIndex: '',
	cableLength: ''
};

const button = function (index) {
	const segmentContainer = document.querySelector(`#segmentContainer${index}`);
	const deviceContainer = segmentContainer.querySelector(`.deviceContainer`);
	let copyButtonContainer;

	copyButtonContainer = document.createElement('div');
	copyButtonContainer.setAttribute('id', `#deviceButtons`);
	copyButtonContainer.className = `deviceButtons`;

	const copyButton = document.createElement('button');
	copyButton.innerHTML = '<img src="./Icons/copy.svg" alt="Unable to find image"/>';
	copyButton.className = "copyButton";
	const deleteButton = document.createElement('button');
	deleteButton.innerHTML = `<img src="./Icons/delete.svg" alt="Unable to find image" />`;
	deleteButton.className = "deleteButton";

	//create input element to get amount of segments to create
	const input = document.createElement('input');

	input.type = 'Number';
	input.setAttribute('id', `quantity${index}`);
	input.className = 'deviceQuantity';
	input.setAttribute('name', `deviceQuantity`);
	input.value = 1;
	input.setAttribute('min', 0);

	copyButton.setAttribute('id', `Skopiuj${index}`);
	deleteButton.setAttribute('id', `Usun${index}`);

	copyButtonContainer.appendChild(copyButton);
	copyButtonContainer.appendChild(input);
	copyButtonContainer.appendChild(deleteButton);
	deviceContainer.appendChild(copyButtonContainer);
	segmentContainer.appendChild(deviceContainer);
};

function dataToCopy(segmentContainer) {
	dataToInsert.cableType = (segmentContainer.querySelector(`.cableSelect`)).value;
	dataToInsert.cableIndex = (segmentContainer.querySelector(`.cableSelect`)).selectedIndex;
	dataToInsert.deviceType = (segmentContainer.querySelector(`.deviceSelect`)).value;
	dataToInsert.deviceIndex = (segmentContainer.querySelector(`.deviceSelect`)).selectedIndex;
	dataToInsert.cableLength = (segmentContainer.querySelector(`.cableContainerInput input`)).value;
	return dataToInsert;
}

function insertDataToSegment(segmentContainer, index, newIndex, installationContainer, data, indexWhereToCopyDiv, num, i) {
	const newSegment = {
		cableType: `${data.cableType}`,
		cableLen_m: num,
		deviceType: `${data.deviceType}`
	};
	//adding new segment at specific index ( not at the end of array )
	systemData.bus.splice(indexWhereToCopyDiv, 0, newSegment);

	const clone = segmentContainer.cloneNode(true);

	const deviceQuantity = clone.querySelector(`#quantity${index}`);
	deviceQuantity.setAttribute('id', `quantity${newIndex}`);
	deviceQuantity.value = 1;

	const checkboxIterator = clone.querySelector(`#checkboxIterator${index}`);
	checkboxIterator.setAttribute('id', `checkboxIterator${newIndex}`);
	const checkboxNewId = clone.querySelector('input[type="checkbox"]');
	checkboxNewId.setAttribute('id', `checkbox${newIndex}`);
	clone.id = `segmentContainer${newIndex}`;
	clone.className = `segmentContainer${newIndex}`;
	clone.classList.add("installationSegment");
	const cableSelect = clone.querySelector('select[name="cableSelect"]');
	cableSelect.selectedIndex = data.cableIndex;
	cableSelect.selectedOptions = cableSelect.options[data.cableIndex];

	const cloneDeviceImage = clone.querySelector('.deviceimage');
	const cloneCableImage = clone.querySelector('.cableimage');
	cloneDeviceImage.setAttribute('id', `deviceimage${newIndex}`);
	cloneCableImage.setAttribute('id', `cableimage${newIndex}`);
	segmentEvents(clone);
	const cloneCopyButton = clone.querySelector(`.deviceContainer #Skopiuj${index}`);
	const cloneDeleteButton = clone.querySelector(`.deviceContainer #Usun${index}`);
	cloneCopyButton.setAttribute('id', `Skopiuj${newIndex}`);
	cloneDeleteButton.setAttribute('id', `Usun${newIndex}`);
	const deviceSelect = clone.querySelector('select[name="deviceSelect"]');
	deviceSelect.selectedIndex = data.deviceIndex;
	deviceSelect.selectedOptions = cableSelect.options[data.deviceIndex];
	let updateIndexToCopyCloneTo = indexWhereToCopyDiv + 1 + i;
	installationContainer.insertBefore(clone, installationContainer.children[updateIndexToCopyCloneTo]);

}

function handleCopyNthTimes(e, amountToCopy) {
	e.preventDefault();
	//get index of an element from id
	const index = parseInt(e.target.id.match(/\d+/)[0]);

	//select segment to copy
	const segmentContainer = document.querySelector(`.segmentContainer${index}`);
	const segments = document.querySelectorAll('.installationSegment');
	const indexWhereToCopyDiv = Array.from(segments).findIndex(segment => segment === segmentContainer);

	const data = dataToCopy(segmentContainer);

	const installationContainer = document.querySelector('.installationContainer');

	const num = parseFloat(data.cableLength) || 0;

	let newIndex = 0;

	const buttonDiv = document.querySelector('.buttonDiv');
	if (buttonDiv) {
		buttonDiv.parentNode.removeChild(buttonDiv);
	}

	for (let i = 0; i < amountToCopy; i++) {
		//generating unique index for segment.
		while (newIndex === Cable.usedIndexes[newIndex]) {
			newIndex++;
			if (newIndex !== Cable.usedIndexes[newIndex]) {
				Cable.usedIndexes.push(newIndex);
				break;
			}
		}

		insertDataToSegment(segmentContainer, index, newIndex, installationContainer, data, indexWhereToCopyDiv, num, i);
	}
}

function handleDeleteDevice(e) {
	const segments = Array.from(document.querySelectorAll('.installationSegment'));
	if (segments.length > 1) {

		const segmentContainer = e.target.closest('.installationSegment');
		//number assigned to segment
		const segmentId = segmentContainer.querySelector('.segmentIterator').innerHTML;

		const findIndexToDelete = Array.from(segments).findIndex(segment => segment === segmentContainer);
		systemData.bus.splice(findIndexToDelete, 1);
		if (segmentContainer.parentNode !== null) {
			const infoPopup = document.querySelector('.popup');

			infoPopup.innerText = `${chooseText(usedText.usunSegment)} ${segmentId}`;
			segmentContainer.classList.add('installationSegment--delete')

			segmentContainer.addEventListener('transitionend', e => {
				segmentContainer.parentNode.removeChild(segmentContainer);
			});

			infoPopup.classList.add('open-active')
			setTimeout(() => { infoPopup.classList.remove('open-active') }, 3000);
		}
	} else {
		const infoPopup = document.querySelector('.popup');
		infoPopup.innerText = chooseText(usedText.usunJedynySegment);

		infoPopup.classList.add('open-active')
		setTimeout(() => { infoPopup.classList.remove('open-active') }, 3000);
	}
}

function deleteManySegments() {
	const segments = Array.from(document.querySelectorAll('.installationSegment'));
	const checkedSegments = selectedCheckboxes(segments);
	if (checkedSegments.length === segments.length) {
		checkedSegments.forEach((segment, i) => {
			if (i >= 1) {
				segment.parentNode.removeChild(segment);
			} else {
				const infoPopup = document.querySelector('.popup');
				infoPopup.innerText = chooseText(usedText.usunJedynySegment);

				infoPopup.classList.add('open-active')
				setTimeout(() => { infoPopup.classList.remove('open-active') }, 3000);
			}
		});
	} else {
		checkedSegments.forEach((segment, i) => {
			segment.parentNode.removeChild(segment);
		});
	}
}


function checkboxButtons(installationContainer) {
	const checkboxesContainer = document.createElement('div');
	checkboxesContainer.className = 'configurationPanel';

	const masterCheckboxWithLabel = document.createElement('div');
	masterCheckboxWithLabel.className = 'masterCheckboxWithLabel';

	const checkCheckboxes = document.createElement('input');
	checkCheckboxes.type = 'checkbox';
	checkCheckboxes.setAttribute('id', 'checkCheckboxes');
	checkCheckboxes.setAttribute('name', 'checkCheckboxes');
	const checkCheckboxesLabel = document.createElement('label');

	checkCheckboxesLabel.innerHTML = chooseText(usedText.zaznaczWszystkie);
	checkCheckboxesLabel.setAttribute('for', 'checkCheckboxes');
	checkCheckboxesLabel.setAttribute('id', 'checkCheckboxesLabel');

	const matchSystemCables = document.createElement('input');
	matchSystemCables.setAttribute('id', 'matchCablesToSystem');
	matchSystemCables.type = "button";
	matchSystemCables.value = chooseText(usedText.dobierzKabel);

	checkboxesContainer.prepend(matchSystemCables);
	masterCheckboxWithLabel.prepend(checkCheckboxesLabel);
	masterCheckboxWithLabel.prepend(checkCheckboxes);

	checkboxesContainer.appendChild(masterCheckboxWithLabel);
	installationContainer.appendChild(checkboxesContainer);
}
