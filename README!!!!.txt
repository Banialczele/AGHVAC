Struktura plików: 
 -systemPowerAnalysis ( projekt ):
	-css - style
	-GFX - grafiki + mockup
	-js - skrypty JSa do obsługi całej strony
	-index.html 
	-analysisEngine,models.

Wszelkie dane, na których będą wykonywane operacje sprawdzania, czy system jest ok znajduje się w obiekcie completeData (index.js linia 11).
Przy wykonywaniu testów jakiekolwiek operacje należy wywoływać w funkcji handleDOMChange.
