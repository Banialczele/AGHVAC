const picture = function(type, imageContainer, containerName, imageId, src = '') {
	const image = document.createElement('img');
	switch( type ) {
		case "psu": {
			image.setAttribute('src', "./Gfx/CU.svg");
			image.setAttribute('id', `${imageId}`);
			const container = document.querySelector(`.${containerName}`);
			const psuImageContainer = document.createElement('div');
			psuImageContainer.classList.add('psuImageContainer');
			psuImageContainer.appendChild(image);
			container.appendChild(psuImageContainer);
			break;
		}
		case "cable" : {
			image.setAttribute('id', `${type}${imageId}`);
			image.classList.add(`${type}image`);
			const container = document.querySelector(`#${containerName}`);
			const imageSection = document.createElement('div');
			imageSection.className = imageContainer;
			imageSection.appendChild(image);
			container.prepend(imageSection);
			break;
		}
		case "device" : {
			const container = document.querySelector(`#${containerName}`);
			image.setAttribute('id', `${type}${imageId}`);
			image.classList.add(`${type}image`);
			const imageSection = document.createElement('div');
			imageSection.className = imageContainer;
			imageSection.appendChild(image);
			container.prepend(imageSection);
			break;
		}
	}
}
