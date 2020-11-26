sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (
    JSONModel
) {
    "use strict";

    function generateBenutzer() {
        const name = randomEntry(nachnamen);
        const vornamenList = randomEntry([vornamenM, vornamenW]);
        const vorname = randomEntry(vornamenList);
        const dob = randomTimestamp(new Date("1940-01-01"), new Date("2002-01-01"));

        return {
            "vorname": vorname,
            "nachname": name,
            "login": `${vorname.toLowerCase()}.${name.toLowerCase()}`,
            "email": `${vorname}.${name}@e-corp.com`,
            "geburtsdatum": dob
        };
    }

    function randomEntry(elements) {
        const index = Math.floor(Math.random() * elements.length);
        return elements[index];
    }

    function randomTimestamp(startDate, endDate) {
        return Math.floor((Math.random() * (endDate.getTime() - startDate.getTime()))) + startDate.getTime();
    }

    // Quelle: http://wiki-de.genealogy.net/Die_1000_häufigsten_Familiennamen_in_Deutschland
    const nachnamen = [
        "Müller",
        "Schmidt",
        "Schneider",
        "Fischer",
        "Weber",
        "Meyer",
        "Wagner",
        "Schulz",
        "Becker",
        "Hoffmann",
        "Schäfer",
        "Koch",
        "Richter",
        "Bauer",
        "Klein",
        "Wolf",
        "Schröder",
        "Neumann",
        "Schwarz",
        "Zimmermann",
        "Braun",
        "Hofmann",
        "Krüger",
        "Hartmann",
        "Lange",
        "Schmitt",
        "Werner",
        "Schmitz",
        "Krause",
        "Meier",
        "Lehmann",
        "Schmid",
        "Schulze",
        "Maier",
        "Köhler",
        "Herrmann",
        "Walter",
        "König",
        "Mayer",
        "Huber",
        "Kaiser"
    ];
    // Quelle: https://www.beliebte-vornamen.de/jahrgang/j2013/top500-2013
    const vornamenW = [
        "Mia",
        "Emma",
        "Hannah",
        "Sofia",
        "Anna",
        "Lea",
        "Emilia",
        "Marie",
        "Lena",
        "Leonie",
        "Emily",
        "Lina",
        "Amelie",
        "Sophie",
        "Lilly",
        "Luisa",
        "Johanna",
        "Laura",
        "Nele",
        "Lara"
    ];
    const vornamenM = [
        "Ben",
        "Luca",
        "Paul",
        "Jonas",
        "Finn",
        "Leon",
        "Luis",
        "Lukas",
        "Maximilian",
        "Felix",
        "Noah",
        "Elias",
        "Julian",
        "Max",
        "Tim",
        "Moritz",
        "Henry",
        "Niklas",
        "Philipp",
        "Jakob"
    ];

    return {
        generateBenutzer: generateBenutzer,

        loadData: () => {
            let array = [];
            for (let i = 0; i < 10; i++) {
                array.push(generateBenutzer());
            }
            const result = {
                data: array
            }
            return Promise.resolve(result);
        }
    }
});
