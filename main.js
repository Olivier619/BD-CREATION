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
        
        // Dans une version réelle, ceci serait un appel à une API
        // Ici, nous simulons une réponse
        const scenario = {
            title: "L'Aventure Mystérieuse",
            theme: keywords,
            chapters: [
                {
                    title: "Le Début du Voyage",
                    summary: "Notre héros découvre un mystérieux artefact qui va changer sa vie.",
                    pages: 10
                },
                {
                    title: "Rencontres Inattendues",
                    summary: "De nouveaux alliés et ennemis apparaissent sur le chemin.",
                    pages: 12
                },
                {
                    title: "L'Épreuve du Feu",
                    summary: "Face à l'adversité, notre héros doit faire preuve de courage.",
                    pages: 8
                },
                {
                    title: "Révélations",
                    summary: "Des secrets longtemps cachés sont enfin révélés.",
                    pages: 10
                },
                {
                    title: "Le Dénouement",
                    summary: "La confrontation finale et la résolution de l'aventure.",
                    pages: 8
                }
            ]
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
        
        // Simulation de création de storyboard
        const pages = [];
        const pagesCount = scenario.chapters[chapterIndex].pages;
        
        for (let i = 0; i < pagesCount; i++) {
            const casesCount = Math.floor(Math.random() * 5) + 3; // Entre 3 et 7 cases
            const cases = [];
            
            for (let j = 0; j < casesCount; j++) {
                cases.push({
                    description: `Description visuelle de la case ${j+1} de la page ${i+1}`,
                    dialogue: `Dialogue pour la case ${j+1}`
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
        
        storyboard.pages.forEach(page => {
            page.cases.forEach((caseItem, index) => {
                // Création d'un prompt Midjourney structuré sans la commande /imagine ni le paramètre --v 5.2
                const prompt = {
                    case: `Page ${page.pageNumber}, Case ${index + 1}`,
                    description: caseItem.description,
                    prompt: `comic book style, detailed, professional lighting ${caseItem.description}`
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
        
        // Générer et afficher le scénario
        generateScenario(keywords).then(scenario => {
            projectData.scenario = scenario;
            localStorage.setItem('bdScenario', JSON.stringify(scenario));
            
            // Afficher le scénario
            displayScenario(scenario);
        });
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
