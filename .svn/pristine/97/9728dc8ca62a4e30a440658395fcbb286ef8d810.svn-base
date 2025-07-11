const PowerSupplies =
[
	{type: "24V", supplyVoltage_V: 24},
	{type: "24V + UPS", supplyVoltage_V: 21},
	{type: "48V / 48V + UPS", supplyVoltage_V: 48}
];


const Cables =
[
	{type: "2 x 1 mm2", resistivity_OhmPerMeter: 0.0181},
	{type: "2 x 1,5 mm2", resistivity_OhmPerMeter: 0.0121},
	{type: "2 x 2,5 mm2", resistivity_OhmPerMeter: 0.00741},
	{type: "2 x 4 mm2", resistivity_OhmPerMeter: 0.00461}	
];

const DeviceCl = 
{
	detector: "detector",
	signaller: "signaller",
	valveCtrl: "valveCtrl"
};

const Devices =
[
	{type: "Teta EcoWent", power_W: 0.3, current_A: 0.006, minVoltage_V: 12, icon: "EcoWent.svg", class: DeviceCl.detector}, // see adms://s:192.168.0.251/b:archidemes/i:165964
	{type: "Teta EcoDet", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "EcoDet.svg", class: DeviceCl.detector}, // see adms://s:192.168.0.251/b:archidemes/i:165964
	{type: "Teta EcoWent + MiniDet", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "EcoWent_MiniPel.svg", isBig: true, class: DeviceCl.detector}, // see adms://s:192.168.0.251/b:archidemes/i:165964
	{type: "Teta EcoTerm", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "EcoTerm.svg", class: DeviceCl.detector}, // see adms://s:192.168.0.251/b:archidemes/i:165964
	{type: "Teta EcoH", power_W: 1.8, current_A: 0.002, minVoltage_V: 12, icon: "TetaEcoH.svg", class: DeviceCl.detector}, // see adms://s:192.168.0.251/b:archidemes/i:226424
	{type: "Teta EcoN", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "TetaEcoN.svg", class: DeviceCl.detector}, // see EcoTerm
	{type: "TOLED", power_W: 2.62, current_A: -0.005, minVoltage_V: 15, icon: "TOLED.svg", class: DeviceCl.signaller}, // see adms://s:192.168.0.251/b:archidemes/i:226424	
	{type: "Teta SZOA", power_W: 2.91, current_A: -0.007, minVoltage_V: 15, icon: "SZOA.svg", class: DeviceCl.signaller},	// see adms://s:192.168.0.251/b:archidemes/i:226424
	{type: "Teta SOLERT", power_W: 2.2, current_A: 0.021, minVoltage_V: 15, icon: "SOLERT.svg", class: DeviceCl.signaller},	// see adms://s:192.168.0.251/b:archidemes/i:226424 + adms://s:192.168.0.251/b:archidemes/i:165964
	{type: "Control V", power_W: 3.47, current_A: -0.011, minVoltage_V: 15, icon: "ControlV.svg", class: DeviceCl.valveCtrl}	// see adms://s:192.168.0.251/b:archidemes/i:226424
];
