// Solution tout-en-un pour BD Creator
// Ce fichier contient toutes les fonctionnalités nécessaires sans dépendances externes

// Variables globales pour stocker les données du projet
let projectData = {
    keywords: "",
    scenario: null,
    storyboard: null,
    prompts: null
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si nous sommes sur la page d'accueil
    const keywordsInput = document.getElementById('keywords');
    if (keywordsInput) {
        // Ajouter un écouteur d'événements pour le bouton de génération de scénario
        const generateButton = document.getElementById('generate-scenario-btn');
        if (generateButton) {
            generateButton.addEventListener('click', function() {
                const keywords = keywordsInput.value;
                if (keywords.trim() === '') {
                    alert('Veuillez entrer des mots-clés pour votre BD.');
                    return;
                }
                
                // Stocker les mots-clés dans localStorage pour les utiliser dans d'autres pages
                localStorage.setItem('bdKeywords', keywords);
                
                // Rediriger vers la page scénario
                window.location.href = 'scenario.html';
            });
        }
    }
    
    // Vérifier si nous sommes sur la page de scénario
    const scenarioContainer = document.getElementById('scenario-container');
    if (scenarioContainer) {
        const keywords = localStorage.getItem('bdKeywords') || "aventure fantastique";
        const keywordsDisplay = document.getElementById('keywords-display');
        if (keywordsDisplay) {
            keywordsDisplay.textContent = keywords;
        }
        
        // Vérifier si nous venons d'une nouvelle session ou d'un rechargement normal
        const urlParams = new URLSearchParams(window.location.search);
        const isNewSession = urlParams.has('new');
        
        // Vérifier si un scénario existe déjà dans le localStorage
        const existingScenario = localStorage.getItem('bdScenario');
        
        // Forcer la régénération du scénario si c'est une nouvelle session ou si aucun scénario n'existe
        if (isNewSession || !existingScenario) {
            console.log("Génération d'un nouveau scénario (nouvelle session ou premier chargement)");
            
            // Générer et afficher le scénario avec la nouvelle fonction détaillée
            generateScenario(keywords).then(scenario => {
                projectData.scenario = scenario;
                localStorage.setItem('bdScenario', JSON.stringify(scenario));
                
                // Afficher le scénario
                displayScenario(scenario);
            });
        } else {
            // Utiliser le scénario existant
            console.log("Utilisation du scénario existant");
            const scenario = JSON.parse(existingScenario);
            projectData.scenario = scenario;
            
            // Afficher le scénario
            displayScenario(scenario);
        }
    }
    
    // Vérifier si nous sommes sur la page de storyboard
    const storyboardContainer = document.getElementById('storyboard-container');
    if (storyboardContainer) {
        const scenario = JSON.parse(localStorage.getItem('bdScenario'));
        const chapterIndex = parseInt(localStorage.getItem('bdCreatorChapterIndex') || "0");
        
        if (scenario) {
            const chapterTitle = document.getElementById('chapter-title');
            if (chapterTitle) {
                chapterTitle.textContent = scenario.chapters[chapterIndex].title;
            }
            
            // Créer et afficher le storyboard avec la nouvelle fonction détaillée
            createStoryboard(scenario, chapterIndex).then(storyboard => {
                projectData.storyboard = storyboard;
                localStorage.setItem('bdCreatorStoryboard', JSON.stringify(storyboard));
                
                // Afficher le storyboard
                displayStoryboard(storyboard);
            });
        }
    }
    
    // Vérifier si nous sommes sur la page de prompts
    const promptsContainer = document.getElementById('prompts-container');
    if (promptsContainer) {
        const storyboard = JSON.parse(localStorage.getItem('bdCreatorStoryboard'));
        
        if (storyboard) {
            const chapterTitle = document.getElementById('chapter-title');
            const chapterName = document.getElementById('chapter-name');
            
            if (chapterTitle && !chapterName) {
                chapterTitle.textContent = `Prompts Midjourney pour le chapitre : ${storyboard.chapterTitle}`;
            } else if (chapterName) {
                chapterName.textContent = storyboard.chapterTitle;
            }
            
            // Générer et afficher les prompts avec la nouvelle fonction détaillée
            generatePrompts(storyboard).then(prompts => {
                projectData.prompts = prompts;
                
                // Afficher les prompts
                displayPrompts(prompts);
            });
        }
    }
});

// Fonction pour afficher le scénario
function displayScenario(scenario) {
    const container = document.getElementById('scenario-container');
    container.innerHTML = '';
    
    const title = document.createElement('h2');
    title.textContent = scenario.title;
    container.appendChild(title);
    
    // Afficher les informations sur l'univers si disponibles
    if (scenario.univers) {
        const universDiv = document.createElement('div');
        universDiv.className = 'univers-info';
        
        const universTitle = document.createElement('h3');
        universTitle.textContent = 'Univers';
        
        const universDesc = document.createElement('p');
        universDesc.textContent = scenario.univers.description;
        
        universDiv.appendChild(universTitle);
        universDiv.appendChild(universDesc);
        container.appendChild(universDiv);
    }
    
    // Afficher les informations sur les personnages si disponibles
    if (scenario.personnages && scenario.personnages.length > 0) {
        const personnagesDiv = document.createElement('div');
        personnagesDiv.className = 'personnages-info';
        
        const personnagesTitle = document.createElement('h3');
        personnagesTitle.textContent = 'Personnages principaux';
        personnagesDiv.appendChild(personnagesTitle);
        
        scenario.personnages.forEach(personnage => {
            const personnageDiv = document.createElement('div');
            personnageDiv.className = 'personnage';
            
            const personnageName = document.createElement('h4');
            personnageName.textContent = personnage.nom;
            
            const personnageDesc = document.createElement('p');
            personnageDesc.textContent = personnage.description;
            
            personnageDiv.appendChild(personnageName);
            personnageDiv.appendChild(personnageDesc);
            personnagesDiv.appendChild(personnageDiv);
        });
        
        container.appendChild(personnagesDiv);
    }
    
    // Afficher les chapitres
    scenario.chapters.forEach((chapter, index) => {
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter';
        
        const chapterTitle = document.createElement('h3');
        chapterTitle.textContent = `Chapitre ${index + 1}: ${chapter.title}`;
        
        const chapterSummary = document.createElement('p');
        chapterSummary.textContent = chapter.summary;
        
        const chapterPages = document.createElement('p');
        chapterPages.textContent = `Nombre de pages: ${chapter.pages}`;
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Créer le storyboard';
        editButton.className = 'button';
        editButton.addEventListener('click', function() {
            localStorage.setItem('bdCreatorChapterIndex', index.toString());
            window.location.href = 'storyboard.html';
        });
        
        chapterDiv.appendChild(chapterTitle);
        chapterDiv.appendChild(chapterSummary);
        chapterDiv.appendChild(chapterPages);
        chapterDiv.appendChild(editButton);
        
        container.appendChild(chapterDiv);
    });
}

// Fonction pour afficher le storyboard
function displayStoryboard(storyboard) {
    const container = document.getElementById('storyboard-container');
    container.innerHTML = '';
    
    // Afficher le résumé du chapitre si disponible
    if (storyboard.chapterSummary) {
        const chapterSummary = document.createElement('div');
        chapterSummary.className = 'chapter-summary';
        
        const summaryTitle = document.createElement('h3');
        summaryTitle.textContent = 'Résumé du chapitre';
        
        const summaryText = document.createElement('p');
        summaryText.textContent = storyboard.chapterSummary;
        
        chapterSummary.appendChild(summaryTitle);
        chapterSummary.appendChild(summaryText);
        container.appendChild(chapterSummary);
    }
    
    // Afficher les personnages présents si disponibles
    if (storyboard.personnages && storyboard.personnages.length > 0) {
        const personnagesDiv = document.createElement('div');
        personnagesDiv.className = 'personnages-presents';
        
        const personnagesTitle = document.createElement('h3');
        personnagesTitle.textContent = 'Personnages présents';
        personnagesDiv.appendChild(personnagesTitle);
        
        const personnagesList = document.createElement('ul');
        storyboard.personnages.forEach(personnage => {
            const personnageItem = document.createElement('li');
            personnageItem.textContent = personnage.nom;
            personnagesList.appendChild(personnageItem);
        });
        
        personnagesDiv.appendChild(personnagesList);
        container.appendChild(personnagesDiv);
    }
    
    // Afficher les pages du storyboard
    storyboard.pages.forEach(page => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'storyboard-page';
        
        const pageTitle = document.createElement('h3');
        pageTitle.textContent = `Page ${page.pageNumber}`;
        pageDiv.appendChild(pageTitle);
        
        // Afficher les cases de la page
        page.cases.forEach((caseItem, index) => {
            const caseDiv = document.createElement('div');
            caseDiv.className = 'storyboard-case';
            
            const caseTitle = document.createElement('h4');
            caseTitle.textContent = `Case ${index + 1}`;
            
            const caseDesc = document.createElement('p');
            caseDesc.className = 'case-description';
            caseDesc.textContent = caseItem.description;
            
            caseDiv.appendChild(caseTitle);
            caseDiv.appendChild(caseDesc);
            
            // Ajouter le dialogue s'il existe
            if (caseItem.dialogue && caseItem.dialogue.trim() !== '') {
                const dialogueDiv = document.createElement('div');
                dialogueDiv.className = 'case-dialogue';
                
                const dialogueTitle = document.createElement('h5');
                dialogueTitle.textContent = 'Dialogue:';
                
                const dialogueText = document.createElement('p');
                dialogueText.textContent = caseItem.dialogue;
                
                dialogueDiv.appendChild(dialogueTitle);
                dialogueDiv.appendChild(dialogueText);
                caseDiv.appendChild(dialogueDiv);
            }
            
            // Ajouter les personnages présents s'ils existent
            if (caseItem.personnages && caseItem.personnages.length > 0) {
                const personnagesDiv = document.createElement('div');
                personnagesDiv.className = 'case-personnages';
                
                const personnagesTitle = document.createElement('h5');
                personnagesTitle.textContent = 'Personnages:';
                
                const personnagesText = document.createElement('p');
                personnagesText.textContent = caseItem.personnages.join(', ');
                
                personnagesDiv.appendChild(personnagesTitle);
                personnagesDiv.appendChild(personnagesText);
                caseDiv.appendChild(personnagesDiv);
            }
            
            pageDiv.appendChild(caseDiv);
        });
        
        container.appendChild(pageDiv);
    });
}

// Fonction pour afficher les prompts
function displayPrompts(prompts) {
    const container = document.getElementById('prompts-container');
    container.innerHTML = '';
    
    prompts.forEach(prompt => {
        const promptDiv = document.createElement('div');
        promptDiv.className = 'prompt';
        
        const promptTitle = document.createElement('h3');
        promptTitle.textContent = prompt.case;
        
        const promptDesc = document.createElement('div');
        promptDesc.className = 'prompt-description';
        
        const descTitle = document.createElement('h4');
        descTitle.textContent = 'Description visuelle:';
        
        const descText = document.createElement('p');
        descText.textContent = prompt.description;
        
        promptDesc.appendChild(descTitle);
        promptDesc.appendChild(descText);
        
        // Ajouter le dialogue s'il existe
        if (prompt.dialogue && prompt.dialogue.trim() !== '') {
            const dialogueDiv = document.createElement('div');
            dialogueDiv.className = 'prompt-dialogue';
            
            const dialogueTitle = document.createElement('h4');
            dialogueTitle.textContent = 'Dialogue:';
            
            const dialogueText = document.createElement('p');
            dialogueText.textContent = prompt.dialogue;
            
            dialogueDiv.appendChild(dialogueTitle);
            dialogueDiv.appendChild(dialogueText);
            promptDesc.appendChild(dialogueDiv);
        }
        
        const promptText = document.createElement('div');
        promptText.className = 'prompt-text';
        
        const promptTextTitle = document.createElement('h4');
        promptTextTitle.textContent = 'Prompt Midjourney:';
        
        const promptTextArea = document.createElement('textarea');
        promptTextArea.readOnly = true;
        promptTextArea.rows = 5;
        promptTextArea.value = prompt.prompt;
        
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copier';
        copyButton.className = 'copy-button';
        copyButton.addEventListener('click', function() {
            promptTextArea.select();
            document.execCommand('copy');
            copyButton.textContent = 'Copié !';
            setTimeout(() => {
                copyButton.textContent = 'Copier';
            }, 2000);
        });
        
        promptText.appendChild(promptTextTitle);
        promptText.appendChild(promptTextArea);
        promptText.appendChild(copyButton);
        
        promptDiv.appendChild(promptTitle);
        promptDiv.appendChild(promptDesc);
        promptDiv.appendChild(promptText);
        
        container.appendChild(promptDiv);
    });
}

// ==================== FONCTIONS DE GÉNÉRATION DÉTAILLÉES ====================

// Fonction pour générer un scénario détaillé
async function generateScenario(keywords) {
    try {
        console.log("Génération d'un scénario détaillé avec les mots-clés:", keywords);
        
        // Ajouter un facteur d'aléatoire basé sur l'horodatage actuel
        const randomSeed = Date.now() + Math.floor(Math.random() * 1000000);
        console.log("Seed aléatoire pour la génération:", randomSeed);
        
        // Analyser les mots-clés pour déterminer le type d'univers
        const keywordsLower = keywords.toLowerCase();
        let universeType = "contemporain";
        
        if (keywordsLower.includes("médiéval") || keywordsLower.includes("fantasy") || keywordsLower.includes("magie") || keywordsLower.includes("dragon")) {
            universeType = "médiéval-fantastique";
        } else if (keywordsLower.includes("futur") || keywordsLower.includes("espace") || keywordsLower.includes("robot") || keywordsLower.includes("technologie")) {
            universeType = "science-fiction";
        } else if (keywordsLower.includes("apocalypse") || keywordsLower.includes("survie") || keywordsLower.includes("ruine")) {
            universeType = "post-apocalyptique";
        } else if (keywordsLower.includes("steampunk") || keywordsLower.includes("vapeur") || keywordsLower.includes("victorien")) {
            universeType = "steampunk";
        } else if (keywordsLower.includes("cyberpunk") || keywordsLower.includes("hacker") || keywordsLower.includes("néon")) {
            universeType = "cyberpunk";
        } else if (keywordsLower.includes("mythe") || keywordsLower.includes("dieu") || keywordsLower.includes("légende")) {
            universeType = "mythologique";
        } else if (keywordsLower.includes("histoire") || keywordsLower.includes("guerre") || keywordsLower.includes("ancien")) {
            universeType = "historique";
        }
        
        // Descriptions d'univers selon le type
        const universeDescriptions = {
            "médiéval-fantastique": "Un monde médiéval où la magie et les créatures fantastiques existent. Les royaumes sont gouvernés par des rois et des reines, tandis que des mages et des chevaliers parcourent les terres.",
            "science-fiction": "Un futur où la technologie a transformé la société. Les voyages spatiaux, l'intelligence artificielle et les implants cybernétiques font partie du quotidien.",
            "post-apocalyptique": "Un monde dévasté par une catastrophe majeure. Les survivants luttent pour reconstruire la civilisation parmi les ruines de l'ancien monde.",
            "contemporain": "Notre monde actuel, avec ses villes modernes, sa technologie et ses problèmes sociaux. Un cadre réaliste pour des histoires ancrées dans la réalité.",
            "steampunk": "Un univers victorien alternatif où la technologie à vapeur s'est développée de façon extraordinaire. Dirigeables, machines à engrenages et inventions fantastiques dominent le paysage.",
            "cyberpunk": "Un futur proche dystopique où les mégacorporations règnent et la technologie numérique imprègne tous les aspects de la vie. Les néons illuminent des villes surpeuplées.",
            "mythologique": "Un monde où les dieux, les héros et les créatures des mythes anciens existent réellement. Les légendes prennent vie et façonnent le destin des mortels.",
            "historique": "Une période spécifique de notre histoire, fidèlement représentée avec ses coutumes, ses conflits et ses personnages emblématiques."
        };
        
        // Créer l'univers
        const univers = {
            type: universeType,
            description: universeDescriptions[universeType] || "Un monde fascinant plein de possibilités et d'aventures."
        };
        
        // Générer des personnages
        const personnages = generatePersonnages(keywords, univers, randomSeed);
        
        // Générer un titre basé sur les mots-clés et l'univers
        const title = generateTitle(keywords, univers, personnages, randomSeed);
        
        // Déterminer le nombre de chapitres (entre 4 et 6)
        const numChapters = 4 + Math.floor((randomSeed % 3));
        
        // Générer les chapitres
        const chapters = [];
        for (let i = 0; i < numChapters; i++) {
            // Déterminer le nombre de pages pour ce chapitre (entre 6 et 12)
            const numPages = 6 + Math.floor((randomSeed + i) % 7);
            
            // Générer le chapitre
            const chapter = generateChapter(i, numChapters, numPages, keywords, univers, personnages, randomSeed + i);
            chapters.push(chapter);
        }
        
        // Créer l'objet scénario
        const scenario = {
            title: title,
            keywords: keywords,
            univers: univers,
            personnages: personnages,
            chapters: chapters,
            timestamp: Date.now(),
            randomSeed: randomSeed
        };
        
        return scenario;
    } catch (error) {
        console.error("Erreur lors de la génération du scénario:", error);
        
        // Retourner un scénario par défaut en cas d'erreur
        return {
            title: "Aventure mystérieuse",
            keywords: keywords,
            univers: {
                type: "contemporain",
                description: "Un monde moderne plein de mystères à découvrir."
            },
            personnages: [
                {
                    nom: "Alex Dumont",
                    role: "protagoniste",
                    description: "Un jeune aventurier curieux et déterminé.",
                    apparence: "Cheveux bruns, yeux verts, tenue décontractée",
                    motivation: "Découvrir la vérité sur un ancien mystère familial"
                },
                {
                    nom: "Sophie Martin",
                    role: "alliée",
                    description: "Une archéologue brillante aux connaissances précieuses.",
                    apparence: "Cheveux noirs attachés, lunettes, tenue pratique",
                    motivation: "Préserver les artefacts historiques importants"
                }
            ],
            chapters: [
                {
                    title: "La découverte",
                    summary: "Alex trouve un mystérieux artefact dans le grenier de sa grand-mère.",
                    pages: 8
                },
                {
                    title: "La recherche",
                    summary: "Alex et Sophie commencent à enquêter sur l'origine de l'artefact.",
                    pages: 7
                },
                {
                    title: "Le danger",
                    summary: "Des individus mystérieux semblent vouloir s'emparer de l'artefact à tout prix.",
                    pages: 9
                },
                {
                    title: "La révélation",
                    summary: "Alex découvre la vérité sur sa famille et l'importance de l'artefact.",
                    pages: 10
                }
            ],
            timestamp: Date.now()
        };
    }
}

// Fonction pour générer des personnages
function generatePersonnages(keywords, univers, seed) {
    const keywordsLower = keywords.toLowerCase();
    const personnages = [];
    
    // Noms selon le type d'univers
    const prenoms = {
        "médiéval-fantastique": ["Elric", "Galadriel", "Thorin", "Lyra", "Aragorn", "Morgana", "Thorgal", "Freya", "Gandalf", "Arwen"],
        "science-fiction": ["Zack", "Nova", "Axel", "Stella", "Orion", "Lyra", "Neo", "Trinity", "Deckard", "Ripley"],
        "post-apocalyptique": ["Max", "Furiosa", "Eli", "Katniss", "Marcus", "Riley", "Joel", "Ellie", "Walker", "Ash"],
        "contemporain": ["Thomas", "Emma", "Lucas", "Léa", "Hugo", "Chloé", "Mathis", "Camille", "Nathan", "Sarah"],
        "steampunk": ["Archibald", "Victoria", "Cornelius", "Elizabeth", "Thaddeus", "Amelia", "Bartholomew", "Eliza", "Horatio", "Wilhelmina"],
        "cyberpunk": ["Raven", "Zero", "Spike", "Trinity", "Dex", "Pixel", "Cipher", "Nyx", "Jax", "Vex"],
        "mythologique": ["Perseus", "Athena", "Theseus", "Artemis", "Hercules", "Persephone", "Orpheus", "Circe", "Jason", "Medea"],
        "historique": ["Henri", "Jeanne", "Louis", "Éléonore", "Charles", "Marie", "François", "Isabelle", "Richard", "Catherine"]
    };
    
    const noms = {
        "médiéval-fantastique": ["Lumebois", "Forgefer", "Mainforte", "Hautvent", "Lamedragon", "Pierrelune", "Courageux", "Flammecoeur", "Longarchet", "Sangdoré"],
        "science-fiction": ["Stellar", "Quantum", "Novak", "Reeves", "Anderson", "Chen", "Takahashi", "Rodriguez", "Kim", "Singh"],
        "post-apocalyptique": ["Survivor", "Walker", "Hunter", "Scavenger", "Steel", "Dust", "Ruin", "Ash", "Storm", "Blade"],
        "contemporain": ["Martin", "Dubois", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Leroy", "Moreau"],
        "steampunk": ["Cogsworth", "Steamwright", "Brassington", "Gearhart", "Copperfield", "Ironside", "Whistledown", "Clockwell", "Valveson", "Bronzeley"],
        "cyberpunk": ["Wired", "Netrunner", "Codec", "Glitch", "Proxy", "Virus", "Crypto", "Neon", "Hack", "Byte"],
        "mythologique": ["Olympien", "Titanide", "Héraclide", "Argonaute", "Atlante", "Spartiate", "Troyen", "Crétois", "Delphien", "Thébain"],
        "historique": ["de Montfort", "de Bourbon", "Plantagenêt", "Tudor", "Médicis", "Borgia", "von Habsburg", "Romanov", "Stuart", "Bonaparte"]
    };
    
    // Traits de personnalité
    const traits = ["courageux", "intelligent", "loyal", "rusé", "fort", "agile", "sage", "charismatique", "mystérieux", "déterminé", "compatissant", "impulsif", "calculateur", "optimiste", "pessimiste", "honorable", "rebelle", "discipliné", "créatif", "pragmatique"];
    
    // Apparences
    const apparences = {
        "médiéval-fantastique": ["Armure étincelante", "Robe de mage", "Cape elfique", "Tenue de ranger", "Habits de noble", "Tunique simple", "Armure de cuir", "Tenue de barde", "Habits de paysan", "Robe de prêtre"],
        "science-fiction": ["Combinaison spatiale", "Implants cybernétiques", "Uniforme militaire futuriste", "Vêtements civils high-tech", "Blouse de scientifique", "Armure exosquelette", "Tenue de pilote", "Vêtements urbains futuristes", "Combinaison de protection", "Uniforme corporatif"],
        "post-apocalyptique": ["Vêtements usés et rapiécés", "Armure de fortune", "Tenue de survie", "Équipement militaire récupéré", "Vêtements tribaux", "Masque à gaz", "Tenue de scavenger", "Vêtements protecteurs", "Haillons", "Tenue de nomade"],
        "contemporain": ["Costume élégant", "Tenue décontractée", "Uniforme professionnel", "Tenue sportive", "Vêtements à la mode", "Tenue de travail", "Vêtements simples", "Tenue bohème", "Vêtements formels", "Tenue de tous les jours"],
        "steampunk": ["Redingote et gilet", "Robe à crinoline", "Uniforme d'aviateur", "Tenue d'explorateur", "Habit d'inventeur", "Robe victorienne", "Costume à engrenages", "Tenue d'aristocrate", "Vêtements d'ouvrier", "Uniforme militaire à vapeur"],
        "cyberpunk": ["Veste en cuir avec néons", "Vêtements urbains avec implants", "Tenue de hacker", "Armure corporative", "Vêtements de rue high-tech", "Tenue de netrunner", "Vêtements avec circuits intégrés", "Tenue de mercenaire", "Vêtements de club cybernétique", "Uniforme de sécurité"],
        "mythologique": ["Toge grecque", "Armure hoplite", "Tunique romaine", "Vêtements de héros", "Robe de prêtresse", "Armure dorée", "Tenue de chasseur", "Vêtements royaux", "Tenue de guerrier", "Habits divins"],
        "historique": ["Habits nobles", "Tenue paysanne", "Uniforme militaire d'époque", "Robe de cour", "Vêtements de marchand", "Tenue d'artisan", "Habits religieux", "Tenue royale", "Vêtements de voyage", "Uniforme de garde"]
    };
    
    // Motivations
    const motivations = ["Venger un être cher", "Découvrir la vérité", "Sauver le monde", "Trouver un trésor", "Restaurer l'honneur", "Protéger sa famille", "Conquérir le pouvoir", "Expier ses fautes", "Trouver sa place", "Prouver sa valeur", "Renverser un tyran", "Retrouver un objet perdu", "Accomplir une prophétie", "Échapper à son destin", "Réunir sa famille", "Obtenir la reconnaissance", "Changer le système", "Survivre à tout prix", "Préserver un savoir ancien", "Répandre une idéologie"];
    
    // Déterminer le nombre de personnages (entre 3 et 5)
    const numPersonnages = 3 + Math.floor((seed % 3));
    
    // Générer les personnages
    for (let i = 0; i < numPersonnages; i++) {
        // Déterminer le rôle du personnage
        let role = "secondaire";
        if (i === 0) {
            role = "protagoniste";
        } else if (i === 1) {
            role = "allié";
        } else if (i === numPersonnages - 1) {
            role = "antagoniste";
        }
        
        // Sélectionner des éléments aléatoires pour ce personnage
        const prenomsListe = prenoms[univers.type] || prenoms["contemporain"];
        const nomsListe = noms[univers.type] || noms["contemporain"];
        const apparencesListe = apparences[univers.type] || apparences["contemporain"];
        
        const prenom = prenomsListe[Math.floor((seed + i * 13) % prenomsListe.length)];
        const nom = nomsListe[Math.floor((seed + i * 17) % nomsListe.length)];
        const trait1 = traits[Math.floor((seed + i * 19) % traits.length)];
        const trait2 = traits[Math.floor((seed + i * 23) % traits.length)];
        const apparence = apparencesListe[Math.floor((seed + i * 29) % apparencesListe.length)];
        const motivation = motivations[Math.floor((seed + i * 31) % motivations.length)];
        
        // Créer une description basée sur les traits et le rôle
        let description = "";
        if (role === "protagoniste") {
            description = `Un${prenom.endsWith('a') || prenom.endsWith('e') ? 'e' : ''} ${trait1} et ${trait2} qui se retrouve au cœur d'une aventure extraordinaire.`;
        } else if (role === "allié") {
            description = `Un${prenom.endsWith('a') || prenom.endsWith('e') ? 'e' : ''} fidèle compagnon${prenom.endsWith('a') || prenom.endsWith('e') ? 'ne' : ''} qui apporte son aide et ses compétences uniques.`;
        } else if (role === "antagoniste") {
            description = `Un${prenom.endsWith('a') || prenom.endsWith('e') ? 'e' : ''} adversaire redoutable dont les objectifs s'opposent à ceux du protagoniste.`;
        } else {
            description = `Un${prenom.endsWith('a') || prenom.endsWith('e') ? 'e' : ''} personnage ${trait1} qui joue un rôle important dans l'histoire.`;
        }
        
        // Créer un trait distinctif
        const traitsDistinctifs = [
            "cicatrice sur la joue", "yeux de couleur inhabituelle", "tatouage mystérieux", 
            "accent étranger", "bijou unique", "coiffure distinctive", 
            "démarche particulière", "voix remarquable", "marque de naissance", 
            "accessoire caractéristique"
        ];
        const traitDistinctif = traitsDistinctifs[Math.floor((seed + i * 37) % traitsDistinctifs.length)];
        
        // Ajouter le personnage à la liste
        personnages.push({
            nom: `${prenom} ${nom}`,
            role: role,
            description: description,
            apparence: apparence,
            traitDistinctif: traitDistinctif,
            traits: [trait1, trait2],
            motivation: motivation
        });
    }
    
    return personnages;
}

// Fonction pour générer un titre
function generateTitle(keywords, univers, personnages, seed) {
    const keywordsLower = keywords.toLowerCase();
    
    // Structures de titres selon le type d'univers
    const titleStructures = {
        "médiéval-fantastique": [
            "La Quête de [Nom]",
            "Les Chroniques de [Lieu]",
            "L'Épée de [Nom/Lieu]",
            "La Légende de [Nom]",
            "Le Secret de [Lieu]",
            "[Nom] et le [Objet] magique",
            "Les [Nombre] Royaumes",
            "La Prophétie de [Nom/Lieu]"
        ],
        "science-fiction": [
            "Destination: [Lieu]",
            "Code: [Nom/Nombre]",
            "Projet [Nom]",
            "La Dernière [Objet/Personne]",
            "[Nom] Prime",
            "Nexus [Nombre]",
            "Les Chroniques de [Lieu] [Nombre]",
            "Au-delà de [Lieu]"
        ],
        "post-apocalyptique": [
            "Les Survivants de [Lieu]",
            "Monde [Nombre]: [Nom]",
            "Après [Événement]",
            "Les Ruines de [Lieu]",
            "Le Dernier [Personne/Objet]",
            "[Nom]: Survivant",
            "Zone [Nombre]",
            "L'Aube après [Événement]"
        ],
        "contemporain": [
            "Les Secrets de [Nom/Lieu]",
            "[Nom] et le Mystère de [Lieu/Objet]",
            "L'Affaire [Nom]",
            "Rencontre à [Lieu]",
            "Le Journal de [Nom]",
            "La Vérité sur [Nom/Événement]",
            "Un Été à [Lieu]",
            "La Double Vie de [Nom]"
        ],
        "steampunk": [
            "Les Engrenages de [Lieu]",
            "L'Étrange Machine de [Nom]",
            "Vapeur et [Objet]",
            "Le Dirigeable [Nom]",
            "Les Inventions de [Nom]",
            "L'Horloge de [Lieu]",
            "La Ligue des [Personnes]",
            "[Nom] et l'Automate"
        ],
        "cyberpunk": [
            "Néon [Nombre]",
            "Hack//[Nom]",
            "Chrome et [Objet]",
            "Les Rues de [Lieu]",
            "Mémoire [Nombre]",
            "[Nom]: Netrunner",
            "Projet [Nom] [Nombre]",
            "La Dernière Interface"
        ],
        "mythologique": [
            "La Colère des [Personnes]",
            "Le Héros de [Lieu]",
            "La Légende de [Nom]",
            "Les [Nombre] Épreuves",
            "Le Voyage de [Nom]",
            "Les Enfants de [Nom/Lieu]",
            "Le Don de [Nom]",
            "La Vengeance de [Nom]"
        ],
        "historique": [
            "Les Ombres de [Lieu]",
            "Le Secret de [Nom/Lieu]",
            "La Conspiration de [Lieu]",
            "[Nom]: Une Histoire",
            "L'Héritier de [Lieu/Nom]",
            "La Chute de [Lieu]",
            "Les [Nombre] Jours",
            "Le Serment de [Nom]"
        ]
    };
    
    // Sélectionner une structure de titre selon l'univers
    const structures = titleStructures[univers.type] || titleStructures["contemporain"];
    const structure = structures[Math.floor(seed % structures.length)];
    
    // Éléments pour remplacer les placeholders
    const protagoniste = personnages.find(p => p.role === "protagoniste");
    const antagoniste = personnages.find(p => p.role === "antagoniste");
    
    // Lieux selon le type d'univers
    const lieux = {
        "médiéval-fantastique": ["Avalon", "Camelot", "Eldoria", "Mystara", "Drakenhold", "Sylvandar", "Ironforge", "Azurheim"],
        "science-fiction": ["Nexus", "Nova Prime", "Epsilon", "Andromeda", "Zenith", "Proxima", "Stellaris", "Neoterra"],
        "post-apocalyptique": ["Wasteland", "New Eden", "Ashlands", "Sanctuary", "Haven", "Deadzone", "Refuge", "Outpost"],
        "contemporain": ["Riverdale", "Oakmont", "Millfield", "Harborview", "Westridge", "Pinecrest", "Meadowbrook", "Lakeside"],
        "steampunk": ["Clockhaven", "New Victoria", "Brasston", "Cogsworth", "Steamford", "Irongate", "Gearwich", "Aetherton"],
        "cyberpunk": ["Neo Tokyo", "Chrome City", "Dataville", "Neon District", "Silicon Heights", "Proxy Town", "Grid Central", "Byte Harbor"],
        "mythologique": ["Olympus", "Atlantis", "Asgard", "Elysium", "Tartarus", "Valhalla", "Avalon", "Lemuria"],
        "historique": ["Versailles", "Alexandria", "Constantinople", "Carthage", "Pompeii", "Babylon", "Troy", "Thebes"]
    };
    
    // Objets selon le type d'univers
    const objets = {
        "médiéval-fantastique": ["Épée", "Amulette", "Grimoire", "Couronne", "Cristal", "Sceptre", "Anneau", "Parchemin"],
        "science-fiction": ["Vaisseau", "Androïde", "Implant", "Portail", "Matrice", "Prototype", "Artefact", "Transmetteur"],
        "post-apocalyptique": ["Abri", "Vaccin", "Carte", "Radio", "Masque", "Véhicule", "Arme", "Filtre"],
        "contemporain": ["Dossier", "Clé", "Lettre", "Photographie", "Téléphone", "Journal", "Médaillon", "Testament"],
        "steampunk": ["Machine", "Automate", "Dirigeable", "Montre", "Invention", "Mécanisme", "Lunettes", "Boussole"],
        "cyberpunk": ["Puce", "Implant", "Programme", "Interface", "Drone", "Réseau", "Deck", "Virus"],
        "mythologique": ["Trident", "Lyre", "Toison", "Calice", "Bouclier", "Flèche", "Casque", "Ambroisie"],
        "historique": ["Sceau", "Épée", "Carte", "Couronne", "Relique", "Manuscrit", "Portrait", "Médaille"]
    };
    
    // Événements selon le type d'univers
    const evenements = {
        "médiéval-fantastique": ["Couronnement", "Prophétie", "Bataille", "Quête", "Malédiction", "Tournoi", "Invasion", "Rituel"],
        "science-fiction": ["Contact", "Découverte", "Singularité", "Colonisation", "Convergence", "Anomalie", "Terraformation", "Éveil"],
        "post-apocalyptique": ["Cataclysme", "Épidémie", "Impact", "Guerre", "Effondrement", "Contamination", "Extinction", "Déluge"],
        "contemporain": ["Disparition", "Révélation", "Rencontre", "Accident", "Procès", "Élection", "Scandale", "Retrouvailles"],
        "steampunk": ["Exposition", "Révolution", "Invention", "Expédition", "Sabotage", "Inauguration", "Catastrophe", "Découverte"],
        "cyberpunk": ["Blackout", "Hack", "Upload", "Fusion", "Révolte", "Effacement", "Connexion", "Verrouillage"],
        "mythologique": ["Défi", "Châtiment", "Quête", "Sacrifice", "Métamorphose", "Vengeance", "Épreuve", "Oracle"],
        "historique": ["Couronnement", "Bataille", "Traité", "Conspiration", "Révolution", "Siège", "Découverte", "Exil"]
    };
    
    // Nombres
    const nombres = ["Deux", "Trois", "Quatre", "Cinq", "Sept", "Neuf", "Douze", "Cent"];
    
    // Remplacer les placeholders dans la structure du titre
    let title = structure;
    
    if (title.includes("[Nom]") && protagoniste) {
        title = title.replace("[Nom]", protagoniste.nom.split(" ")[0]);
    }
    
    if (title.includes("[Lieu]")) {
        const lieuxListe = lieux[univers.type] || lieux["contemporain"];
        const lieu = lieuxListe[Math.floor((seed * 13) % lieuxListe.length)];
        title = title.replace("[Lieu]", lieu);
    }
    
    if (title.includes("[Objet]")) {
        const objetsListe = objets[univers.type] || objets["contemporain"];
        const objet = objetsListe[Math.floor((seed * 17) % objetsListe.length)];
        title = title.replace("[Objet]", objet);
    }
    
    if (title.includes("[Événement]")) {
        const evenementsListe = evenements[univers.type] || evenements["contemporain"];
        const evenement = evenementsListe[Math.floor((seed * 19) % evenementsListe.length)];
        title = title.replace("[Événement]", evenement);
    }
    
    if (title.includes("[Nombre]")) {
        const nombre = nombres[Math.floor((seed * 23) % nombres.length)];
        title = title.replace("[Nombre]", nombre);
    }
    
    if (title.includes("[Personne]") || title.includes("[Personnes]")) {
        const personnes = {
            "médiéval-fantastique": ["Chevaliers", "Mages", "Elfes", "Dragons", "Rois", "Sorciers"],
            "science-fiction": ["Explorateurs", "Androïdes", "Colons", "Mutants", "Pilotes", "Scientifiques"],
            "post-apocalyptique": ["Survivants", "Nomades", "Mutants", "Gardiens", "Chasseurs", "Scavengers"],
            "contemporain": ["Détectives", "Agents", "Héritiers", "Témoins", "Artistes", "Journalistes"],
            "steampunk": ["Inventeurs", "Aviateurs", "Explorateurs", "Mécaniciens", "Aristocrates", "Révolutionnaires"],
            "cyberpunk": ["Hackers", "Runners", "Corporates", "Rebelles", "Mercenaires", "Techno-shamans"],
            "mythologique": ["Dieux", "Héros", "Titans", "Oracles", "Créatures", "Immortels"],
            "historique": ["Chevaliers", "Nobles", "Espions", "Explorateurs", "Marchands", "Révolutionnaires"]
        };
        
        const personnesListe = personnes[univers.type] || personnes["contemporain"];
        const personne = personnesListe[Math.floor((seed * 29) % personnesListe.length)];
        
        title = title.replace("[Personnes]", personne);
        title = title.replace("[Personne]", personne.slice(0, -1)); // Enlever le 's' pour le singulier
    }
    
    // Remplacer les combinaisons
    if (title.includes("[Nom/Lieu]")) {
        if (Math.floor(seed % 2) === 0 && protagoniste) {
            title = title.replace("[Nom/Lieu]", protagoniste.nom.split(" ")[0]);
        } else {
            const lieuxListe = lieux[univers.type] || lieux["contemporain"];
            const lieu = lieuxListe[Math.floor((seed * 31) % lieuxListe.length)];
            title = title.replace("[Nom/Lieu]", lieu);
        }
    }
    
    if (title.includes("[Nom/Événement]")) {
        if (Math.floor(seed % 2) === 0 && protagoniste) {
            title = title.replace("[Nom/Événement]", protagoniste.nom.split(" ")[0]);
        } else {
            const evenementsListe = evenements[univers.type] || evenements["contemporain"];
            const evenement = evenementsListe[Math.floor((seed * 37) % evenementsListe.length)];
            title = title.replace("[Nom/Événement]", evenement);
        }
    }
    
    if (title.includes("[Lieu/Objet]")) {
        if (Math.floor(seed % 2) === 0) {
            const lieuxListe = lieux[univers.type] || lieux["contemporain"];
            const lieu = lieuxListe[Math.floor((seed * 41) % lieuxListe.length)];
            title = title.replace("[Lieu/Objet]", lieu);
        } else {
            const objetsListe = objets[univers.type] || objets["contemporain"];
            const objet = objetsListe[Math.floor((seed * 43) % objetsListe.length)];
            title = title.replace("[Lieu/Objet]", objet);
        }
    }
    
    if (title.includes("[Personne/Objet]")) {
        if (Math.floor(seed % 2) === 0) {
            const personnes = {
                "médiéval-fantastique": ["Chevalier", "Mage", "Elfe", "Dragon", "Roi", "Sorcier"],
                "science-fiction": ["Explorateur", "Androïde", "Colon", "Mutant", "Pilote", "Scientifique"],
                "post-apocalyptique": ["Survivant", "Nomade", "Mutant", "Gardien", "Chasseur", "Scavenger"],
                "contemporain": ["Détective", "Agent", "Héritier", "Témoin", "Artiste", "Journaliste"],
                "steampunk": ["Inventeur", "Aviateur", "Explorateur", "Mécanicien", "Aristocrate", "Révolutionnaire"],
                "cyberpunk": ["Hacker", "Runner", "Corporate", "Rebelle", "Mercenaire", "Techno-shaman"],
                "mythologique": ["Dieu", "Héros", "Titan", "Oracle", "Créature", "Immortel"],
                "historique": ["Chevalier", "Noble", "Espion", "Explorateur", "Marchand", "Révolutionnaire"]
            };
            
            const personnesListe = personnes[univers.type] || personnes["contemporain"];
            const personne = personnesListe[Math.floor((seed * 47) % personnesListe.length)];
            title = title.replace("[Personne/Objet]", personne);
        } else {
            const objetsListe = objets[univers.type] || objets["contemporain"];
            const objet = objetsListe[Math.floor((seed * 53) % objetsListe.length)];
            title = title.replace("[Personne/Objet]", objet);
        }
    }
    
    // Intégrer un mot-clé si possible
    const keywordsList = keywords.split(/[\s,]+/).filter(k => k.length > 3);
    if (keywordsList.length > 0 && Math.floor(seed % 3) === 0) {
        const keyword = keywordsList[Math.floor(seed % keywordsList.length)];
        const keywordCapitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        
        // Ajouter le mot-clé au titre s'il n'y est pas déjà
        if (!title.toLowerCase().includes(keyword.toLowerCase())) {
            if (title.includes(":")) {
                const parts = title.split(":");
                title = `${parts[0]}: ${keywordCapitalized} ${parts[1]}`;
            } else if (Math.floor(seed % 2) === 0) {
                title = `${title} - ${keywordCapitalized}`;
            } else {
                title = `${keywordCapitalized}: ${title}`;
            }
        }
    }
    
    return title;
}

// Fonction pour générer un chapitre
function generateChapter(index, totalChapters, numPages, keywords, univers, personnages, seed) {
    // Structures narratives selon la position du chapitre
    let title = "";
    let summary = "";
    
    // Protagoniste et antagoniste
    const protagoniste = personnages.find(p => p.role === "protagoniste");
    const antagoniste = personnages.find(p => p.role === "antagoniste");
    
    // Titres de chapitres selon le type d'univers
    const chapterTitles = {
        "médiéval-fantastique": [
            "L'Appel de l'Aventure", "La Prophétie", "Le Départ", "La Forêt Mystérieuse", 
            "Le Premier Défi", "La Rencontre", "Le Village Caché", "La Forteresse", 
            "L'Épreuve du Feu", "Le Sanctuaire", "La Trahison", "L'Alliance Inattendue", 
            "La Bataille", "Le Sacrifice", "La Révélation", "Le Retour Triomphal"
        ],
        "science-fiction": [
            "Premier Contact", "Signal Inconnu", "Décollage", "Anomalie Spatiale", 
            "La Station Abandonnée", "Intelligence Artificielle", "Distorsion Temporelle", "Colonie Perdue", 
            "Protocole d'Urgence", "Mutation", "Sabotage", "Alliance Interstellaire", 
            "Invasion", "Singularité", "Retour sur Terre", "Nouvelle Frontière"
        ],
        "post-apocalyptique": [
            "Les Cendres", "Survivants", "La Zone Contaminée", "Ressources Limitées", 
            "Le Convoi", "Abri Temporaire", "Radiation", "La Communauté", 
            "Pillards", "L'Eau Pure", "Trahison", "L'Ancienne Base", 
            "Le Dernier Espoir", "La Horde", "Renaissance", "Un Nouveau Départ"
        ],
        "contemporain": [
            "Rencontre Fortuite", "Le Message", "Disparition", "Premier Indice", 
            "La Poursuite", "Révélations", "Fausse Piste", "Confrontation", 
            "Vérité Cachée", "Allié Inattendu", "Piège", "Évasion", 
            "Le Complot", "Dernière Chance", "Face à Face", "Résolution"
        ],
        "steampunk": [
            "L'Invention", "Engrenages et Vapeur", "Le Grand Mécanisme", "Expédition Aérienne", 
            "La Guilde des Inventeurs", "Sabotage", "Le Prototype", "Cité des Nuages", 
            "Rouages du Pouvoir", "L'Automate", "Conspiration Mécanique", "Le Dirigeable Royal", 
            "Révolution Industrielle", "L'Horloge Fatidique", "Vapeur et Acier", "Triomphe de la Science"
        ],
        "cyberpunk": [
            "Connexion", "Le Réseau", "Hack Initial", "Données Volées", 
            "Zone Restreinte", "L'Implant", "Réalité Virtuelle", "Mégacorporation", 
            "Blackout", "Intelligence Artificielle", "Trahison Digitale", "Les Bas-fonds", 
            "Sécurité Maximale", "Le Virus", "Conscience Uploadée", "Liberté Numérique"
        ],
        "mythologique": [
            "L'Oracle", "La Prophétie Divine", "Le Don des Dieux", "L'Épreuve", 
            "Le Monstre", "Le Sanctuaire", "La Descente aux Enfers", "Le Labyrinthe", 
            "La Colère Divine", "L'Artefact Sacré", "Trahison Immortelle", "L'Alliance Héroïque", 
            "Le Combat Final", "Le Sacrifice", "La Rédemption", "L'Ascension"
        ],
        "historique": [
            "L'Héritier", "Le Complot", "Exil", "Terres Étrangères", 
            "La Cour", "L'Alliance", "Le Tournoi", "Siège", 
            "Conspiration", "Trahison Royale", "La Bataille", "Diplomatie", 
            "Révolution", "Le Dernier Stand", "Couronnement", "Nouvelle Ère"
        ]
    };
    
    // Sélectionner un titre selon la position du chapitre et l'univers
    const titlesForUniverse = chapterTitles[univers.type] || chapterTitles["contemporain"];
    
    // Diviser les titres en sections correspondant aux actes de l'histoire
    const act1Titles = titlesForUniverse.slice(0, 4);
    const act2Titles = titlesForUniverse.slice(4, 12);
    const act3Titles = titlesForUniverse.slice(12);
    
    // Sélectionner un titre selon l'acte
    if (index < Math.ceil(totalChapters * 0.25)) {
        // Acte 1: Introduction
        title = act1Titles[Math.floor((seed * 13) % act1Titles.length)];
    } else if (index < Math.ceil(totalChapters * 0.75)) {
        // Acte 2: Développement
        title = act2Titles[Math.floor((seed * 17) % act2Titles.length)];
    } else {
        // Acte 3: Résolution
        title = act3Titles[Math.floor((seed * 19) % act3Titles.length)];
    }
    
    // Générer un résumé selon la position du chapitre
    if (index === 0) {
        // Premier chapitre: introduction
        const introTemplates = [
            `${protagoniste ? protagoniste.nom.split(" ")[0] : "Le héros"} découvre un secret qui va changer sa vie à jamais.`,
            `Une découverte inattendue pousse ${protagoniste ? protagoniste.nom.split(" ")[0] : "notre protagoniste"} à quitter sa zone de confort.`,
            `Un événement mystérieux bouleverse la vie tranquille de ${protagoniste ? protagoniste.nom.split(" ")[0] : "notre héros"}.`,
            `${protagoniste ? protagoniste.nom.split(" ")[0] : "Le protagoniste"} se retrouve impliqué dans une aventure qu'il n'aurait jamais imaginée.`
        ];
        summary = introTemplates[Math.floor(seed % introTemplates.length)];
    } else if (index === totalChapters - 1) {
        // Dernier chapitre: conclusion
        const outroTemplates = [
            `La confrontation finale entre ${protagoniste ? protagoniste.nom.split(" ")[0] : "le héros"} et ${antagoniste ? antagoniste.nom.split(" ")[0] : "son adversaire"} détermine le destin de tous.`,
            `Tous les fils de l'intrigue convergent vers une conclusion épique et révélatrice.`,
            `${protagoniste ? protagoniste.nom.split(" ")[0] : "Notre héros"} fait face à son plus grand défi, avec l'avenir en jeu.`,
            `Le moment de vérité arrive, révélant des secrets longtemps gardés et changeant tout à jamais.`
        ];
        summary = outroTemplates[Math.floor(seed % outroTemplates.length)];
    } else {
        // Chapitres intermédiaires
        const middleTemplates = [
            `${protagoniste ? protagoniste.nom.split(" ")[0] : "Le héros"} fait face à de nouveaux défis et découvre des alliés inattendus.`,
            `Des secrets sont révélés, compliquant la mission de ${protagoniste ? protagoniste.nom.split(" ")[0] : "notre protagoniste"}.`,
            `La quête se poursuit, avec des obstacles toujours plus dangereux à surmonter.`,
            `${antagoniste ? antagoniste.nom.split(" ")[0] : "L'adversaire"} resserre son étau, forçant ${protagoniste ? protagoniste.nom.split(" ")[0] : "le héros"} à prendre des décisions difficiles.`
        ];
        summary = middleTemplates[Math.floor(seed % middleTemplates.length)];
    }
    
    // Ajouter des détails spécifiques à l'univers
    const universeDetails = {
        "médiéval-fantastique": [
            "dans un ancien château", "au cœur d'une forêt enchantée", "lors d'un tournoi royal", 
            "dans les ruines d'un temple", "pendant une nuit de pleine lune", "au sommet d'une tour de mage"
        ],
        "science-fiction": [
            "à bord du vaisseau spatial", "sur une planète inconnue", "dans une station orbitale", 
            "pendant un saut hyperspatial", "dans un laboratoire secret", "lors d'une anomalie temporelle"
        ],
        "post-apocalyptique": [
            "parmi les ruines de la ville", "dans un bunker souterrain", "pendant une tempête toxique", 
            "dans une zone de quarantaine", "au milieu du désert", "dans l'ancien métro"
        ],
        "contemporain": [
            "dans un gratte-ciel de la ville", "lors d'une soirée mondaine", "pendant un voyage à l'étranger", 
            "dans un vieux manoir", "au cœur d'une métropole", "sur une île isolée"
        ],
        "steampunk": [
            "dans l'atelier d'inventeur", "à bord d'un dirigeable", "pendant l'exposition universelle", 
            "dans les tunnels à vapeur", "au sein de la guilde des mécaniciens", "lors d'un voyage en train à vapeur"
        ],
        "cyberpunk": [
            "dans la réalité virtuelle", "au siège de la mégacorporation", "dans les bas-fonds de la ville", 
            "pendant un blackout numérique", "dans un club cybernétique", "lors d'un hack majeur"
        ],
        "mythologique": [
            "sur le mont Olympe", "dans le royaume des morts", "pendant une éclipse divine", 
            "dans un temple sacré", "lors d'une fête des dieux", "au cœur du labyrinthe"
        ],
        "historique": [
            "à la cour royale", "pendant une bataille historique", "lors d'un bal masqué", 
            "dans une cité assiégée", "au cours d'un voyage en mer", "pendant une révolution"
        ]
    };
    
    const detailsForUniverse = universeDetails[univers.type] || universeDetails["contemporain"];
    const detail = detailsForUniverse[Math.floor((seed * 23) % detailsForUniverse.length)];
    
    // Ajouter le détail au résumé
    summary += ` L'action se déroule ${detail}.`;
    
    return {
        title: title,
        summary: summary,
        pages: numPages
    };
}

// Fonction pour créer un storyboard
async function createStoryboard(scenario, chapterIndex) {
    try {
        console.log("Création du storyboard pour le chapitre:", chapterIndex);
        
        const chapter = scenario.chapters[chapterIndex];
        const numPages = chapter.pages;
        
        // Créer l'objet storyboard
        const storyboard = {
            chapterTitle: chapter.title,
            chapterSummary: chapter.summary,
            chapterIndex: chapterIndex,
            personnages: scenario.personnages,
            univers: scenario.univers,
            pages: []
        };
        
        // Générer les pages du storyboard
        for (let pageIndex = 0; pageIndex < numPages; pageIndex++) {
            // Déterminer le nombre de cases pour cette page (entre 3 et 7)
            const numCases = 3 + Math.floor(Math.random() * 5);
            
            // Créer la page
            const page = {
                pageNumber: pageIndex + 1,
                cases: []
            };
            
            // Générer les cases de la page
            for (let caseIndex = 0; caseIndex < numCases; caseIndex++) {
                // Créer la case
                const caseItem = generateCase(
                    scenario, 
                    chapter, 
                    pageIndex, 
                    caseIndex, 
                    numCases, 
                    numPages
                );
                
                page.cases.push(caseItem);
            }
            
            storyboard.pages.push(page);
        }
        
        return storyboard;
    } catch (error) {
        console.error("Erreur lors de la création du storyboard:", error);
        
        // Retourner un storyboard par défaut en cas d'erreur
        return {
            chapterTitle: scenario.chapters[chapterIndex].title,
            chapterSummary: scenario.chapters[chapterIndex].summary,
            chapterIndex: chapterIndex,
            pages: [
                {
                    pageNumber: 1,
                    cases: [
                        {
                            description: "Introduction du chapitre avec les personnages principaux.",
                            dialogue: "Nous devons découvrir ce qui se passe ici."
                        },
                        {
                            description: "Les personnages explorent le lieu principal de l'action.",
                            dialogue: "Regardez ce que j'ai trouvé !"
                        },
                        {
                            description: "Un indice important est découvert.",
                            dialogue: "Cela change tout ce que nous pensions savoir."
                        }
                    ]
                },
                {
                    pageNumber: 2,
                    cases: [
                        {
                            description: "Les personnages discutent de leur découverte.",
                            dialogue: "Que devons-nous faire maintenant ?"
                        },
                        {
                            description: "Un obstacle apparaît soudainement.",
                            dialogue: "Attention !"
                        },
                        {
                            description: "Les personnages font face à l'obstacle.",
                            dialogue: "Nous pouvons y arriver ensemble."
                        },
                        {
                            description: "Résolution temporaire du problème.",
                            dialogue: "Ce n'est que le début."
                        }
                    ]
                }
            ]
        };
    }
}

// Fonction pour générer une case de storyboard
function generateCase(scenario, chapter, pageIndex, caseIndex, numCases, numPages) {
    // Déterminer la position narrative de cette case dans l'ensemble du chapitre
    const progress = (pageIndex * numCases + caseIndex) / (numPages * numCases);
    
    // Sélectionner les personnages présents dans cette case
    const personnagesPresents = selectPersonnagesForCase(scenario.personnages, progress);
    
    // Générer une description selon la position narrative
    let description = "";
    let dialogue = "";
    
    // Types de plans/cadrages
    const cadrages = [
        "Plan large montrant l'environnement complet",
        "Plan moyen cadrant les personnages en pied",
        "Gros plan sur le visage et l'expression",
        "Plan d'ensemble situant l'action dans son contexte",
        "Contre-plongée donnant une impression de puissance",
        "Plongée surplombant la scène",
        "Plan séquence suivant l'action en continu"
    ];
    
    // Sélectionner un cadrage
    const cadrage = cadrages[Math.floor(Math.random() * cadrages.length)];
    
    // Descriptions selon la position dans l'histoire
    if (progress < 0.1) {
        // Début du chapitre: introduction
        const introDescriptions = [
            `${cadrage}. Introduction du cadre où se déroule l'action. On découvre ${scenario.univers.type === "contemporain" ? "un lieu urbain animé" : scenario.univers.type === "médiéval-fantastique" ? "un village médiéval pittoresque" : scenario.univers.type === "science-fiction" ? "un environnement futuriste high-tech" : "le décor principal"}.`,
            `${cadrage}. Première apparition de ${personnagesPresents[0] || "notre protagoniste"}, qui observe son environnement avec attention.`,
            `${cadrage}. Mise en place de l'ambiance du chapitre, avec une lumière ${scenario.univers.type === "cyberpunk" ? "néon contrastée" : scenario.univers.type === "médiéval-fantastique" ? "douce et mystérieuse" : "caractéristique"} qui définit l'atmosphère.`
        ];
        description = introDescriptions[Math.floor(Math.random() * introDescriptions.length)];
        
        const introDialogues = [
            "Nous y voilà enfin. C'est exactement comme on me l'avait décrit.",
            "Je sens que quelque chose d'important va se produire ici.",
            "Cette fois, je dois être prêt à tout.",
            ""
        ];
        dialogue = introDialogues[Math.floor(Math.random() * introDialogues.length)];
    } else if (progress < 0.3) {
        // Début du développement: présentation du problème
        const problemDescriptions = [
            `${cadrage}. ${personnagesPresents[0] || "Le personnage principal"} découvre un élément qui va perturber sa quête.`,
            `${cadrage}. Une tension est palpable entre ${personnagesPresents[0] || "le protagoniste"} et ${personnagesPresents[1] || "un autre personnage"}.`,
            `${cadrage}. Un indice important est révélé, attirant l'attention de tous les personnages présents.`
        ];
        description = problemDescriptions[Math.floor(Math.random() * problemDescriptions.length)];
        
        const problemDialogues = [
            "Ce n'était pas prévu. Comment allons-nous gérer ça ?",
            "Regardez ce que j'ai trouvé. Cela change tout.",
            "Je ne fais pas confiance à cette situation.",
            "Nous devons agir vite avant qu'il ne soit trop tard."
        ];
        dialogue = problemDialogues[Math.floor(Math.random() * problemDialogues.length)];
    } else if (progress < 0.7) {
        // Développement: complications et obstacles
        const complicationDescriptions = [
            `${cadrage}. ${personnagesPresents[0] || "Le protagoniste"} fait face à un obstacle qui semble insurmontable.`,
            `${cadrage}. Une confrontation éclate entre ${personnagesPresents[0] || "le héros"} et ${personnagesPresents[1] || "un adversaire"}.`,
            `${cadrage}. Les personnages découvrent une information qui remet en question leurs plans.`,
            `${cadrage}. Un moment de tension où l'issue semble incertaine pour tous les personnages impliqués.`
        ];
        description = complicationDescriptions[Math.floor(Math.random() * complicationDescriptions.length)];
        
        const complicationDialogues = [
            "Nous n'avions pas prévu cette complication !",
            "Je refuse d'abandonner maintenant, il doit y avoir une solution.",
            "Peut-être que nous avons fait fausse route depuis le début...",
            "Ensemble, nous pouvons surmonter cet obstacle."
        ];
        dialogue = complicationDialogues[Math.floor(Math.random() * complicationDialogues.length)];
    } else if (progress < 0.9) {
        // Approche de la résolution
        const climaxDescriptions = [
            `${cadrage}. Le moment décisif approche, la tension est à son comble.`,
            `${cadrage}. ${personnagesPresents[0] || "Le protagoniste"} prend une décision cruciale qui pourrait tout changer.`,
            `${cadrage}. Les forces en présence s'affrontent dans un moment déterminant.`,
            `${cadrage}. Une révélation importante bouleverse la compréhension de la situation.`
        ];
        description = climaxDescriptions[Math.floor(Math.random() * climaxDescriptions.length)];
        
        const climaxDialogues = [
            "C'est maintenant ou jamais !",
            "Je comprends enfin ce qui se passe réellement.",
            "Tout s'est joué à cet instant précis.",
            "Nous n'avons plus le choix, il faut agir maintenant."
        ];
        dialogue = climaxDialogues[Math.floor(Math.random() * climaxDialogues.length)];
    } else {
        // Conclusion du chapitre
        const conclusionDescriptions = [
            `${cadrage}. La situation trouve sa résolution, laissant entrevoir les conséquences.`,
            `${cadrage}. ${personnagesPresents[0] || "Le protagoniste"} réfléchit aux événements qui viennent de se dérouler.`,
            `${cadrage}. Un indice sur ce qui attend les personnages dans le prochain chapitre.`,
            `${cadrage}. Un moment de calme après la tempête, permettant aux personnages de faire le point.`
        ];
        description = conclusionDescriptions[Math.floor(Math.random() * conclusionDescriptions.length)];
        
        const conclusionDialogues = [
            "Ce n'est que le début d'une aventure bien plus grande.",
            "Nous avons réussi, mais à quel prix ?",
            "Je me demande ce qui nous attend maintenant...",
            "Une étape franchie, mais notre quête est loin d'être terminée."
        ];
        dialogue = conclusionDialogues[Math.floor(Math.random() * conclusionDialogues.length)];
    }
    
    // Ajouter des détails spécifiques à l'univers
    const universeDetails = {
        "médiéval-fantastique": [
            "Des torches illuminent les murs de pierre", 
            "Un parchemin ancien est visible", 
            "Des armes médiévales ornent les murs", 
            "Une aura magique entoure certains objets"
        ],
        "science-fiction": [
            "Des hologrammes flottent dans l'air", 
            "Des écrans de contrôle clignotent", 
            "La technologie futuriste est omniprésente", 
            "Des vaisseaux spatiaux sont visibles par le hublot"
        ],
        "post-apocalyptique": [
            "Des ruines d'immeubles sont visibles à l'horizon", 
            "L'équipement de survie est usé mais fonctionnel", 
            "La végétation a repris ses droits sur les structures", 
            "Des masques à gaz et tenues de protection sont nécessaires"
        ],
        "contemporain": [
            "L'agitation urbaine est perceptible", 
            "Des smartphones et technologies modernes sont utilisés", 
            "Le décor reflète notre monde actuel", 
            "Des éléments de la vie quotidienne sont reconnaissables"
        ],
        "steampunk": [
            "Des mécanismes à engrenages sont visibles", 
            "La vapeur s'échappe de tuyaux en cuivre", 
            "Des dirigeables flottent dans le ciel", 
            "Les inventions mécaniques dominent le décor"
        ],
        "cyberpunk": [
            "Des néons colorés illuminent la scène", 
            "Des implants cybernétiques sont visibles sur les personnages", 
            "Des interfaces holographiques sont manipulées", 
            "Le contraste entre high-tech et délabrement est frappant"
        ],
        "mythologique": [
            "Des colonnes de marbre ornent le décor", 
            "Des symboles divins sont gravés sur les murs", 
            "Une lumière surnaturelle baigne la scène", 
            "Des créatures mythiques sont présentes ou représentées"
        ],
        "historique": [
            "Les costumes d'époque sont fidèlement représentés", 
            "L'architecture correspond précisément à la période", 
            "Des objets historiques authentiques sont visibles", 
            "L'ambiance reflète parfaitement l'époque dépeinte"
        ]
    };
    
    const detailsForUniverse = universeDetails[scenario.univers.type] || universeDetails["contemporain"];
    const detail = detailsForUniverse[Math.floor(Math.random() * detailsForUniverse.length)];
    
    // Ajouter le détail à la description
    description += ` ${detail}.`;
    
    // Créer l'objet case
    return {
        description: description,
        dialogue: dialogue,
        personnages: personnagesPresents.map(p => p)
    };
}

// Fonction pour sélectionner les personnages présents dans une case
function selectPersonnagesForCase(personnages, progress) {
    const personnagesPresents = [];
    
    // Le protagoniste est presque toujours présent
    const protagoniste = personnages.find(p => p.role === "protagoniste");
    if (protagoniste && Math.random() < 0.9) {
        personnagesPresents.push(protagoniste.nom);
    }
    
    // L'antagoniste apparaît plus souvent vers la fin
    const antagoniste = personnages.find(p => p.role === "antagoniste");
    if (antagoniste && Math.random() < progress * 1.5) {
        personnagesPresents.push(antagoniste.nom);
    }
    
    // Les alliés et personnages secondaires apparaissent de façon aléatoire
    personnages.forEach(personnage => {
        if (personnage.role !== "protagoniste" && personnage.role !== "antagoniste") {
            if (Math.random() < 0.3) {
                personnagesPresents.push(personnage.nom);
            }
        }
    });
    
    return personnagesPresents;
}

// Fonction pour générer des prompts
async function generatePrompts(storyboard) {
    try {
        console.log("Génération des prompts pour le storyboard");
        
        const prompts = [];
        
        // Récupérer les informations du chapitre et de l'univers
        const chapterTitle = storyboard.chapterTitle;
        const personnages = storyboard.personnages || [];
        const univers = storyboard.univers || { type: "contemporain" };
        
        // Styles artistiques adaptés selon le type d'univers
        const artStylesParUnivers = {
            "médiéval-fantastique": [
                "fantasy illustration style", 
                "medieval fantasy art", 
                "high fantasy painting", 
                "epic fantasy illustration"
            ],
            "science-fiction": [
                "sci-fi concept art", 
                "futuristic digital illustration", 
                "space opera style", 
                "cyberpunk digital art"
            ],
            "post-apocalyptique": [
                "post-apocalyptic concept art", 
                "wasteland illustration", 
                "dystopian ruins art", 
                "survival horror style"
            ],
            "contemporain": [
                "modern illustration style", 
                "realistic contemporary art", 
                "urban lifestyle illustration", 
                "slice of life art style"
            ],
            "steampunk": [
                "steampunk illustration", 
                "victorian sci-fi art", 
                "clockwork mechanism style", 
                "brass and steam aesthetic"
            ],
            "cyberpunk": [
                "cyberpunk digital art", 
                "neon noir illustration", 
                "high tech low life style", 
                "digital dystopia concept art"
            ],
            "mythologique": [
                "mythological illustration", 
                "classical mythology art", 
                "ancient legends style", 
                "epic myth concept art"
            ],
            "historique": [
                "historical illustration", 
                "period accurate art", 
                "historical realism style", 
                "authentic historical concept art"
            ]
        };
        
        // Éléments visuels de base pour tous les types d'univers
        const elementsVisuelsDeBase = [
            "detailed", 
            "high quality", 
            "professional lighting", 
            "dynamic composition"
        ];
        
        // Éléments visuels spécifiques selon le type d'univers
        const elementsVisuelsSpecifiques = {
            "médiéval-fantastique": [
                "magical atmosphere", 
                "ancient runes", 
                "mystical creatures", 
                "enchanted artifacts"
            ],
            "science-fiction": [
                "holographic displays", 
                "advanced technology", 
                "alien landscapes", 
                "spacecraft interiors"
            ],
            "post-apocalyptique": [
                "decaying structures", 
                "overgrown ruins", 
                "makeshift technology", 
                "scavenged equipment"
            ],
            "contemporain": [
                "urban environment", 
                "modern architecture", 
                "everyday objects", 
                "realistic textures"
            ],
            "steampunk": [
                "brass mechanisms", 
                "steam-powered devices", 
                "clockwork components", 
                "victorian fashion"
            ],
            "cyberpunk": [
                "neon lighting", 
                "cybernetic implants", 
                "virtual reality", 
                "corporate megastructures"
            ],
            "mythologique": [
                "divine light", 
                "ancient temples", 
                "mythical beasts", 
                "godly attributes"
            ],
            "historique": [
                "period-accurate details", 
                "historical landmarks", 
                "authentic costumes", 
                "traditional weapons"
            ]
        };
        
        // Parcourir chaque page du storyboard
        storyboard.pages.forEach(page => {
            // Parcourir chaque case de la page
            page.cases.forEach((caseItem, index) => {
                // Sélectionner un style artistique adapté à l'univers
                let artStyles = artStylesParUnivers[univers.type] || artStylesParUnivers["contemporain"];
                const style = artStyles[Math.floor(Math.random() * artStyles.length)];
                
                // Sélectionner des éléments visuels de base (2-3 éléments)
                const elementsDeBase = [];
                const numElementsDeBase = 2 + Math.floor(Math.random() * 2);
                for (let i = 0; i < numElementsDeBase; i++) {
                    const element = elementsVisuelsDeBase[Math.floor(Math.random() * elementsVisuelsDeBase.length)];
                    if (!elementsDeBase.includes(element)) {
                        elementsDeBase.push(element);
                    }
                }
                
                // Sélectionner des éléments visuels spécifiques à l'univers (1-2 éléments)
                const elementsSpecifiques = [];
                const elementsSpecifiquesListe = elementsVisuelsSpecifiques[univers.type] || elementsVisuelsSpecifiques["contemporain"];
                const numElementsSpecifiques = 1 + Math.floor(Math.random() * 2);
                for (let i = 0; i < numElementsSpecifiques; i++) {
                    const element = elementsSpecifiquesListe[Math.floor(Math.random() * elementsSpecifiquesListe.length)];
                    if (!elementsSpecifiques.includes(element)) {
                        elementsSpecifiques.push(element);
                    }
                }
                
                // Extraire les informations clés de la case
                const description = caseItem.description;
                const dialogue = caseItem.dialogue;
                
                // Créer une description en anglais pour le prompt
                let promptDescription = "";
                
                // Analyser la description pour extraire les éléments visuels importants
                if (description.includes("Plan large")) {
                    promptDescription += "wide shot, ";
                } else if (description.includes("Plan moyen")) {
                    promptDescription += "medium shot, ";
                } else if (description.includes("Gros plan")) {
                    promptDescription += "close-up, ";
                } else if (description.includes("Plan d'ensemble")) {
                    promptDescription += "establishing shot, ";
                } else if (description.includes("Contre-plongée")) {
                    promptDescription += "low angle shot, ";
                } else if (description.includes("Plongée")) {
                    promptDescription += "high angle shot, ";
                }
                
                // Ajouter des détails sur les personnages présents
                if (caseItem.personnages && caseItem.personnages.length > 0) {
                    promptDescription += "characters: ";
                    
                    caseItem.personnages.forEach((nom, i) => {
                        const personnage = personnages.find(p => p.nom === nom);
                        if (personnage) {
                            promptDescription += personnage.nom.split(" ")[0];
                            if (i < caseItem.personnages.length - 1) {
                                promptDescription += ", ";
                            }
                        }
                    });
                    
                    promptDescription += ", ";
                }
                
                // Ajouter une référence au dialogue si présent
                if (dialogue && dialogue.length > 0) {
                    if (dialogue.includes("!")) {
                        promptDescription += "dramatic moment, intense expression, ";
                    } else if (dialogue.includes("?")) {
                        promptDescription += "questioning look, curious expression, ";
                    } else {
                        promptDescription += "conversational scene, ";
                    }
                }
                
                // Créer le prompt complet pour Midjourney
                const promptComplet = `${style}, ${elementsDeBase.join(", ")}, ${elementsSpecifiques.join(", ")}, ${promptDescription} scene from ${chapterTitle}`;
                
                // Ajouter le prompt à la liste
                const prompt = {
                    case: `Page ${page.pageNumber}, Case ${index + 1}`,
                    description: caseItem.description,
                    dialogue: caseItem.dialogue,
                    prompt: promptComplet
                };
                
                prompts.push(prompt);
            });
        });
        
        return prompts;
    } catch (error) {
        console.error("Erreur lors de la génération des prompts:", error);
        return [];
    }
}
