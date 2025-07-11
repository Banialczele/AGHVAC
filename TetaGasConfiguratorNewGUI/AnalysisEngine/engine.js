function calculateRealisticSystemStatus(supplyType, cable, busSegments) {
  const resistivity = cable.resistivity_OhmPerMeter;
  // Zaczynamy od minimalnego napięcia wymaganego przez ostatnie urządzenie
  let voltageAtNode = busSegments[busSegments.length - 1].detector.minVoltage_V;
  let currentAtNode = 0;

  // Przechodzimy OD KOŃCA do POCZĄTKU busa!
  const segmentData = [];

  for (let i = busSegments.length - 1; i >= 0; i--) {
    const segment = busSegments[i];
    const device = segment.detector;

    // Prąd potrzebny przez to urządzenie:
    // UWAGA: urządzenie o stałej mocy = prąd = P/U (przyjmujemy, że przy niższym napięciu pobierze więcej prądu)
    let deviceCurrent = 0;
    if (device.current_A != null && device.power_W != null) {
      deviceCurrent = device.current_A + (device.power_W / voltageAtNode);
    } else if (device.current_A != null) {
      deviceCurrent = device.current_A;
    } else if (device.power_W != null) {
      deviceCurrent = device.power_W / voltageAtNode;
    } 

    // Suma prądów na tym odcinku = prąd urządzenia + prąd downstream (czyli z poprzedniego "końca")
    let totalCurrent = currentAtNode + deviceCurrent;

    // Spadek napięcia na tym odcinku
    const resistance = resistivity * segment.wireLength;
    const voltageDrop = 2 * resistance * totalCurrent;

    // Napięcie wymagane na wejściu tego segmentu = napięcie na wyjściu + spadek na kablu
    const inputVoltage = voltageAtNode + voltageDrop;

    segmentData.unshift({
      segmentIndex: i,
      cableType: cable.type,
      length: segment.wireLength,
      current: totalCurrent,
      resistance,
      voltageDrop,
      voltageAtNode,
      deviceCurrent,
      inputVoltage,
    });

    // Przechodzimy do poprzedniego segmentu z wymaganym napięciem i prądem
    voltageAtNode = inputVoltage;
    currentAtNode = totalCurrent;
  }

  // Po pętli:
  const requiredSupplyVoltage = voltageAtNode;
  const requiredSupplyCurrent = currentAtNode;
  const requiredSupplyPower = requiredSupplyVoltage * requiredSupplyCurrent;

  // Warunki:
  const maxVoltage = Number(supplyType.outputVoltage);
  const maxCurrent = Number(supplyType.outputCurrent);
  const maxPower = maxVoltage * maxCurrent;

  // Sprawdź czy zasilacz daje radę
  if (
    requiredSupplyVoltage > maxVoltage ||
    requiredSupplyCurrent > maxCurrent ||
    requiredSupplyPower > maxPower
  ) {
    return { valid: false, segmentData, requiredSupplyVoltage, requiredSupplyCurrent, requiredSupplyPower };
  }

  // Sprawdź na każdym segmencie czy napięcie przy urządzeniu >= jego minVoltage
  for (const s of segmentData) {
    if (s.voltageAtNode < busSegments[s.segmentIndex].detector.minVoltage_V) {
      return { valid: false, segmentData, requiredSupplyVoltage, requiredSupplyCurrent, requiredSupplyPower };
    }
  }
  return { valid: true, segmentData, requiredSupplyVoltage, requiredSupplyCurrent, requiredSupplyPower };
}

function calculateAllSystemVariants() {
  const bus = systemData.bus;
  const cables = Cables;
  const supplyTypes = CONTROLUNITLIST;

  const selectedSupply = systemData.supplyType;
  const allResults = [];

  function getAvailableVoltages(supply) {
    const voltages = [];
    if (supply.description?.voltageOut_V) voltages.push(supply.description.voltageOut_V);
    if (supply.description?.voltageOut_V48) voltages.push(supply.description.voltageOut_V48);
    return voltages;
  }

  function evaluateSupplyWithVoltage(baseSupply, voltage, isUserSelected = false) {
    const supply = {
      ...baseSupply,
      outputVoltage: voltage,
      outputCurrent:
        voltage === 48
          ? baseSupply.description.maxCurrent_V48
          : baseSupply.description.maxCurrent,
    };

    const validCables = [];

    for (const cable of cables) {
      const result = calculateRealisticSystemStatus(
        supply,
        cable,
        bus
      );
      if (result.valid) {
        validCables.push({
          cableType: cable,
          totalPower: Math.ceil(result.requiredSupplyPower),
          totalCurrent: Math.ceil(result.requiredSupplyCurrent),
          totalVoltage: Math.ceil(result.requiredSupplyVoltage),
        });
      }
    }

    if (validCables.length === 0) return null;

    return {
      supplyType: supply,
      isUserSelected,
      validCables,
    };
  }

  // 1. Konfiguracja wybrana przez użytkownika
  const userVoltages = getAvailableVoltages(selectedSupply);
  for (const voltage of userVoltages) {
    const result = evaluateSupplyWithVoltage(selectedSupply, voltage, true);
    if (result) allResults.push(result);
  }

  // 2. Pozostałe zasilacze
  for (const supply of supplyTypes) {
    if (supply.productKey === selectedSupply.productKey) continue;

    const voltages = getAvailableVoltages(supply);
    for (const voltage of voltages) {
      const result = evaluateSupplyWithVoltage(supply, voltage, false);
      if (result) allResults.push(result);
    }
  }

  return allResults;
}