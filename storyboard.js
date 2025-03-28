/**
 * Fonction pour créer un storyboard détaillé à partir d'un scénario
 * Cette fonction remplacera la fonction createStoryboard actuelle
 */
async function createStoryboardDetaille(scenario, chapterIndex) {
    try {
        console.log("Création du storyboard détaillé pour le chapitre: " + scenario.chapters[chapterIndex].title);
        
        // Récupérer les informations du chapitre
        const chapitre = scenario.chapters[chapterIndex];
        const personnagesNoms = chapitre.personnages || [];
        const lieuPrincipal = chapitre.lieu;
        const acte = chapitre.acte;
        
        // Récupérer les personnages complets à partir de leurs noms
        const personnages = personnagesNoms.map(nom => {
            return scenario.personnages.find(p => p.nom === nom) || {
                nom: nom,
                archetype: "inconnu",
                description: "Un personnage mystérieux"
            };
        });
        
        // Récupérer les informations de l'univers
        const univers = scenario.univers;
        
        // Simulation de création de storyboard
        const pages = [];
        const pagesCount = chapitre.pages;
        
        // Créer une progression narrative pour le chapitre
        const progressionNarrative = creerProgressionNarrative(chapitre, acte);
        
        // Créer les pages du storyboard
        for (let i = 0; i < pagesCount; i++) {
            // Déterminer la phase narrative de cette page dans le chapitre
            const phaseIndex = Math.floor(i / pagesCount * progressionNarrative.length);
            const phaseNarrative = progressionNarrative[phaseIndex];
            
            // Déterminer le nombre de cases pour cette page (entre 3 et 7)
            // Les pages importantes (début, climax, fin) ont tendance à avoir plus de cases
            let casesCount;
            if (i === 0 || i === pagesCount - 1 || i === Math.floor(pagesCount / 2)) {
                casesCount = Math.floor(Math.random() * 3) + 5; // 5-7 cases
            } else {
                casesCount = Math.floor(Math.random() * 3) + 3; // 3-5 cases
            }
            
            // Créer les cases de la page
            const cases = creerCasesPage(casesCount, phaseNarrative, personnages, univers, lieuPrincipal, i, pagesCount);
            
            // Ajouter la page au storyboard
            pages.push({
                pageNumber: i + 1,
                cases: cases
            });
        }
        
        return {
            chapterTitle: chapitre.title,
            chapterSummary: chapitre.summary,
            pages: pages,
            personnages: personnages,
            lieu: lieuPrincipal,
            univers: univers
        };
    } catch (error) {
        console.error("Erreur lors de la création du storyboard détaillé:", error);
        return null;
    }
}

/**
 * Crée une progression narrative pour le chapitre
 */
function creerProgressionNarrative(chapitre, acte) {
    // Progression narrative selon l'acte
    const progressions = {
        "acte1": [
            "Introduction du cadre et des personnages",
            "Présentation de la situation initiale",
            "Perturbation de l'équilibre",
            "Réaction des personnages à l'événement déclencheur",
            "Décision d'agir face à la nouvelle situation"
        ],
        "acte2": [
            "Exploration du nouveau contexte",
            "Rencontre avec des obstacles",
            "Développement des relations entre personnages",
            "Complications et revers",
            "Moment de crise ou de doute",
            "Découverte d'une nouvelle information cruciale"
        ],
        "acte3": [
            "Préparation pour la confrontation finale",
            "Montée de la tension",
            "Confrontation décisive",
            "Résolution du conflit",
            "Conséquences et nouvel équilibre"
        ]
    };
    
    return progressions[acte];
}

/**
 * Crée les cases d'une page du storyboard
 */
function creerCasesPage(casesCount, phaseNarrative, personnages, univers, lieuPrincipal, pageIndex, pagesCount) {
    const cases = [];
    
    // Déterminer si cette page contient un moment clé
    const estMomentCle = pageIndex === 0 || pageIndex === pagesCount - 1 || pageIndex === Math.floor(pagesCount / 2);
    
    // Déterminer les personnages présents dans cette page
    // Pour les moments clés, inclure plus de personnages
    const nombrePersonnagesPage = estMomentCle ? 
        Math.min(personnages.length, 3) : 
        Math.min(Math.floor(Math.random() * 2) + 1, personnages.length);
    
    const personnagesPage = [];
    for (let i = 0; i < nombrePersonnagesPage; i++) {
        // Toujours inclure le protagoniste dans les moments clés
        if (estMomentCle && i === 0) {
            const protagoniste = personnages.find(p => p.archetype === "héros") || personnages[0];
            personnagesPage.push(protagoniste);
        } else {
            // Éviter les doublons
            let personnage;
            do {
                personnage = personnages[Math.floor(Math.random() * personnages.length)];
            } while (personnagesPage.includes(personnage));
            
            personnagesPage.push(personnage);
        }
    }
    
    // Créer une mini-progression pour les cases de cette page
    for (let j = 0; j < casesCount; j++) {
        // Déterminer la progression dans la page (début, milieu, fin)
        const progression = j / (casesCount - 1); // 0 au début, 1 à la fin
        
        // Sélectionner les personnages présents dans cette case
        const personnagesCase = selectionnerPersonnagesCase(personnagesPage, progression, j, casesCount);
        
        // Créer la description visuelle de la case
        const descriptionVisuelle = creerDescriptionVisuelle(
            personnagesCase, 
            univers, 
            lieuPrincipal, 
            progression, 
            phaseNarrative,
            estMomentCle
        );
        
        // Créer le dialogue pour cette case
        const dialogue = creerDialogue(personnagesCase, progression, phaseNarrative, estMomentCle);
        
        // Ajouter la case au storyboard
        cases.push({
            description: descriptionVisuelle,
            dialogue: dialogue,
            personnages: personnagesCase.map(p => p.nom)
        });
    }
    
    return cases;
}

/**
 * Sélectionne les personnages présents dans une case
 */
function selectionnerPersonnagesCase(personnagesPage, progression, indexCase, totalCases) {
    // Pour les premières et dernières cases, inclure moins de personnages pour clarté
    if (indexCase === 0 || indexCase === totalCases - 1) {
        // Première ou dernière case: 1-2 personnages
        const nombrePersonnages = Math.min(Math.floor(Math.random() * 2) + 1, personnagesPage.length);
        return personnagesPage.slice(0, nombrePersonnages);
    } else {
        // Cases intermédiaires: possibilité d'avoir plus de personnages
        const nombrePersonnages = Math.min(Math.floor(Math.random() * personnagesPage.length) + 1, personnagesPage.length);
        
        // Mélanger les personnages pour cette case
        const personnagesMelanges = [...personnagesPage];
        for (let i = personnagesMelanges.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [personnagesMelanges[i], personnagesMelanges[j]] = [personnagesMelanges[j], personnagesMelanges[i]];
        }
        
        return personnagesMelanges.slice(0, nombrePersonnages);
    }
}

/**
 * Crée une description visuelle détaillée pour une case
 */
function creerDescriptionVisuelle(personnages, univers, lieuPrincipal, progression, phaseNarrative, estMomentCle) {
    // Éléments de base pour la description
    let description = "";
    
    // Déterminer le type de cadrage selon la progression et l'importance
    const cadrages = [
        "Plan large montrant", // Pour établir le contexte
        "Plan moyen sur", // Pour les interactions
        "Gros plan sur", // Pour les émotions
        "Plan d'ensemble révélant", // Pour les scènes de groupe
        "Contre-plongée dramatique sur", // Pour les moments de tension
        "Plongée sur", // Pour montrer la vulnérabilité
        "Plan séquence suivant" // Pour l'action
    ];
    
    let cadrage;
    if (progression < 0.2) {
        // Début de page: souvent plan large pour établir le contexte
        cadrage = cadrages[0];
    } else if (progression > 0.8) {
        // Fin de page: souvent gros plan pour l'impact émotionnel
        cadrage = cadrages[2];
    } else if (estMomentCle) {
        // Moment clé: cadrage dramatique
        cadrage = cadrages[Math.floor(Math.random() * 2) + 4];
    } else {
        // Autres cas: cadrage varié
        cadrage = cadrages[Math.floor(Math.random() * cadrages.length)];
    }
    
    // Commencer par le cadrage
    description += cadrage + " ";
    
    // Ajouter les personnages et leurs actions
    if (personnages.length > 0) {
        // Décrire le premier personnage
        const personnagePrincipal = personnages[0];
        description += personnagePrincipal.nom + " ";
        
        // Ajouter une action ou expression selon la phase narrative
        const actions = getActionsSelonPhase(phaseNarrative, personnagePrincipal.archetype);
        const actionIndex = Math.floor(Math.random() * actions.length);
        description += actions[actionIndex] + " ";
        
        // Ajouter les autres personnages s'il y en a
        if (personnages.length > 1) {
            description += "tandis que ";
            
            const autresPersonnages = personnages.slice(1).map(p => p.nom).join(" et ");
            description += autresPersonnages + " ";
            
            // Action des personnages secondaires
            const actionsSecondaires = [
                "observent la scène",
                "réagissent avec surprise",
                "échangent des regards inquiets",
                "se tiennent en retrait",
                "s'approchent avec précaution",
                "montrent des signes d'impatience",
                "semblent prêts à intervenir"
            ];
            
            const actionSecondaireIndex = Math.floor(Math.random() * actionsSecondaires.length);
            description += actionsSecondaires[actionSecondaireIndex];
        }
    } else {
        // Case sans personnage (rare): description du lieu
        description += "le " + lieuPrincipal.toLowerCase() + " ";
        
        const descriptionsLieu = [
            "baigné dans une lumière mystérieuse",
            "plongé dans l'obscurité",
            "animé d'une activité inhabituelle",
            "étrangement silencieux et désert",
            "révélant des détails jusqu'alors cachés"
        ];
        
        const descriptionLieuIndex = Math.floor(Math.random() * descriptionsLieu.length);
        description += descriptionsLieu[descriptionLieuIndex];
    }
    
    // Ajouter des détails sur le lieu et l'ambiance
    description += ". ";
    
    // Détails du lieu selon le type d'univers
    const detailsLieu = getDetailsLieu(univers.type, lieuPrincipal);
    const detailLieuIndex = Math.floor(Math.random() * detailsLieu.length);
    description += detailsLieu[detailLieuIndex] + ". ";
    
    // Ajouter des détails sur l'éclairage et l'ambiance
    const eclairages = [
        "La lumière douce crée une atmosphère intime",
        "Les ombres prononcées accentuent la tension de la scène",
        "Un rayon de lumière met en valeur l'expression du personnage",
        "L'éclairage contrasté souligne la dualité de la situation",
        "La pénombre enveloppe les personnages d'un voile de mystère",
        "La lumière éclatante révèle chaque détail avec précision"
    ];
    
    const eclairageIndex = Math.floor(Math.random() * eclairages.length);
    description += eclairages[eclairageIndex] + ".";
    
    return description;
}

/**
 * Obtient des actions possibles selon la phase narrative
 */
function getActionsSelonPhase(phaseNarrative, archetype) {
    const actionsParPhase = {
        "Introduction du cadre et des personnages": [
            "observe son environnement avec curiosité",
            "se présente avec assurance",
            "entre en scène d'un pas déterminé",
            "révèle sa présence discrètement"
        ],
        "Présentation de la situation initiale": [
            "vaque à ses occupations habituelles",
            "explique la situation aux autres personnages",
            "montre des signes d'inquiétude face aux événements",
            "semble inconscient des dangers qui se profilent"
        ],
        "Perturbation de l'équilibre": [
            "réagit avec stupeur à la nouvelle situation",
            "tente de comprendre ce qui se passe",
            "cherche à maintenir le calme malgré la confusion",
            "fait face à un élément perturbateur inattendu"
        ],
        "Réaction des personnages à l'événement déclencheur": [
            "affiche une expression de choc",
            "prend rapidement une décision",
            "hésite sur la conduite à tenir",
            "rassemble son courage pour affronter la situation"
        ],
        "Décision d'agir face à la nouvelle situation": [
            "prend la parole avec détermination",
            "expose son plan aux autres",
            "s'équipe pour l'aventure à venir",
            "fait ses adieux avant de partir"
        ],
        "Exploration du nouveau contexte": [
            "découvre un environnement inconnu",
            "analyse les indices trouvés",
            "s'adapte aux nouvelles circonstances",
            "fait face à l'inconnu avec appréhension"
        ],
        "Rencontre avec des obstacles": [
            "se heurte à une résistance inattendue",
            "tente de surmonter une difficulté",
            "cherche une solution alternative",
            "affronte un adversaire déterminé"
        ],
        "Développement des relations entre personnages": [
            "partage un moment de complicité",
            "révèle un secret personnel",
            "entre en conflit avec un allié",
            "forge une nouvelle alliance"
        ],
        "Complications et revers": [
            "accuse le coup d'un échec cuisant",
            "voit son plan échouer",
            "perd un objet ou un allié précieux",
            "se retrouve dans une situation périlleuse"
        ],
        "Moment de crise ou de doute": [
            "montre des signes de découragement",
            "remet en question ses choix passés",
            "fait face à ses peurs les plus profondes",
            "se trouve à un carrefour décisionnel crucial"
        ],
        "Découverte d'une nouvelle information cruciale": [
            "écarquille les yeux devant une révélation",
            "comprend soudain l'ampleur de la situation",
            "trouve un indice déterminant",
            "reçoit une information qui change tout"
        ],
        "Préparation pour la confrontation finale": [
            "affûte ses armes avec détermination",
            "rassemble ses alliés pour la bataille à venir",
            "élabore une stratégie minutieuse",
            "se recueille avant l'affrontement décisif"
        ],
        "Montée de la tension": [
            "avance prudemment en territoire hostile",
            "échange un regard lourd de sens avec son adversaire",
            "sent la pression monter à l'approche du dénouement",
            "perçoit les signes avant-coureurs de la confrontation"
        ],
        "Confrontation décisive": [
            "fait face à son adversaire avec détermination",
            "déploie toutes ses ressources dans la bataille",
            "révèle sa véritable puissance",
            "met tout en jeu dans un ultime effort"
        ],
        "Résolution du conflit": [
    <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>
