const checkbox = function (param, installationContainerName, segmentName, checkboxContainer, i) {
	const input = document.createElement('input');
	const segmentDiv = document.createElement('div');
	const checkboxDiv = document.createElement('div');
	const checkboxAndIteratorContainer = document.createElement('div');
	checkboxAndIteratorContainer.className = 'checkboxIteratorContainer';
	const span = document.createElement('span');
	span.setAttribute('id', `checkboxIterator${i}`);

	input.setAttribute('id', `checkbox${i}`);
	segmentDiv.className = segmentName;
	segmentDiv.classList.add('installationSegment');
	segmentDiv.setAttribute('id', segmentName );
	checkboxDiv.className = checkboxContainer;
	span.className = 'segmentIterator';
	const div = document.querySelector(`.${installationContainerName}`);
	const installationContainer = document.querySelector('.installationContainer');
	input.type = 'checkbox';
	input.name = 'cableType';
	checkboxAndIteratorContainer.appendChild(span);
	checkboxAndIteratorContainer.appendChild(input);
	checkboxDiv.appendChild(checkboxAndIteratorContainer);
	segmentDiv.appendChild(checkboxDiv);
	installationContainer.appendChild(segmentDiv);
	div.appendChild(installationContainer);
};
