const cables = Cables.map(cables => ({ ...cables }));
const devices = Devices.map(devices => ({ ...devices }));

const generateOptions = (param, select) => {
	for( let i = 0; i < param.length; i++ ) {
		const option = document.createElement('option');
		option.innerHTML = param[i].type;
		option.value = param[i].type;
		param[i].isBig ? option.setAttribute('data-isBig', `${param[i].isBig = true}`) : '';
		select.appendChild(option);
	}
}

const select = function(param, segmentName, type) {
	const label = document.createElement('label');
	const select = document.createElement('select');
	const div = document.querySelector(`.${segmentName}`);
	const containerDiv = document.createElement('div');

	switch( type ) {
		case 'powerSupply' : {
			containerDiv.className = `powerSupplyContainer`;
			label.className = `powerSupplyLabel`;
			label.setAttribute('for', 'powerSupply');
			select.className = 'powerSupply';
			select.setAttribute('name', 'powerSupply');
			select.setAttribute('id', 'powerSupply');

			// label.innerText = chooseText(usedText.typZasilacza);
			label.appendChild(select);
			containerDiv.appendChild(label);
			div.appendChild(containerDiv);
			generateOptions(param, select);
			break;
		}
		case 'cable' : {
			containerDiv.className = 'cableContainer';
			const segment = div.querySelector(`.${segmentName} .checkboxAndcableContainer`);
			label.className = `cableLabel`;
			label.setAttribute('for', 'cableSelect');
			select.className = 'cableSelect';
			select.setAttribute('name', 'cableSelect');
			select.setAttribute('id', 'cableSelect');

			label.appendChild(select);
			containerDiv.appendChild(label);
			segment.appendChild(containerDiv);
			div.appendChild(segment);
			generateOptions(cables, select);
			break;
		}

		case 'device' : {
			containerDiv.className = 'deviceContainer';
			label.className = `deviceLabel`;
			label.setAttribute('for', 'deviceSelect');
			select.className = 'deviceSelect';
			select.setAttribute('name', 'deviceSelect');
			select.setAttribute('id', 'deviceSelect');

			label.appendChild(select);
			containerDiv.appendChild(label);
			div.appendChild(containerDiv);
			generateOptions(devices, select);
			break;
		}
	}


}
