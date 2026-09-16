/* =========================================
   ምስጢር — የኢትዮጵያ ዲቴክቲቭ
   GAME ENGINE
========================================= */

let game = {
    evidence: [],
    questioned: [],
    notes: "",
    currentLocation: null,
    started: false
};

/* =========================================
   SAVE / LOAD
========================================= */

function saveGame() {
    localStorage.setItem("misterDetectiveGame", JSON.stringify(game));
}

function loadGame() {
    const saved = localStorage.getItem("misterDetectiveGame");

    if (saved) {
        try {
            game = JSON.parse(saved);
        } catch (error) {
            console.log("የተቀመጠ ጨዋታ ሊነበብ አልቻለም።");
        }
    }
}

loadGame();


/* =========================================
   SCREEN SYSTEM
========================================= */

function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.style.display = "none";
    });

    const selected = document.getElementById(screenId);

    if (selected) {
        selected.style.display = "block";
        window.scrollTo(0, 0);
    }

    updateGameUI();
}


/* =========================================
   START CASE
========================================= */

function openCase() {
    showScreen("cases");
}

function startCase() {

    game = {
        evidence: [],
        questioned: [],
        notes: "",
        currentLocation: null,
        started: true
    };

    saveGame();

    showScreen("caseIntro");
}

function startInvestigation() {

    game.started = true;

    saveGame();

    showScreen("investigation");

    showToast("ምርመራው ተጀምሯል።");
}


/* =========================================
   BACK BUTTON
========================================= */

function goBack() {
    showScreen("investigation");
}


/* =========================================
   INVESTIGATION LOCATIONS
========================================= */

const locations = {

    bedroom: {

        name: "🛏️ መኝታ ክፍል",

        clues: [
            {
                id: "blood",
                icon: "🩸",
                title: "የደም ነጠብጣብ",
                description:
                    "ከአልጋው አጠገብ ትንሽ የደም ነጠብጣብ ተገኝቷል። የደሙ ምንጭ እስካሁን አልታወቀም።"
            },

            {
                id: "drawer",
                icon: "🗄️",
                title: "ባዶ መሳቢያ",
                description:
                    "በሚካኤል ጠረጴዛ ላይ ያለው አንድ መሳቢያ ተከፍቶ ነበር። ከውስጡ አንድ ነገር የተወሰደ ይመስላል።"
            }
        ]
    },

    livingroom: {

        name: "🛋️ ሳሎን",

        clues: [
            {
                id: "brokenphone",
                icon: "📱",
                title: "የተሰበረ ስልክ",
                description:
                    "በሶፋው ስር የሚካኤል ስልክ ተገኝቷል። ስክሪኑ ተሰብሯል።"
            },

            {
                id: "glass",
                icon: "🥃",
                title: "የተሰበረ ብርጭቆ",
                description:
                    "በጠረጴዛው ላይ የተሰበረ ብርጭቆ አለ። አንድ ሰው በችኮላ እንደተንቀሳቀሰ ይጠቁማል።"
            }
        ]
    },

    entrance: {

        name: "🚪 መግቢያ",

        clues: [
            {
                id: "door",
                icon: "🚪",
                title: "የበሩ ሁኔታ",
                description:
                    "በሩ በግድ የተከፈተ ምልክት የለበትም። የመቆለፊያው ሁኔታ ግን ጥያቄ ያስነሳል።"
            },

            {
                id: "key",
                icon: "🔑",
                title: "ቁልፍ",
                description:
                    "የቤቱ ቁልፍ በተለመደው ቦታ ላይ የለም።"
            }
        ]
    },

    outside: {

        name: "🌃 ከህንፃው ውጭ",

        clues: [
            {
                id: "footprints",
                icon: "👣",
                title: "የእግር አሻራ",
                description:
                    "በህንፃው መግቢያ አጠገብ የእግር አሻራዎች ታይተዋል። አንድ ሰው በፍጥነት እንደወጣ ሊያመለክት ይችላል።"
            },

            {
                id: "camera",
                icon: "📹",
                title: "የደህንነት ካሜራ",
                description:
                    "በህንፃው መግቢያ ላይ የደህንነት ካሜራ አለ። ቀረጻው ግን እስካሁን አልተመረመረም።"
            }
        ]
    }
};


/* =========================================
   SEARCH LOCATION
========================================= */

function searchLocation(locationId) {

    const location = locations[locationId];

    if (!location) {
        showToast("ይህ ቦታ አልተገኘም።");
        return;
    }

    game.currentLocation = locationId;

    let html = `
        <div class="card">
            <h2>${location.name}</h2>
            <p>በዚህ ቦታ የሚታዩ ነገሮችን በጥንቃቄ ይመልከቱ።</p>
        </div>
    `;

    location.clues.forEach(clue => {

        const found = game.evidence.includes(clue.id);

        html += `
            <div class="evidence-card">

                <div class="evidence-icon">
                    ${clue.icon}
                </div>

                <h3>${clue.title}</h3>

                <p>${clue.description}</p>

                <br>

                ${
                    found
                    ?
                    `<button class="secondary-btn" disabled>
                        ✓ ተመዝግቧል
                    </button>`
                    :
                    `<button class="primary-btn"
                        onclick="collectEvidence('${clue.id}', '${locationId}')">
                        🔎 ማስረጃውን መመዝገብ
                    </button>`
                }

            </div>
        `;
    });

    const container = document.getElementById("investigation");

    if (container) {

        const oldContent = container.innerHTML;

        container.innerHTML = `
            <div class="container">

                <div class="page-header">
                    <button class="back-btn"
                        onclick="showScreen('investigation')">
                        ←
                    </button>

                    <h1 class="page-title">
                        ${location.name}
                    </h1>
                </div>

                ${html}

            </div>
        `;

        container.style.display = "block";
    }

    updateGameUI();
}


/* =========================================
   COLLECT EVIDENCE
========================================= */

function collectEvidence(evidenceId, locationId) {

    if (game.evidence.includes(evidenceId)) {
        showToast("ይህን ማስረጃ አስቀድመው መዝግበዋል።");
        return;
    }

    const location = locations[locationId];

    let clue = null;

    if (location) {
        clue = location.clues.find(item => item.id === evidenceId);
    }

    if (!clue) return;

    game.evidence.push(evidenceId);

    saveGame();

    showToast(`✓ ${clue.title} ተመዝግቧል`);

    searchLocation(locationId);
}


/* =========================================
   EVIDENCE SCREEN
========================================= */

function showEvidence() {

    let html = "";

    let allClues = [];

    Object.values(locations).forEach(location => {

        location.clues.forEach(clue => {

            if (game.evidence.includes(clue.id)) {
                allClues.push(clue);
            }

        });

    });


    if (allClues.length === 0) {

        html = `
            <div class="card">
                <h3>📂 ምንም ማስረጃ የለም</h3>
                <p>
                    ወደ የጉዳዩ ቦታዎች ይሂዱና
                    ማስረጃዎችን ይፈልጉ።
                </p>
            </div>
        `;

    } else {

        allClues.forEach(clue => {

            html += `
                <div class="evidence-card">

                    <div class="evidence-icon">
                        ${clue.icon}
                    </div>

                    <h3>${clue.title}</h3>

                    <p>${clue.description}</p>

                </div>
            `;

        });

    }


    const screen = document.getElementById("evidence");

    if (screen) {

        screen.innerHTML = `
            <div class="container">

                <div class="page-header">
                    <button class="back-btn"
                        onclick="showScreen('home')">
                        ←
                    </button>

                    <h1 class="page-title">
                        📂 ማስረጃዎች
                    </h1>
                </div>

                ${html}

            </div>
        `;

        screen.style.display = "block";
    }
}


/* =========================================
   SUSPECT DATA
========================================= */

const suspects = {

    dawit: {

        name: "ዳዊት",

        role: "የሚካኤል የቅርብ ጓደኛ",

        statements: [
            "እኔ ከሚካኤል ጋር ከሳምንት በላይ አልተገናኘሁም።",
            "በዚያ ምሽት ቤት ነበርኩ።",
            "እኛ በቅርቡ ትንሽ ተጣልተን ነበር።"
        ]
    },

    sara: {

        name: "ሳራ",

        role: "ጎረቤት",

        statements: [
            "በዚያ ሌሊት ከቤቱ ውስጥ ጩኸት ሰማሁ።",
            "በግምት 11:30 ላይ ነበር።",
            "ከዚያ በኋላ አንድ ሰው ከህንፃው ሲወጣ አየሁ።"
        ]
    },

    natnael: {

        name: "ናትናኤል",

        role: "የሚካኤል የስራ ባልደረባ",

        statements: [
            "ሚካኤል በራሱ ፈቃድ ሄዶ ይሆናል።",
            "በስራ ቦታ ላይ ችግር ነበረው።",
            "በዚያ ምሽት ከሚካኤል ጋር አልተገናኘሁም።"
        ]
    }
};


/* =========================================
   INTERROGATION
========================================= */

function interrogate(suspectId) {

    const suspect = suspects[suspectId];

    if (!suspect) return;

    if (!game.questioned.includes(suspectId)) {
        game.questioned.push(suspectId);
        saveGame();
    }

    let statements = "";

    suspect.statements.forEach((statement, index) => {

        statements += `
            <div class="card">
                <p>
                    <strong>${index + 1}.</strong>
                    “${statement}”
                </p>
            </div>
        `;

    });


    const screen = document.getElementById("suspects");

    if (screen) {

        screen.innerHTML = `

            <div class="container">

                <div class="page-header">

                    <button class="back-btn"
                        onclick="showScreen('suspects')">
                        ←
                    </button>

                    <h1 class="page-title">
                        🗣️ ${suspect.name}
                    </h1>

                </div>

                <div class="dialogue-box">

                    <div class="dialogue-name">
                        ${suspect.name}
                    </div>

                    <p class="dialogue-text">
                        ${suspect.role}
                    </p>

                </div>

                <h2 class="section-title">
                    የተናገረው
                </h2>

                ${statements}

                <button class="secondary-btn"
                    onclick="showScreen('suspects')">
                    ← ወደ ተጠርጣሪዎች
                </button>

            </div>
        `;

        screen.style.display = "block";
    }
}


/* =========================================
   SUSPECT SCREEN
========================================= */

function showSuspects() {

    let html = "";

    Object.keys(suspects).forEach(id => {

        const suspect = suspects[id];

        const questioned =
            game.questioned.includes(id);

        html += `
            <div class="suspect-card">

                <div class="suspect-avatar">
                    🧑
                </div>

                <div class="suspect-name">
                    ${suspect.name}
                </div>

                <div class="suspect-role">
                    ${suspect.role}
                </div>

                <button class="interrogate-btn"
                    onclick="interrogate('${id}')">

                    ${
                        questioned
                        ? "✓ እንደገና መጠየቅ"
                        : "🗣️ መጠየቅ"
                    }

                </button>

            </div>
        `;

    });


    const screen = document.getElementById("suspects");

    if (screen) {

        screen.innerHTML = `

            <div class="container">

                <div class="page-header">

                    <button class="back-btn"
                        onclick="showScreen('investigation')">
                        ←
                    </button>

                    <h1 class="page-title">
                        🧑 ተጠርጣሪዎች
                    </h1>

                </div>

                <div class="suspect-grid">
                    ${html}
                </div>

            </div>
        `;

        screen.style.display = "block";
    }
}


/* =========================================
   NOTES
========================================= */

function showNotes() {

    const screen = document.getElementById("notes");

    if (!screen) return;

    screen.innerHTML = `

        <div class="container">

            <div class="page-header">

                <button class="back-btn"
                    onclick="showScreen('home')">
                    ←
                </button>

                <h1 class="page-title">
                    📓 ማስታወሻ
                </h1>

            </div>

            <div class="card">

                <p>
                    ያገኙትን ጥርጣሬ፣
                    ማስረጃ እና የተጠርጣሪዎችን
                    ንግግር እዚህ ይጻፉ።
                </p>

            </div>

            <textarea
                id="notesText"
                class="notes-area"
                placeholder="ማስታወሻዎን እዚህ ይጻፉ..."
            >${escapeHTML(game.notes)}</textarea>

            <br><br>

            <button class="primary-btn"
                onclick="saveNotes()">
                💾 ማስቀመጥ
            </button>

        </div>
    `;

    screen.style.display = "block";
}


function saveNotes() {

    const textarea = document.getElementById("notesText");

    if (!textarea) return;

    game.notes = textarea.value;

    saveGame();

    showToast("✓ ማስታወሻው ተቀምጧል።");
}


/* =========================================
   DECISION
========================================= */

function makeDecision(choice) {

    let title = "";
    let message = "";

    if (choice === "dawit") {

        title = "ዳዊትን ጠርጥረዋል";
        message =
            "ዳዊት ከሚካኤል ጋር ግጭት እንደነበረው አውቀዋል። " +
            "ግን ይህ ብቻ ወንጀለኛ መሆኑን ለማረጋገጥ አይበቃም።";
    }

    else if (choice === "sara") {

        title = "ሳራን ጠርጥረዋል";
        message =
            "ሳራ ከቤቱ ውስጥ ጩኸት እንደሰማች ተናግራለች። " +
            "ነገር ግን የእሷ ቃል ብቻ በቂ ማስረጃ አይደለም።";
    }

    else if (choice === "natnael") {

        title = "ናትናኤልን ጠርጥረዋል";
        message =
            "ናትናኤል ሚካኤል በራሱ ፈቃድ ሄዶ ሊሆን እንደሚችል ተናግሯል። " +
            "ይህ ግን ከተገኙት ማስረጃዎች ጋር መነጻጸር አለበት።";
    }

    else {

        title = "አሁን ለመወሰን ገና ነው";
        message =
            "ማስረጃዎችን በሙሉ ሳይመረምሩ ውሳኔ መስጠት አደገኛ ነው።";
    }


    const screen = document.getElementById("decision");

    if (screen) {

        screen.innerHTML = `

            <div class="container">

                <div class="page-header">

                    <button class="back-btn"
                        onclick="showScreen('investigation')">
                        ←
                    </button>

                    <h1 class="page-title">
                        ⚖️ ውሳኔ
                    </h1>

                </div>

                <div class="result-card card">

                    <div class="result-icon">
                        🕵️
                    </div>

                    <h1>${title}</h1>

                    <p>
                        ${message}
                    </p>

                </div>

                <button class="primary-btn"
                    onclick="showScreen('investigation')">
                    🔎 ምርመራውን ቀጥል
                </button>

            </div>
        `;

        screen.style.display = "block";
    }
}


/* =========================================
   PROGRESS
========================================= */

function updateGameUI() {

    const totalEvidence = 8;

    const found = game.evidence.length;

    const percent =
        Math.min(100, Math.round((found / totalEvidence) * 100));


    const progress =
        document.querySelector(".progress-fill");

    if (progress) {
        progress.style.width = percent + "%";
    }


    const progressText =
        document.querySelector(".progress-text");

    if (progressText) {

        progressText.textContent =
            `የተገኙ ማስረጃዎች: ${found}/${totalEvidence}`;
    }
}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* =========================================
   SAFE HTML
========================================= */

function escapeHTML(text) {

    if (!text) return "";

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   KEYBOARD / STARTUP
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadGame();

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.style.display = "none";
    });

    const home =
        document.getElementById("home");

    if (home) {
        home.style.display = "flex";
    }

    updateGameUI();
});
