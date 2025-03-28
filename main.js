// Solution tout-en-un pour BD Creator avec améliorations pour textes longs et prompts enrichis
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
                    alert('Veuillez entrer du texte pour inspirer votre BD.');
                    return;
                }
                
                // Stocker le texte complet dans localStorage pour l'utiliser dans d'autres pages
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
            // Limiter l'affichage à 100 caractères pour ne pas surcharger l'interface
            keywordsDisplay.textContent = keywords.length > 100 ? 
                keywords.substring(0, 100) + "..." : 
                keywords;
        }
        
        // Vérifier si nous venons d'une nouvelle session ou d'un rechargement normal
        const urlParams = new URLSearchParams(window.location.search);
        const isNewSession = urlParams.has('new');
        
        // Vérifier si un scénario existe déjà dans le localStorage
        const existingScenario = localStorage.getItem('bdScenario');
        
        // Forcer la régénération du scénario si c'est une nouvelle session ou si aucun scénario n'existe
        if (isNewSession || !existingScenario) {
            console.log("Génération d'un nouveau scénario (nouvelle session ou premier chargement)");
            
            // Générer et afficher le scénario avec la fonction améliorée pour textes longs
            generateScenario(keywords).then(scenario => {
                projectData.scenario = scenario;
                displayScenario(scenario);
                
                // Sauvegarder le scénario dans localStorage
                localStorage.setItem('bdScenario', JSON.stringify(scenario));
                
                // Mettre à jour le gestionnaire de session
                if (window.sessionManager) {
                    window.sessionManager.updateCurrentSession({
                        scenario: scenario
                    });
                }
            });
        } else {
            console.log("Chargement d'un scénario existant");
            try {
                const scenario = JSON.parse(existingScenario);
                projectData.scenario = scenario;
                displayScenario(scenario);
            } catch (e) {
                console.error("Erreur lors du chargement du scénario:", e);
                // En cas d'erreur, générer un nouveau scénario
                generateScenario(keywords).then(scenario => {
                    projectData.scenario = scenario;
                    displayScenario(scenario);
                    localStorage.setItem('bdScenario', JSON.stringify(scenario));
                });
            }
        }
    }
    
    // Vérifier si nous sommes sur la page de storyboard
    const storyboardContainer = document.getElementById('storyboard-container');
    if (storyboardContainer) {
        // Récupérer le scénario depuis localStorage
        const scenarioData = localStorage.getItem('bdScenario');
        if (scenarioData) {
            try {
                const scenario = JSON.parse(scenarioData);
                projectData.scenario = scenario;
                
                // Vérifier si un storyboard existe déjà dans localStorage
                const existingStoryboard = localStorage.getItem('bdStoryboard');
                if (existingStoryboard) {
                    try {
                        const storyboard = JSON.parse(existingStoryboard);
                        projectData.storyboard = storyboard;
                        displayStoryboard(storyboard);
                    } catch (e) {
                        console.error("Erreur lors du chargement du storyboard:", e);
                        createStoryboard(scenario).then(storyboard => {
                            projectData.storyboard = storyboard;
                            displayStoryboard(storyboard);
                            localStorage.setItem('bdStoryboard', JSON.stringify(storyboard));
                        });
                    }
                } else {
                    // Créer et afficher le storyboard
                    createStoryboard(scenario).then(storyboard => {
                        projectData.storyboard = storyboard;
                        displayStoryboard(storyboard);
                        localStorage.setItem('bdStoryboard', JSON.stringify(storyboard));
                        
                        // Mettre à jour le gestionnaire de session
                        if (window.sessionManager) {
                            window.sessionManager.updateCurrentSession({
                                storyboard: storyboard
                            });
                        }
                    });
                }
            } catch (e) {
                console.error("Erreur lors du chargement du scénario pour le storyboard:", e);
                storyboardContainer.innerHTML = "<p>Erreur: Veuillez d'abord générer un scénario.</p>";
            }
        } else {
            storyboardContainer.innerHTML = "<p>Veuillez d'abord générer un scénario.</p>";
        }
    }
    
    // Vérifier si nous sommes sur la page de prompts
    const promptsContainer = document.getElementById('prompts-container');
    if (promptsContainer) {
        // Récupérer le storyboard depuis localStorage
        const storyboardData = localStorage.getItem('bdStoryboard');
        if (storyboardData) {
            try {
                const storyboard = JSON.parse(storyboardData);
                projectData.storyboard = storyboard;
                
                // Vérifier si des prompts existent déjà dans localStorage
                const existingPrompts = localStorage.getItem('bdPrompts');
                if (existingPrompts) {
                    try {
                        const prompts = JSON.parse(existingPrompts);
                        projectData.prompts = prompts;
                        displayPrompts(prompts);
                    } catch (e) {
                        console.error("Erreur lors du chargement des prompts:", e);
                        generatePrompts(storyboard).then(prompts => {
                            projectData.prompts = prompts;
                            displayPrompts(prompts);
                            localStorage.setItem('bdPrompts', JSON.stringify(prompts));
                        });
                    }
                } else {
                    // Générer et afficher les prompts avec la fonction enrichie
                    generatePrompts(storyboard).then(prompts => {
                        projectData.prompts = prompts;
                        displayPrompts(prompts);
                        localStorage.setItem('bdPrompts', JSON.stringify(prompts));
                        
                        // Mettre à jour le gestionnaire de session
                        if (window.sessionManager) {
                            window.sessionManager.updateCurrentSession({
                                prompts: prompts
                            });
                        }
                    });
                }
            } catch (e) {
                console.error("Erreur lors du chargement du storyboard pour les prompts:", e);
                promptsContainer.innerHTML = "<p>Erreur: Veuillez d'abord créer un storyboard.</p>";
            }
        } else {
            promptsContainer.innerHTML = "<p>Veuillez d'abord créer un storyboard.</p>";
        }
    }
});

// Fonction pour analyser un texte complet et en extraire les éléments narratifs
async function analyzeFullText(text) {
    console.log("Analyse du texte complet...");
    
    // Extraire les thèmes principaux
    const themes = [];
    const themeKeywords = [
        "aventure", "amour", "amitié", "trahison", "guerre", "paix", "famille", 
        "pouvoir", "magie", "technologie", "nature", "voyage", "quête", "mystère",
        "science", "histoire", "futur", "passé", "fantaisie", "réalité"
    ];
    
    themeKeywords.forEach(keyword => {
        if (text.toLowerCase().includes(keyword)) {
            themes.push(keyword);
        }
    });
    
    // Extraire les personnages potentiels (noms propres)
    const characterRegex = /\b[A-Z][a-z]+\b/g;
    const potentialCharacters = text.match(characterRegex) || [];
    const characters = [...new Set(potentialCharacters)].slice(0, 5); // Éliminer les doublons et limiter à 5
    
    // Extraire les lieux potentiels
    const locationKeywords = [
        "ville", "village", "château", "forêt", "montagne", "mer", "océan", 
        "planète", "galaxie", "univers", "royaume", "pays", "continent", "île"
    ];
    
    const locations = [];
    locationKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b\\s+[a-zA-Z]+`, 'gi');
        const matches = text.match(regex) || [];
        locations.push(...matches);
    });
    
    // Analyser la structure narrative potentielle
    const narrativeStructure = {
        hasIntroduction: text.length > 200,
        hasDevelopment: text.length > 400,
        hasConclusion: text.length > 600,
        hasConflict: /conflit|problème|difficulté|obstacle|ennemi|adversaire|défi/i.test(text),
        hasResolution: /résolution|solution|victoire|succès|réussite|fin/i.test(text)
    };
    
    // Extraire les émotions dominantes
    const emotionKeywords = {
        "joie": /joie|bonheur|heureux|content|rire|sourire/i,
        "tristesse": /triste|peine|chagrin|larme|pleurer|mélancolie/i,
        "colère": /colère|fureur|rage|énervé|irrité|fâché/i,
        "peur": /peur|terreur|effroi|effrayé|angoisse|anxiété/i,
        "surprise": /surprise|étonnement|choc|stupéfaction|inattendu/i,
        "dégoût": /dégoût|répulsion|aversion|répugnance|écœurement/i
    };
    
    const emotions = [];
    for (const [emotion, regex] of Object.entries(emotionKeywords)) {
        if (regex.test(text)) {
            emotions.push(emotion);
        }
    }
    
    return {
        themes: themes.length > 0 ? themes : ["aventure", "mystère"],
        characters: characters.length > 0 ? characters : ["Héros anonyme"],
        locations: locations.length > 0 ? locations : ["lieu inconnu"],
        narrativeStructure,
        emotions: emotions.length > 0 ? emotions : ["surprise", "joie"],
        textLength: text.length,
        complexity: text.length > 500 ? "complexe" : "simple"
    };
}

// Fonction améliorée pour générer un scénario détaillé à partir d'un texte complet
async function generateScenario(keywords) {
    console.log("Génération du scénario à partir du texte complet...");
    
    // Analyser le texte complet pour en extraire les éléments narratifs
    const textAnalysis = await analyzeFullText(keywords);
    
    // Générer un titre basé sur les thèmes et personnages identifiés
    const titles = [
        `Les Chroniques de ${textAnalysis.characters[0] || "l'Inconnu"}`,
        `Le Secret de ${textAnalysis.locations[0] || "l'Autre Monde"}`,
        `La Quête de ${textAnalysis.characters[0] || "l'Aventurier"}`,
        `${textAnalysis.themes[0] || "Mystère"} et ${textAnalysis.themes[1] || "Aventure"}`,
        `Le Dernier ${textAnalysis.themes[0] || "Voyage"}`,
        `L'Éveil de ${textAnalysis.characters[0] || "l'Héroïne"}`,
        `Au-delà de ${textAnalysis.locations[0] || "l'Horizon"}`
    ];
    
    // Sélectionner un titre aléatoirement
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    // Déterminer le nombre de chapitres en fonction de la complexité du texte
    const numChapters = textAnalysis.complexity === "complexe" ? 5 : 3;
    
    // Créer un univers cohérent basé sur les thèmes identifiés
    const universeTypes = {
        "aventure": "Un monde d'exploration et de découvertes",
        "amour": "Un univers où les émotions sont tangibles",
        "amitié": "Une société basée sur les liens entre individus",
        "trahison": "Un monde de complots et d'intrigues politiques",
        "guerre": "Un univers déchiré par des conflits ancestraux",
        "paix": "Une utopie fragile menacée par des forces obscures",
        "famille": "Un monde où les lignées déterminent le destin",
        "pouvoir": "Un univers où la magie ou la technologie confère puissance et responsabilité",
        "magie": "Un monde imprégné de forces mystiques et anciennes",
        "technologie": "Un futur où la science a transformé la société",
        "nature": "Un univers où la nature et les êtres vivants sont interconnectés",
        "voyage": "Un monde de portails et de dimensions parallèles",
        "quête": "Un univers où chacun cherche sa destinée",
        "mystère": "Un monde plein de secrets et d'énigmes à résoudre",
        "science": "Un univers où la connaissance est la plus grande richesse",
        "histoire": "Un monde où le passé influence constamment le présent",
        "futur": "Une vision de ce que pourrait devenir notre société",
        "passé": "Un univers inspiré d'époques révolues mais réinventées",
        "fantaisie": "Un monde où l'impossible devient possible",
        "réalité": "Un univers qui reflète notre monde avec un twist"
    };
    
    // Sélectionner le type d'univers en fonction des thèmes identifiés
    const universeType = textAnalysis.themes[0] && universeTypes[textAnalysis.themes[0]] 
        ? universeTypes[textAnalysis.themes[0]] 
        : "Un monde mystérieux plein de possibilités";
    
    // Créer une description détaillée de l'univers
    const universeDescription = `${universeType}. ${
        textAnalysis.locations.length > 0 
            ? `Ce monde comprend des lieux fascinants comme ${textAnalysis.locations.join(', ')}. ` 
            : "Ce monde regorge de lieux fascinants et mystérieux. "
    }${
        textAnalysis.emotions.length > 0 
            ? `L'ambiance générale est teintée de ${textAnalysis.emotions.join(', ')}. ` 
            : "L'ambiance varie selon les régions et les situations. "
    }Les habitants de ce monde font face à de nombreux défis et opportunités.`;
    
    // Créer des personnages principaux basés sur l'analyse du texte
    const mainCharacters = [];
    
    // Utiliser les personnages identifiés ou créer des personnages génériques
    const identifiedCharacters = textAnalysis.characters.length > 0 ? textAnalysis.characters : ["Protagoniste"];
    
    // Archétypes de personnages
    const archetypes = [
        "héros", "mentor", "allié", "ennemi", "figure changeante", "messager", "ombre"
    ];
    
    // Traits de personnalité
    const personalityTraits = [
        "courageux", "intelligent", "loy<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>
