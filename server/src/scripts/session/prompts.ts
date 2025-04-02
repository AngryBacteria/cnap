enum FRAMEWORK {
	DND = "Dungeons and Dragons (DND)",
	SWN = "Stars Without Number (SWN)",
}

const CONTEXTS = {
	SWN_ROBIN: "",
	DND_SHIVA: "",
	DND_NICOLAS_D: "",
};

const BASE_PROMPT_TEMPLATE = `## Ziel
Bitte erstelle aus dem folgenden Transkript unserer <%FRAMEWORK%> Runde zwei separate Zusammenfassungen:
1.  Eine detaillierte Zusammenfassung: Ein ausführlicher Fliesstext, der die Ereignisse der Runde nacherzählt.
2.  Eine kurze Zusammenfassung: Eine prägnante Übersicht über die wichtigsten Geschehnisse und Ergebnisse der Runde.
Nutze für beide Zusammenfassungen die bereitgestellten Kontextinformationen zu Spielercharakteren (PCs), wichtigen Nicht-Spieler-Charakteren (NPCs) und Orten (Planeten, Städte usw.) zusammen mit dem Transkript. Gestalte die Zusammenfassungen spannend, aber stelle sicher, dass sie inhaltlich korrekt sind.

## Format
Für die detaillierte Zusammenfassung:
*   Schreibe einen zusammenhängenden Fliesstext mit sinnvollen Absätzen.
*   Benutze keine Stichpunkte oder expliziten Überschriften innerhalb des Textes.

Für die kurze Zusammenfassung:
*   Fasse die Kernaussagen und wichtigsten Ereignisse prägnant zusammen.
*   Schreibe ebenfalls einen Fliesstext (kann auch nur ein oder zwei Absätze lang sein).

## Warnung
Das Transkript ist auf Hochdeutsch, wurde aber ursprünglich von einer schweizerdeutschen Audiodatei transkribiert. Erwarte daher mögliche Ungenauigkeiten oder Fehler im Transkript. Benutze die Kontextinformationen, um diese Fehler zu korrigieren.

## Kontext
<%CONTEXT%>

## Transkript
<%TRANSCRIPT%>`;
