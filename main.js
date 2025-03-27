// Variables globales pour stocker les données du projet
let projectData = {
    keywords: "",
    scenario: null,
    storyboard: null,
    prompts: null
};

// Inclure les fonctions détaillées des fichiers externes
// Note: Ces fonctions sont définies dans les fichiers scenario_detaille.js, storyboard_detaille.js et prompts_detailles.js

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
            generateScenarioDetaille(keywords).then(scenario => {
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
            createStoryboardDetaille(scenario, chapterIndex).then(storyboard => {
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
            generatePromptsDetailles(storyboard).then(prompts => {
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
