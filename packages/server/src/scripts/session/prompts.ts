import logger from "../../helpers/Logger.js";

enum FRAMEWORK {
	DND = "Dungeons and Dragons (DND)",
	SWN = "Stars Without Number (SWN)",
}

const CONTEXTS = {
	SWN_ROBIN: `Raghbal: Nicht-Spieler-Charakter. Ein Bewohner des Planeten Nael-II im System PI-3141. Er gehört zu der Spezies der Raghs, humanoide Wesen, welche eine steinerne Haut haben. Er ist ein guter Freund der Gruppe.
Noelle Maxwell: Nicht-Spieler-Charakter. Eine Bewohnerin des Planeten Nael-II im System Pi-3141. Sie ist ein Mensch, etwa 2 meter gross und sehr muskulös. Sie hat eine markannte Narbe am Auge, welche sie sich währen eines Kampfes gegen einen rassistischen Extremisten zuzog. Sie hat auch den 500 Kg Deadlift Rekord auf dem Planeten. Sie ist inhaberin ihrer eigener Bar, in welcher die Gruppe Unterschlupf fand.
Gron: Spielercharakter. Gross, stark, muskulös. Kämpft hauptsächlich mit seinen Fäusten.
Lucy: Spielercharakter. Sie ist ein Mensch und hat eine sehr hohe Intelligenz. Sie ist die Hackerin und Pilotin der Gruppe. Somit ist sie sehr gut im Umgang mit Computern und kann diese hacken. Sie hat einen Sleeve-Körper, also einen synthetischen Körper, welcher mit einem menschlichen Gehirn ausgestattet ist. Sie hat eine sehr hohe Intelligenz und ist die Hackerin der Gruppe. Sie kann Computer hacken und hat einen Sleeve-Körper, also einen synthetischen Körper, der mit einem menschlichen Gehirn ausgestattet ist. Sie hat bereits mehrmals Körper gewechselt und lebt seit über 100 Jahren. 
Alfonso de Arcturus: Spielercharakter. Ehemalig im Militär. Nicht muskulös aber gross. Gut im Umgang mit Waffen. Sehr charismatisch. 
Koga Tamari: Nicht-Spieler-Charakter, aber Teil der Gruppe. Ehemaliger Militär-Soldat, welcher sich der Truppe anschloss. Asiatisches Aussehen, hat eine High-tech Samurai Rüstung sowie ein High-frequency Blade. Er suchte seinen Bruder Mirio, welcher er mit Truppe nur noch tot auffand.
Bordcomputer: Nicht-Spieler-Charakter. War ehemalig im Schiff inkludiert welches sie auf Nael-II gefunden haben, wusste schnell was Sache war, fand es aber recht cool, weshalb er mitspielte. Er war über die Zeit ein gutes Verlässliches Teammitglied geworden, doch er opferte seinen Speicher, damit er Platz für Lucy machen konnte, als deren Sleave zerstört wurde
Jack Hanma: Nicht-Spieler-Charakter. CEO von ThetaTech, Ziel des Angriffs auf den ThetaTech-Tower, traf die Gruppe in der Wüste, gab ihnen einen Auftrag, den Sohn des verstorbenen Arasaka-CEOs zu töten. 
Saburo Arasaka: Nicht-Spieler-Charakter. Ziel des Angriffs auf das Arasaka-Gebäude. Er wurde von der Gruppe hingerichtet während des Aufstandes auf Ibiki-II
Jaya Hayden: Nicht-Spieler-Charakter. Name auf einem Schließfach in einer geheimen Einrichtung im inneren von Hapras im System Boltz-1380, enthielt einen gelben Würfel. Dieser verleihte Alfonso permanente psyonische Fähigkeiten!
Adam Smasher: Nicht-Spieler-Charakter. Sehr eindrücklich und komplett verchromt, war beim Treffen in der Wüste anwesend.
Kiryu Arasaka: Nicht-Spieler-Charakter. 14-jähriger Sohn des ehemaligen Arasaka-Chefs, Ziel des Auftrags von Jack Hanma`,
	DND_SHIVA: "",
	DND_NICOLAS_D: "",
};

const BASE_PROMPT_TEMPLATE = `## Ziel
Bitte erstelle aus dem folgenden Transkript unserer <%FRAMEWORK%> Runde die folgenden Elemente:
1.  Einen passenden Titel für die Runde.
1.  Eine detaillierte Zusammenfassung: Ein ausführlicher Fliesstext, der die Ereignisse der Runde nacherzählt.
2.  Eine kurze Zusammenfassung: Eine prägnante Übersicht über die wichtigsten Geschehnisse und Ergebnisse der Runde.
3.  Eine Liste der Ziele der Gruppe: Eine Auflistung der aktuellen Ziele oder Aufgaben, welche die Gruppe verfolgt.
Nutze für beide Zusammenfassungen die bereitgestellten Kontextinformationen zu Spielercharakteren (PCs), wichtigen Nicht-Spieler-Charakteren (NPCs) und Orten (Planeten, Städte usw.) zusammen mit dem Transkript. Gestalte die Zusammenfassungen spannend, aber stelle sicher, dass sie inhaltlich korrekt sind.

## Format
Für den Titel:
*   Erfinde einen kurzen, prägnanten und thematisch passenden Titel.

Für die detaillierte Zusammenfassung:
*   Schreibe einen zusammenhängenden Fliesstext mit sinnvollen Absätzen.
*   Benutze keine Stichpunkte oder expliziten Überschriften innerhalb des Textes.

Für die kurze Zusammenfassung:
*   Fasse die Kernaussagen und wichtigsten Ereignisse prägnant zusammen.
*   Schreibe ebenfalls einen Fliesstext (kann auch nur ein oder zwei Absätze lang sein).

Für die Ziele der Gruppe:
*   Nutze Stichpunkte für die einzelnen Ziele.
*   Leite diese Ziele aus dem Transkript und den Kontextinformationen ab.

## Warnung
Das Transkript ist auf Hochdeutsch, wurde aber ursprünglich von einer schweizerdeutschen Audiodatei transkribiert. Erwarte daher mögliche Ungenauigkeiten oder Fehler im Transkript. Benutze die Kontextinformationen, um diese Fehler zu korrigieren.

## Kontext
<%CONTEXT%>

## Transkript
<%TRANSCRIPT%>`;

export function buildPenAndPaperPrompt(
	framework: string,
	context: string,
	transcript: string,
) {
	return BASE_PROMPT_TEMPLATE.replace(/<%FRAMEWORK%>/g, framework.trim())
		.replace(/<%TRANSCRIPT%>/g, transcript.trim())
		.replace(/<%CONTEXT%>/g, context.trim())
		.trim();
}

//console.log(buildPenAndPaperPrompt(FRAMEWORK.SWN, CONTEXTS.SWN_ROBIN, "hier"));
