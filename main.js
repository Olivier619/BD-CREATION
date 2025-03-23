// Variables globales pour stocker les données du projet
let projectData = {
    keywords: "",
    scenario: null,
    storyboard: null,
    prompts: null
};

// Fonction pour générer un scénario à partir des mots-clés
async function generateScenario(keywords) {
    try {
        // Simulation d'une requête API
        console.log("Génération du scénario à partir de : " + keywords);
        
        // Ajouter un facteur d'aléatoire supplémentaire pour garantir l'unicité du scénario
        // même avec les mêmes mots-clés
        const randomSeed = Date.now() + Math.floor(Math.random() * 10000);
        console.log("Seed aléatoire pour la génération du scénario : " + randomSeed);
        
        // Utiliser les mots-clés pour influencer le scénario
        const keywordsList = keywords.split(/[ ,]+/).filter(k => k.length > 0);
        
        // Générer un titre aléatoire basé sur les mots-clés
        const titlePrefixes = ["L'Aventure", "Le Mystère", "La Quête", "Le Voyage", "L'Odyssée", "Le Secret"];
        const titleSuffixes = ["Mystérieuse", "Extraordinaire", "Fantastique", "Incroyable", "Légendaire", "Oubliée"];
        
        // Utiliser le seed aléatoire pour sélectionner les éléments du titre
        const randomPrefix = titlePrefixes[Math.floor((randomSeed % 100) / 100 * titlePrefixes.length)];
        const randomSuffix = titleSuffixes[Math.floor((randomSeed % 200) / 200 * titleSuffixes.length)];
        
        // Utiliser un mot-clé dans le titre si disponible
        let title = `${randomPrefix} ${randomSuffix}`;
        if (keywordsList.length > 0) {
            const keywordForTitle = keywordsList[Math.floor((randomSeed % 300) / 300 * keywordsList.length)];
            title = `${randomPrefix} ${keywordForTitle.charAt(0).toUpperCase() + keywordForTitle.slice(1)} ${randomSuffix}`;
        }
        
        // Générer des chapitres aléatoires
        const chapterTitles = [
            "Le Début du Voyage", "Rencontres Inattendues", "L'Épreuve du Feu", 
            "Révélations", "Le Dénouement", "La Découverte", "Le Conflit", 
            "L'Alliance", "La Trahison", "La Confrontation", "La Transformation"
        ];
        
        const chapterSummaries = [
            "Notre héros découvre un mystérieux artefact qui va changer sa vie.",
            "De nouveaux alliés et ennemis apparaissent sur le chemin.",
            "Face à l'adversité, notre héros doit faire preuve de courage.",
            "Des secrets longtemps cachés sont enfin révélés.",
            "La confrontation finale et la résolution de l'aventure.",
            "Une découverte inattendue bouleverse tous les plans.",
            "Un conflit éclate entre les différents protagonistes.",
            "Une alliance stratégique se forme pour affronter un danger commun.",
            "Une trahison inattendue met en péril toute la mission.",
            "Le moment de vérité arrive avec une confrontation inévitable.",
            "Une transformation profonde s'opère chez le personnage principal."
        ];
        
        // Déterminer le nombre de chapitres (entre 4 et 6)
        const numChapters = Math.floor((randomSeed % 400) / 400 * 3) + 4;
        
        // Créer des chapitres uniques
        const usedIndices = new Set();
        const chapters = [];
        
        for (let i = 0; i < numChapters; i++) {
            let index;
            do {
                index = Math.floor((randomSeed % (500 + i * 100)) / (500 + i * 100) * chapterTitles.length);
            } while (usedIndices.has(index));
            
            usedIndices.add(index);
            
            // Générer un nombre de pages aléatoire entre 6 et 12
            const pages = Math.floor((randomSeed % (600 + i * 100)) / (600 + i * 100) * 7) + 6;
            
            // Créer des descriptions détaillées en incorporant les mots-clés
            let summary = chapterSummaries[index];
            
            // Ajouter des détails sur les intervenants et les lieux
            const characters = ["un héros courageux", "une héroïne mystérieuse", "un sage mentor", "un antagoniste menaçant", "un allié inattendu"];
            const locations = ["dans une forêt dense", "au cœur d'une ville animée", "dans un château abandonné", "sur une île lointaine", "dans un temple ancien"];
            const expressions = ["avec détermination", "montrant de la peur", "souriant avec confiance", "regardant avec méfiance", "observant attentivement"];
            
            const randomCharacter = characters[Math.floor((randomSeed % (700 + i * 100)) / (700 + i * 100) * characters.length)];
            const randomLocation = locations[Math.floor((randomSeed % (800 + i * 100)) / (800 + i * 100) * locations.length)];
            const randomExpression = expressions[Math.floor((randomSeed % (900 + i * 100)) / (900 + i * 100) * expressions.length)];
            
            // Incorporer un mot-clé si disponible
            if (keywordsList.length > 0) {
                const keywordForSummary = keywordsList[Math.floor((randomSeed % (1000 + i * 100)) / (1000 + i * 100) * keywordsList.length)];
                summary += ` ${randomCharacter} se trouve ${randomLocation} et fait face à un défi lié à ${keywordForSummary}, ${randomExpression}.`;
            } else {
                summary += ` ${randomCharacter} se trouve ${randomLocation}, ${randomExpression}.`;
            }
            
            chapters.push({
                title: chapterTitles[index],
                summary: summary,
                pages: pages
            });
        }
        
        // Trier les chapitres pour avoir une progression logique
        chapters.sort((a, b) => {
            const aIndex = chapterTitles.indexOf(a.title);
            const bIndex = chapterTitles.indexOf(b.title);
            return aIndex - bIndex;
        });
        
        const scenario = {
            title: title,
            theme: keywords,
            chapters: chapters,
            generatedAt: Date.now() // Ajouter un horodatage pour garantir l'unicité
        };
        
        return scenario;
    } catch (error) {
        console.error("Erreur lors de la génération du scénario:", error);
        return null;
    }
}

// Fonction pour créer un storyboard à partir d'un scénario
async function createStoryboard(scenario, chapterIndex) {
    try {
        console.log("Création du storyboard pour le chapitre: " + scenario.chapters[chapterIndex].title);
        
        // Extraire des éléments du thème pour les utiliser dans les descriptions
        const themeElements = scenario.theme.split(/[ ,]+/).filter(k => k.length > 0);
        
        // Simulation de création de storyboard
        const pages = [];
        const pagesCount = scenario.chapters[chapterIndex].pages;
        
        // Descriptions possibles pour les cases
        const visualDescriptions = [
            "Un personnage principal se tient debout, regardant au loin avec détermination",
            "Une vue panoramique d'un paysage impressionnant avec des personnages au premier plan",
            "Un gros plan sur le visage d'un personnage montrant une émotion intense",
            "Une scène d'action dynamique avec plusieurs personnages en mouvement",
            "Un moment de calme et de réflexion dans un cadre paisible",
            "Une rencontre tendue entre protagoniste et antagoniste",
            "Une découverte surprenante révélée dans un environnement mystérieux",
            "Un flashback montrant des événements passés importants",
            "Une scène de dialogue entre personnages principaux",
            "Un moment dramatique avec une révélation choquante"
        ];
        
        const dialogueTemplates = [
            "Je ne m'attendais pas à trouver cela ici !",
            "Nous devons agir rapidement avant qu'il ne soit trop tard.",
            "Je ne te fais pas confiance, mais nous n'avons pas le choix.",
            "Ce n'est que le début de notre aventure.",
            "Tout ce que nous connaissions était un mensonge.",
            "Cette découverte change absolument tout.",
            "Jamais je n'aurais imaginé en arriver là.",
            "Ensemble, nous pouvons surmonter cet obstacle.",
            "Il y a une explication logique à tout cela.",
            "Le moment est venu de révéler la vérité."
        ];
        
        for (let i = 0; i < pagesCount; i++) {
            const casesCount = Math.floor(Math.random() * 5) + 3; // Entre 3 et 7 cases
            const cases = [];
            
            // Assurer que les cases d'une page racontent une mini-histoire cohérente
            const pageStoryType = Math.floor(Math.random() * 3); // 0: découverte, 1: confrontation, 2: révélation
            
            for (let j = 0; j < casesCount; j++) {
                // Sélectionner une description de base
                let baseDesc = visualDescriptions[Math.floor(Math.random() * visualDescriptions.length)];
                let baseDialogue = dialogueTemplates[Math.floor(Math.random() * dialogueTemplates.length)];
                
                // Ajouter des éléments du thème si disponibles
                if (themeElements.length > 0) {
                    const element = themeElements[Math.floor(Math.random() * themeElements.length)];
                    
                    // Adapter la description selon le type d'histoire de la page
                    if (pageStoryType === 0) { // découverte
                        baseDesc = `${baseDesc} en découvrant un élément lié à ${element}`;
                    } else if (pageStoryType === 1) { // confrontation
                        baseDesc = `${baseDesc} face à un défi concernant ${element}`;
                    } else { // révélation
                        baseDesc = `${baseDesc} suite à une révélation à propos de ${element}`;
                    }
                    
                    // Adapter le dialogue
                    if (j === 0) {
                        baseDialogue = `Regardez ! C'est incroyable ce que nous avons trouvé à propos de ${element} !`;
                    } else if (j === casesCount - 1) {
                        baseDialogue = `Maintenant nous savons ce que nous devons faire avec ${element}.`;
                    }
                }
                
                // Progression de l'histoire dans la page
                const progress = j / (casesCount - 1); // 0 au début, 1 à la fin
                
                if (progress < 0.3) {
                    baseDesc = `Introduction: ${baseDesc}`;
                } else if (progress < 0.7) {
                    baseDesc = `Développement: ${baseDesc}`;
                } else {
                    baseDesc = `Conclusion: ${baseDesc}`;
                }
                
                cases.push({
                    description: baseDesc,
                    dialogue: baseDialogue
                });
            }
            
            pages.push({
                pageNumber: i + 1,
                cases: cases
            });
        }
        
        return {
            chapterTitle: scenario.chapters[chapterIndex].title,
            pages: pages
        };
    } catch (error) {
        console.error("Erreur lors de la création du storyboard:", error);
        return null;
    }
}

// Fonction pour générer des prompts Midjourney à partir d'un storyboard
async function generatePrompts(storyboard) {
    try {
        console.log("Génération des prompts pour le storyboard");
        
        const prompts = [];
        
        // Styles artistiques variés pour les prompts
        const artStyles = [
            "comic book style", 
            "manga style", 
            "watercolor illustration", 
            "digital art", 
            "realistic comic art",
            "cel shaded animation style",
            "graphic novel art",
            "cartoon style",
            "noir comic style",
            "vibrant comic art"
        ];
        
        // Éléments visuels pour enrichir les prompts
        const visualElements = [
            "detailed", 
            "professional lighting", 
            "dynamic composition",
            "dramatic perspective",
            "expressive characters",
            "rich background details",
            "cinematic framing",
            "strong contrast",
            "emotional impact",
            "vivid colors"
        ];
        
        storyboard.pages.forEach(page => {
            page.cases.forEach((caseItem, index) => {
                // Sélectionner aléatoirement un style artistique et des éléments visuels
                const style = artStyles[Math.floor(Math.random() * artStyles.length)];
                
                // Sélectionner 2-3 éléments visuels aléatoires
                const elements = [];
                const numElements = Math.floor(Math.random() * 2) + 2; // 2-3 éléments
                
                for (let i = 0; i < numElements; i++) {
                    let element;
                    do {
                        element = visualElements[Math.floor(Math.random() * visualElements.length)];
                    } while (elements.includes(element));
                    
                    elements.push(element);
                }
                
                // Création d'un prompt Midjourney structuré sans la commande /imagine ni le paramètre --v 5.2
                const prompt = {
                    case: `Page ${page.pageNumber}, Case ${index + 1}`,
                    description: caseItem.description,
                    prompt: `${style}, ${elements.join(", ")}, ${caseItem.description}`
                };
                
                prompts.push(prompt);
            });
        });
        
        return prompts;
    } catch (error) {
        console.error("Erreur lors de la génération des prompts:", error);
        return null;
    }
}

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
            
            // Générer et afficher le scénario
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
            
            // Créer et afficher le storyboard
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
            
            // Générer et afficher les prompts
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
    
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
    
    const backButton = document.createElement('button');
    backButton.textContent = 'Retour';
    backButton.className = 'button';
    backButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    const approveButton = document.createElement('button');
    approveButton.textContent = 'Approuver le scénario';
    approveButton.className = 'button success';
    approveButton.addEventListener('click', function() {
        localStorage.setItem('bdCreatorChapterIndex', "0");
        window.location.href = 'storyboard.html';
    });
    
    actionButtons.appendChild(backButton);
    actionButtons.appendChild(approveButton);
    
    container.appendChild(actionButtons);
}

// Fonction pour afficher le storyboard
function displayStoryboard(storyboard) {
    const container = document.getElementById('storyboard-container');
    container.innerHTML = '';
    
    storyboard.pages.forEach(page => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        
        const pageTitle = document.createElement('h3');
        pageTitle.textContent = `Page ${page.pageNumber}`;
        pageDiv.appendChild(pageTitle);
        
        const casesContainer = document.createElement('div');
        casesContainer.className = 'cases-container';
        
        page.cases.forEach((caseItem, index) => {
            const caseDiv = document.createElement('div');
            caseDiv.className = 'case';
            
            const caseTitle = document.createElement('h4');
            caseTitle.textContent = `Case ${index + 1}`;
            
            const caseDesc = document.createElement('p');
            caseDesc.textContent = caseItem.description;
            
            const caseDialogue = document.createElement('p');
            caseDialogue.innerHTML = `<strong>Dialogue:</strong> ${caseItem.dialogue}`;
            
            caseDiv.appendChild(caseTitle);
            caseDiv.appendChild(caseDesc);
            caseDiv.appendChild(caseDialogue);
            
            casesContainer.appendChild(caseDiv);
        });
        
        pageDiv.appendChild(casesContainer);
        container.appendChild(pageDiv);
    });
    
    // Ajouter un lien vers la page de prompts
    const promptsLink = document.getElementById('generate-prompts-link');
    if (promptsLink) {
        promptsLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'prompts.html';
        });
    }
}

// Fonction pour afficher les prompts
function displayPrompts(prompts) {
    const container = document.getElementById('prompts-container');
    container.innerHTML = '';
    
    prompts.forEach(prompt => {
        const promptDiv = document.createElement('div');
        promptDiv.className = 'prompt-box';
        
        const promptTitle = document.createElement('h3');
        promptTitle.textContent = prompt.case;
        
        const promptDesc = document.createElement('p');
        promptDesc.textContent = prompt.description;
        
        const promptText = document.createElement('div');
        promptText.className = 'prompt-text';
        
        const promptLabel = document.createElement('p');
        promptLabel.innerHTML = '<strong>Prompt Midjourney:</strong>';
        
        const promptTextarea = document.createElement('textarea');
        promptTextarea.value = prompt.prompt;
        promptTextarea.readOnly = true;
        promptTextarea.rows = 3;
        
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copier';
        copyButton.className = 'copy-button';
        copyButton.addEventListener('click', function() {
            // Utiliser l'API Clipboard moderne au lieu de document.execCommand
            navigator.clipboard.writeText(promptTextarea.value)
                .then(() => {
                    copyButton.textContent = 'Copié !';
                    setTimeout(() => {
                        copyButton.textContent = 'Copier';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erreur lors de la copie :', err);
                    alert('Erreur lors de la copie du texte. Veuillez réessayer.');
                });
        });
        
        promptText.appendChild(promptLabel);
        promptText.appendChild(promptTextarea);
        promptText.appendChild(copyButton);
        
        promptDiv.appendChild(promptTitle);
        promptDiv.appendChild(promptDesc);
        promptDiv.appendChild(promptText);
        
        container.appendChild(promptDiv);
    });
    
    // Ajouter un lien de retour au storyboard
    const backLink = document.getElementById('back-to-storyboard');
    if (backLink) {
        backLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'storyboard.html';
        });
    }
    
    const backLinkBottom = document.getElementById('back-to-storyboard-bottom');
    if (backLinkBottom) {
        backLinkBottom.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'storyboard.html';
        });
    }
}
