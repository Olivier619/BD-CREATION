/**
 * Fonction pour générer des prompts détaillés pour Midjourney à partir d'un storyboard
 * Cette fonction remplacera la fonction generatePrompts actuelle
 */
async function generatePromptsDetailles(storyboard) {
    try {
        console.log("Génération des prompts détaillés pour le storyboard");
        
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
                "epic fantasy illustration",
                "heroic fantasy art style",
                "fantasy concept art",
                "detailed fantasy illustration"
            ],
            "science-fiction": [
                "sci-fi concept art", 
                "futuristic digital illustration", 
                "space opera style", 
                "cyberpunk digital art",
                "hard sci-fi illustration",
                "technological futurism art",
                "space exploration concept art"
            ],
            "post-apocalyptique": [
                "post-apocalyptic concept art", 
                "wasteland illustration", 
                "dystopian ruins art", 
                "survival horror style",
                "desolate landscape illustration",
                "post-disaster concept art",
                "ruined civilization illustration"
            ],
            "contemporain": [
                "modern illustration style", 
                "realistic contemporary art", 
                "urban lifestyle illustration", 
                "slice of life art style",
                "photorealistic illustration",
                "modern concept art",
                "contemporary graphic novel style"
            ],
            "steampunk": [
                "steampunk illustration", 
                "victorian sci-fi art", 
                "clockwork mechanism style", 
                "brass and steam aesthetic",
                "neo-victorian concept art",
                "industrial revolution fantasy",
                "retro-futuristic illustration"
            ],
            "cyberpunk": [
                "cyberpunk digital art", 
                "neon noir illustration", 
                "high tech low life style", 
                "digital dystopia concept art",
                "cyber aesthetic illustration",
                "technological dystopia art",
                "neon-soaked urban concept"
            ],
            "mythologique": [
                "mythological illustration", 
                "classical mythology art", 
                "ancient legends style", 
                "epic myth concept art",
                "godlike beings illustration",
                "mythic heroes art style",
                "legendary creatures concept art"
            ],
            "historique": [
                "historical illustration", 
                "period accurate art", 
                "historical realism style", 
                "authentic historical concept art",
                "historical scene painting",
                "period costume illustration",
                "historical event concept art"
            ],
            "dystopique": [
                "dystopian concept art", 
                "authoritarian future illustration", 
                "oppressive regime style", 
                "societal control art",
                "bleak future illustration",
                "dystopian society concept art",
                "totalitarian aesthetic"
            ],
            "utopique": [
                "utopian concept art", 
                "idealistic future illustration", 
                "harmonious society style", 
                "perfect world art",
                "advanced civilization illustration",
                "peaceful future concept art",
                "enlightened society aesthetic"
            ]
        };
        
        // Éléments visuels de base pour tous les types d'univers
        const elementsVisuelsDeBase = [
            "detailed", 
            "high quality", 
            "professional lighting", 
            "dynamic composition",
            "dramatic perspective",
            "expressive characters",
            "rich background details",
            "cinematic framing",
            "strong contrast",
            "emotional impact",
            "vivid colors",
            "intricate details",
            "atmospheric",
            "high resolution",
            "masterful technique"
        ];
        
        // Éléments visuels spécifiques selon le type d'univers
        const elementsVisuelsSpecifiques = {
            "médiéval-fantastique": [
                "magical atmosphere", 
                "ancient runes", 
                "mystical creatures", 
                "enchanted artifacts",
                "medieval architecture",
                "fantasy landscapes",
                "ornate armor and weapons"
            ],
            "science-fiction": [
                "holographic displays", 
                "advanced technology", 
                "alien landscapes", 
                "spacecraft interiors",
                "futuristic cityscape",
                "energy weapons",
                "artificial intelligence interfaces"
            ],
            "post-apocalyptique": [
                "decaying structures", 
                "overgrown ruins", 
                "makeshift technology", 
                "scavenged equipment",
                "toxic environment",
                "survival gear",
                "wasteland vehicles"
            ],
            "contemporain": [
                "urban environment", 
                "modern architecture", 
                "everyday objects", 
                "realistic textures",
                "contemporary fashion",
                "familiar settings",
                "current technology"
            ],
            "steampunk": [
                "brass mechanisms", 
                "steam-powered devices", 
                "clockwork components", 
                "victorian fashion",
                "airships and dirigibles",
                "mechanical contraptions",
                "industrial revolution aesthetic"
            ],
            "cyberpunk": [
                "neon lighting", 
                "cybernetic implants", 
                "virtual reality", 
                "corporate megastructures",
                "digital interfaces",
                "urban decay",
                "augmented reality overlays"
            ],
            "mythologique": [
                "divine light", 
                "ancient temples", 
                "mythical beasts", 
                "godly attributes",
                "heroic proportions",
                "symbolic imagery",
                "legendary artifacts"
            ],
            "historique": [
                "period-accurate details", 
                "historical landmarks", 
                "authentic costumes", 
                "traditional weapons",
                "historical events",
                "cultural artifacts",
                "architectural accuracy"
            ],
            "dystopique": [
                "surveillance equipment", 
                "propaganda displays", 
                "uniform aesthetics", 
                "restricted zones",
                "social stratification",
                "conformity symbols",
                "state control imagery"
            ],
            "utopique": [
                "harmonious design", 
                "advanced sustainable technology", 
                "natural integration", 
                "communal spaces",
                "elegant architecture",
                "abundant resources",
                "peaceful coexistence"
            ]
        };
        
        // Parcourir chaque page du storyboard
        storyboard.pages.forEach(page => {
            // Parcourir chaque case de la page
            page.cases.forEach((caseItem, index) => {
                // Sélectionner un style artistique adapté à l'univers
                let artStyles = artStylesParUnivers[univers.type] || artStylesParUnivers["contemporain"];
                const style = artStyles[Math.floor(Math.random() * artStyles.length)];
                
                // Sélectionner des éléments visuels de base (3-4 éléments)
                const elementsDeBase = selectionnerElementsAleatoires(elementsVisuelsDeBase, 3, 4);
                
                // Sélectionner des éléments visuels spécifiques à l'univers (2-3 éléments)
                const elementsSpecifiques = selectionnerElementsAleatoires(
                    elementsVisuelsSpecifiques[univers.type] || elementsVisuelsSpecifiques["contemporain"], 
                    2, 
                    3
                );
                
                // Extraire les informations clés de la case
                const description = caseItem.description;
                const dialogue = caseItem.dialogue;
                const personnagesCase = caseItem.personnages || [];
                
                // Créer une description détaillée pour le prompt
                let promptDescription = creerDescriptionPrompt(
                    description, 
                    dialogue, 
                    personnagesCase, 
                    personnages, 
                    univers
                );
                
                // Créer le prompt complet pour Midjourney
                const promptComplet = `${style}, ${elementsDeBase.join(", ")}, ${elementsSpecifiques.join(", ")}, ${promptDescription}`;
                
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
        console.error("Erreur lors de la génération des prompts détaillés:", error);
        return null;
    }
}

/**
 * Sélectionne un nombre aléatoire d'éléments dans une liste
 */
function selectionnerElementsAleatoires(liste, min, max) {
    const nombreElements = Math.floor(Math.random() * (max - min + 1)) + min;
    const elements = [];
    const listeCopiee = [...liste];
    
    for (let i = 0; i < nombreElements && listeCopiee.length > 0; i++) {
        const index = Math.floor(Math.random() * listeCopiee.length);
        elements.push(listeCopiee[index]);
        listeCopiee.splice(index, 1);
    }
    
    return elements;
}

/**
 * Crée une description détaillée pour le prompt Midjourney
 */
function creerDescriptionPrompt(description, dialogue, personnagesCase, personnages, univers) {
    // Extraire les éléments clés de la description
    let promptDescription = "";
    
    // Analyser la description pour extraire les éléments visuels importants
    const elementsVisuels = extraireElementsVisuels(description);
    promptDescription += elementsVisuels.join(", ");
    
    // Ajouter des détails sur les personnages présents
    if (personnagesCase && personnagesCase.length > 0) {
        promptDescription += ", ";
        
        const detailsPersonnages = personnagesCase.map(nom => {
            const personnage = personnages.find(p => p.nom === nom);
            if (personnage) {
                return `${personnage.nom.split(" ")[0]} (${personnage.apparence}, ${personnage.traitDistinctif})`;
            }
            return nom;
        });
        
        promptDescription += detailsPersonnages.join(", ");
    }
    
    // Ajouter des détails sur l'ambiance et l'éclairage
    const ambianceEtEclairage = extraireAmbianceEtEclairage(description);
    if (ambianceEtEclairage) {
        promptDescription += `, ${ambianceEtEclairage}`;
    }
    
    // Ajouter des détails sur le lieu
    if (univers && univers.type) {
        const detailsLieu = getDetailsLieuPourPrompt(univers.type);
        promptDescription += `, ${detailsLieu}`;
    }
    
    // Ajouter une référence au dialogue si présent
    if (dialogue && dialogue.length > 0) {
        const emotion = extraireEmotionDuDialogue(dialogue);
        if (emotion) {
            promptDescription += `, ${emotion} expression`;
        }
    }
    
    return promptDescription;
}

/**
 * Extrait les éléments visuels importants d'une description
 */
function extraireElementsVisuels(description) {
    const elementsVisuels = [];
    
    // Extraire le type de plan/cadrage
    const cadrages = [
        "Plan large", "Plan moyen", "Gros plan", "Plan d'ensemble", 
        "Contre-plongée", "Plongée", "Plan séquence"
    ];
    
    for (const cadrage of cadrages) {
        if (description.includes(cadrage)) {
            // Convertir en anglais pour Midjourney
            const cadrageTraduit = traduireCadrage(cadrage);
            elementsVisuels.push(cadrageTraduit);
            break;
        }
    }
    
    // Extraire les actions principales
    const actions = [
        "observe", "regarde", "avance", "recule", "court", "marche", 
        "saute", "tombe", "combat", "parle", "crie", "murmure", 
        "s'assoit", "se lève", "entre", "sort", "découvre", "révèle"
    ];
    
    for (const action of actions) {
        if (description.toLowerCase().includes(action)) {
            elementsVisuels.push(`character ${traduireAction(action)}`);
            break;
        }
    }
    
    // Extraire les expressions émotionnelles
    const emotions = [
        "surprise", "peur", "colère", "joie", "tristesse", 
        "dégoût", "mépris", "curiosité", "détermination", "confusion"
    ];
    
    for (const emotion of emotions) {
        if (description.toLowerCase().includes(emotion)) {
            elementsVisuels.push(`${traduireEmotion(emotion)} expression`);
            break;
        }
    }
    
    return elementsVisuels;
}

/**
 * Traduit un type de cadrage en anglais pour Midjourney
 */
function traduireCadrage(cadrage) {
    const traductions = {
        "Plan large": "wide shot",
        "Plan moyen": "medium shot",
        "Gros plan": "close-up",
        "Plan d'ensemble": "establishing shot",
        "Contre-plongée": "low angle shot",
        "Plongée": "high angle shot",
        "Plan séquence": "tracking shot"
    };
    
    return traductions[cadrage] || "dynamic composition";
}

/**
 * Traduit une action en anglais pour Midjourney
 */
function traduireAction(action) {
    const traductions = {
        "observe": "observing",
        "regarde": "looking",
        "avance": "moving forward",
        "recule": "stepping back",
        "court": "running",
        "marche": "walking",
        "saute": "jumping",
        "tombe": "falling",
        "combat": "fighting",
        "parle": "speaking",
        "crie": "shouting",
        "murmure": "whispering",
        "s'assoit": "sitting down",
        "se lève": "standing up",
        "entre": "entering",
        "sort": "exiting",
        "découvre": "discovering",
        "révèle": "revealing"
    };
    
    return traductions[action] || "acting";
}

/**
 * Traduit une émotion en anglais pour Midjourney
 */
function traduireEmotion(emotion) {
    const traductions = {
        "surprise": "surprised",
        "peur": "fearful",
        "colère": "angry",
        "joie": "joyful",
        "tristesse": "sad",
        "d<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>
