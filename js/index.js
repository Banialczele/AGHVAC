const powerSupplies = PowerSupplies.map(powerSupply => ({ ...powerSupply }));

let systemData = {
	supplyType: "24V",
	bus: [{
		cableType: "2 x 1 mm2",
		cableLen_m: 15,
		deviceType: "Teta EcoWent"
	}]
};

let lang = 'EN';

const usedText = {
	konfigurator: {
		pl: 'Konfigurator Systemów Teta',
		en: 'Teta System Configurator'
	},
	systemNiepoprawny: {
		pl: 'System: N/A',
		en: 'System: N/A'
	},
	usunWszystkie: {
		pl: 'Usuń zaznaczone',
		en: 'Delete selected'
	},
	oknoPomocnicze: {
		pl: `Pomoc`,
		en: `Help`
	},
	oknoPomocniczeDlaBledow: {
		pl: `Lista błędów systemu`,
		en: `System list of errors`
	},
	systemNiepoprawnyDescription: {
		pl: `Znalezione problemy:`,
		en: `Issues found:`
	},
	systemNiepoprawnyMessage: {
		pl: `
			<p>
				Narzędzie pomaga w prawidłowym skonfigurowaniu systemu Teta Gas ze wzgledu na rodzaj zasilania 
				oraz okablowania
			</p><br>
			<p>
				Jeśli system jest poprawnie skonfigurowany, widoczny jest symbol ✔️. W takim przypadku 
				prezentowane jest sumaryczne zapotrzebowanie na moc, która jest zużywana przez urządzenia 
				podłączone do magistrali uwzględniająca straty mocy w kablu magistrali.
			</p><br>
			<p>
				Jeśli system jest niepoprawnie skonfigurowany, widoczny jest symbol ❌. W takim przypadku należy 
				zmienić napięcie zasilania na wyższe, zmniejszyć ilość urządzeń, zastosowanie kabel o większym 
				przekroju żyły, bądź zmniejszyć długość połączeń.</p><br><p>Użyj przycisku 
				<strong>Dobierz kabel</strong> by automatycznie dobrać kable o najmijeszym możliwym 
				przekroju żyły.
			</p><br>
			<p>
				Edycja systemu (patrz też ilustracja poniżej):<br>
				Pole wyboru <strong>A</strong> pozwala na wybrarnie wariantu jegnostkizasilania sterujacej.<br>
				Elementy <strong>B</strong> pozwalają na okreslenie parametrów kabla pomiędzy dwoma 
				T-konektorami.<br>
				Pole wyboru <strong>C</strong> pozwala na wybrarnie typu urządzenia w danym miejscy magistrali.<br>
				<img src="./Gfx/helpImg.png" style="max-width:1300px" alt="Unable to find image" />
			</p>
		`,

		en: `
			<p>
				This tool helps to verify if correct power supply and cabling was chosen for Teta Gas system.
			</p><br>
			<p>
				If the system is designed correctly, the ✔️ symbol is shown together with total power 
				consumption by connected devices, including power loses in bus cabling.
			</p><br>
			<p>
				If the system is not designed correctly, the ❌ symbol is shown. To fix this increase power 
				supply voltage, decrease number of connected devices, decrease cable lenght between devices 
				or use cable with higher conductor diameter.</p><br><p>Use <strong>Adjust cable</strong> 
				button to automatically choose calble with lowest acceptable conductor diameter.
			</p><br>
			<p>
				System edit (see also image below):<br>
				The <strong>A</strong> field enables the selection of the control unit supply variant.<br>
				<strong>B</strong> elements allows you to select the length and type of cable between two T-connectors.<br>
				The <strong>C</strong> field enables the selection of the bus device type.<br>
				<img src="./Gfx/helpImg.png" style="max-width:1300px" alt="Unable to find image" />
			</p>
		`
	},
	zapotrzebowanieMocy: {
		pl: 'Zapotrzebowanie na moc przez elementy magistrali: ',
		en: 'Power consumed by bus devices: '
	},
	zaznaczWszystkie: {
		pl: 'Zaznacz wszystkie',
		en: 'Select all'
	},
	odznaczWszystkie: {
		pl: 'Odznacz wszystkie',
		en: 'Deselect all'
	},
	dobierzKabel: {
		pl: 'Dobierz kabel',
		en: 'Adjust cable'
	},
	zachowajSystem: {
		pl: 'Zachowaj system',
		en: 'Save system'
	},
	wczytajSystem: {
		pl: 'Wczytaj system',
		en: 'Load system'
	},
	usunSegment: {
		pl: 'Usunieto segment',
		en: 'Deleted segment'
	},
	usunJedynySegment: {
		pl: 'Nie można usunąć jedynego segmentu',
		en: 'Cannot delete only segment'
	},
	showMore: {
		pl: 'Więcej...',
		en: 'More...'
	}
}

window.addEventListener('load', () => {
	checkLang();
	const installationContainer = document.createElement('div');
	installationContainer.className = `installationContainer`;
	document.querySelector('h2').innerText = chooseText(usedText.konfigurator);
	const systemStatus = document.querySelector('.systemStatus');
	const systemContainer = document.querySelector('.powerManagementInstallationContainer');
	if (systemStatus && systemContainer) {
		systemContainer.appendChild(installationContainer);

		select(powerSupplies, 'powerManagementInstallationContainer', `powerSupply`);
		picture('psu', `psuImageContainer`, `powerSupplyContainer`, `imagePSU`);
		handleDragAndDrop();
		getSystem(setSystem(systemData));
		handleButtonEvents();
		handleCheckboxes();
		setupBusImage();
		handlePSU();
		checkboxButtons(systemContainer);
		addDeleteManySegments();
		assignNewIdToCheckbox();
		const targetNode = document.querySelector(".installationContainer");

		const config = {
			childList: true,
			subtree: false,
			attributes: false,
			characterData: false
		};

		const observer = new MutationObserver(handleDOMChange);
		observer.observe(targetNode, config);

		fileButtons();
		updateSystemInfo();
		handleHelpButton();
		showMoreButton();
	}
	onWindowSizeChange();
	
	const panelInfo = document.querySelector(`.systemInfo`);

	panelInfo.addEventListener('mouseenter', onPanelInfoMouseEnter);
	panelInfo.addEventListener('mouseleave', onPanelInfoMouseLeave);


});

window.addEventListener('resize', () => {
	onWindowSizeChange();	
});

let isSystemInfoBig = false;



function updateSystemInfo()
{
	const panelInfo = document.querySelector(`.systemInfo`);
	if (isSystemInfoBig)
	{
		panelInfo.classList.remove('systemInfoSmall');
		panelInfo.classList.add('systemInfoBig');
	}
	else
	{
		panelInfo.classList.remove('systemInfoBig');
		panelInfo.classList.add('systemInfoSmall');
	}
	updateSystemStatus(isSystemInfoBig);
	updateSystemErrors(isSystemInfoBig);
	
	const showMoreButtonContainer = document.querySelector(`.showMoreButtonContainer`);
	if (isSystemInfoBig == true)
	{
		showMoreButtonContainer.style.display = `none`;
	}
	else
	{
		showMoreButtonContainer.style.display = `block`;
	}
	showMoreButtonContainer.innerText = chooseText(usedText.showMore);
}

function generateListForError() {
	const errorMsg = getErrorDescription();
	console.log(isSystemOk(setSystem(systemData)));
	if (errorMsg.length !== 0) {
		const listContainer = document.createElement('div');
		const list = document.createElement('OL');
		errorMsg.forEach((element, i) => {
			if (errorMsg[i] !== undefined) {
				const item = document.createElement('li');
				item.className = `listItem`;
				item.setAttribute(`id`, `listItem${i}`);
				item.innerHTML = `${chooseText(element)}.`
				list.appendChild(item);
			}
		});
		listContainer.appendChild(list);
		return listContainer;

	}
}

function showMoreButton() {

}

function handleHelpButton() {
	const modal = document.querySelector('.modalHelper');
	const assistant = document.querySelector(`.modalTitle h2`);
	const helpButton = document.querySelector('.helpButton');
	const modalText = document.querySelector('.modalText');
	const configurationPanel = document.querySelector(`.configurationPanel`);
	helpButton.addEventListener('click', (e) => {
		modal.style.display = "block";
		assistant.innerText = `${chooseText(usedText.oknoPomocnicze)}`;
		modalText.innerHTML = `${chooseText(usedText.systemNiepoprawnyMessage)}`;
		//configurationPanel.style.display = `none`;
	});
	const closeButton = document.querySelector('.modalClose');
	closeButton.addEventListener('click', e => {
		//configurationPanel.style.display = `grid`;
		modal.style.display = "none";
	});
	window.addEventListener('click', (e) => e.target === modal ? e.target.style.display = "none" : '');

}

function addDeleteManySegments() {
	const deleteManyButton = document.createElement('button');
	deleteManyButton.innerHTML = `<img src="./Icons/delete.svg" alt="Unable to find image" />`;
	deleteManyButton.className = "deleteManyButton";
	deleteManyButton.setAttribute('id', 'deleteMany');

	const div = document.createElement('div');
	div.className = 'deleteManySegmentsContainer';
	const span = document.createElement('span');
	span.innerHTML = `${chooseText(usedText.usunWszystkie)}`;
	div.appendChild(deleteManyButton);

	const checkboxesContainer = document.querySelector('.masterCheckboxWithLabel');
	div.appendChild(span);
	checkboxesContainer.appendChild(div);

}

function segmentEvents(segment) {
	const segmentDeviceSelect = segment.querySelector('.deviceSelect');
	segmentDeviceSelect.addEventListener('change', (e) => handleInputAndSelectChange(e, segment));

	const segmentCableSelect = segment.querySelector('.cableSelect');
	segmentCableSelect.addEventListener('change', (e) => handleInputAndSelectChange(e, segment));

	const cableLength = segment.querySelector(`.cableLength`);
	cableLength.addEventListener('change', e => handleInputAndSelectChange(e, segment));

	const amountToCopy = segment.querySelector(`.deviceQuantity`);

	amountToCopy.addEventListener('keyup', e => e.key === 'Enter' || e.keyCode === 13 ? handleCopyNthTimes(e, e.target.value) : '');
}

function getSystem(system) {
	system.bus.forEach((item, i) => {
		generateSegments(item, i);
		initializeSegmentData(system, i);
	});
	const segments = document.querySelectorAll('.installationSegment');
	segments.forEach(segment => segmentEvents(segment));
}

function setSystem(system) {
	systemData = system;
	return systemData;
}

function updateSystemStatus(isBig)
{
	const installationContainer = document.querySelector('.powerManagementInstallationContainer');
	const sysOk = isSystemOk(setSystem(systemData));
	const info = document.getElementById('systemStatusText');
	
	powerText = "";
	if (sysOk) 
	{
		installationContainer.classList.add('sysOk');
		installationContainer.classList.remove('sysWrong');
		info.src = './Icons/sysOk.svg';
		const powerConsumption = document.getElementById('powerConsumption');
		powerText = `${chooseText(usedText.zapotrzebowanieMocy)} ${Math.ceil(analiseSystem(setSystem(systemData)).powerConsumption_W)} W`;			
	}
	else 
	{
		installationContainer.classList.add('sysWrong');
		installationContainer.classList.remove('sysOk');
		info.src = './Icons/sysWrong.svg';
		const powerConsumption = document.getElementById('powerConsumption');
		powerText = `${chooseText(usedText.zapotrzebowanieMocy)} N/A`;
	}
	if (isBig == true)
	{
		powerConsumption.innerText = powerText;
	}
	else
	{
		powerConsumption.innerText = ""
	}	
}

function assignNewIdToCheckbox() {
	const checkboxIdArr = document.querySelectorAll('.segmentIterator');
	checkboxIdArr.forEach((item, index) => {
		checkboxIdArr[index].innerHTML = `${index + 1}. `;
	});
}

function generateSegments(item, index) {
	Cable.cableComponent(item, index);
	Device.deviceComponent(item, index);
	Device.deviceButtons(index);
}

function initializeSegmentData(system, i) {
	const powerSupply = document.querySelector('.powerSupply');
	powerSupply.value = systemData.supplyType;
	const segment = document.querySelector(`.segmentContainer${i}`);
	segment.querySelector('.cableSelect').value = system.bus[i].cableType;
	segment.querySelector('input[name="cableInput"]').value = system.bus[i].cableLen_m;
	segment.querySelector('.deviceSelect').value = system.bus[i].deviceType;
	chooseImg(segment.querySelector('.deviceimage'), system.bus[i].deviceType, 'deviceImage');
}

function selectDeselectCheckboxes() {
	const checkboxes = document.querySelectorAll('input[name=cableType]');
	const selectAllCheckboxes = document.getElementById('checkCheckboxes');
	const selectAllCheckboxesLabel = document.getElementById('checkCheckboxesLabel');

	for (let checkbox of checkboxes) {
		selectAllCheckboxes.checked ? checkbox.checked = true : checkbox.checked = false;
	}
	selectAllCheckboxes.checked
		? selectAllCheckboxesLabel.innerText = chooseText(usedText.odznaczWszystkie)
		: selectAllCheckboxesLabel.innerText = chooseText(usedText.zaznaczWszystkie);

}

function matchCablesToSystem() {
	const installationContainer = document.querySelector('.installationContainer');
	while (installationContainer.firstChild) {
		installationContainer.removeChild(installationContainer.firstChild);
	}
	getSystem(setSystem(matchSystemCables(systemData)));
}


function selectedCheckboxes(segmentList) {
	return Array.from(segmentList).filter(segment => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		return checkbox.checked ? segment : null;
	});
}

function setupBusImage() {
	const segments = document.querySelectorAll('.installationSegment');
	const imageElements = document.querySelectorAll('.cableimage');
	segments.forEach((segment, i) => {
		const selectedOptionIndex = segment.querySelector('.deviceSelect').selectedIndex;
		const isDeviceBig = segment.querySelector('.deviceSelect').options[selectedOptionIndex].dataset.isbig || 'false';
		if (isDeviceBig === "true") {
			segment.classList.add('segmentBig');
		} else if (isDeviceBig !== "true" && segment.classList.contains('segmentBig')) {
			segment.classList.remove('segmentBig');
		}
		if (!(segments[i + 1])) {
			isDeviceBig === 'false' ? chooseImg(imageElements[i], "BusEndShort", 'busImage') : chooseImg(imageElements[i], "BusEndLong", 'busImage');
		} else {
			isDeviceBig === 'false' ? chooseImg(imageElements[i], "BusShort", 'busImage') : chooseImg(imageElements[i], "BusLong", 'busImage');
		}
	});
}

function checkLang() {
	let HREF = window.location.href;
	if (HREF.includes(`lang=pl`)) {
		lang = 'PL';
	} else if (HREF.includes(`lang=eng`)) {
		lang = 'EN'
	} else if (HREF.includes(`licenses`)) {
		displayLicenseInfo();
	}
}

function displayLicenseInfo() {
	const installationContainer = document.querySelector('.powerManagementInstallationContainer');
	const sys = document.querySelector('.sys');
	installationContainer.outerHTML = "";
	sys.outerHTML = "";
	const licenseDiv = document.createElement('div');
	licenseDiv.className = 'licenseDiv';
	licenseDiv.setAttribute('id', 'licenseDiv');
	const mitLicenseInfo = document.createElement('p');
	mitLicenseInfo.className = `licenseIntro`;
	mitLicenseInfo.innerText = ` Graphics copyrighted under the MIT license.`
	const mitLicenseText = document.createElement('article');
	mitLicenseText.className = `mitLicenseText`;
	mitLicenseText.innerText = 'See: https://www.svgrepo.com/svg/309481/copy-add and https://www.svgrepo.com/svg/309511/delete-forever';


	const licensedCopyImage = document.createElement('img');
	const licensedDeleteImage = document.createElement('img');
	licensedCopyImage.className = 'licensedCopyImage';
	licensedDeleteImage.className = 'licensedDeleteImage';
	licensedDeleteImage.src = `./Icons/delete.svg`;
	licensedCopyImage.src = `./Icons/copy.svg`;
	licenseDiv.appendChild(licensedCopyImage);
	licenseDiv.appendChild(licensedDeleteImage);
	licenseDiv.appendChild(mitLicenseInfo);
	licenseDiv.appendChild(mitLicenseText);
	document.body.appendChild(licenseDiv);
}

function chooseText(text) {
	let res;
	switch (lang) {
		case "PL": {
			res = text.pl;
			break;
		}
		case "EN": {
			res = text.en;
			break;
		}
	}
	return res;
}

chooseImg = (img, value, typeOfImage = '') => {
	switch (typeOfImage) {
		case "deviceImage": {
			const device = Devices.find(device => device.type === value);
			img.src = `./Gfx/${device.icon}`;
			img.alt = `Unable to find image`;
			break;
		}
		case "busImage": {
			img.src = `./Gfx/${value}.svg`;
			img.alt = `Unable to find image`;
			break;
		}
	}
}



