const Cable = {
	usedIndexes: [],
	cableComponent: function(cable, index) {
		checkbox(cable, 'powerManagementInstallationContainer ', `segmentContainer${index}`, `checkboxAndcableContainer`, index);
		select(null, `segmentContainer${index}`, `cable`);
		input(cable, `.segmentContainer${index} .cableContainer`, `cableInput`, 'cableInput', 'cableContainerInput');
		picture('cable', `cableImageContainer`, `segmentContainer${index}`, `image${index}`);
		this.usedIndexes.push(index);
	},

}


