/**
 * Fonction pour générer un scénario détaillé comme le ferait une IA spécialisée
 * Cette fonction remplacera la fonction generateScenario actuelle
 */
async function generateScenarioDetaille(keywords) {
    try {
        console.log("Génération du scénario détaillé à partir de : " + keywords);
        
        // Ajouter un facteur d'aléatoire pour garantir l'unicité du scénario
        const randomSeed = Date.now() + Math.floor(Math.random() * 10000);
        
        // Traitement des mots-clés
        const keywordsList = keywords.split(/[ ,]+/).filter(k => k.length > 0);
        
        // Génération d'un titre créatif basé sur les mots-clés
        let title = genererTitreCreatif(keywordsList, randomSeed);
        
        // Création d'un univers cohérent basé sur les mots-clés
        const univers = creerUnivers(keywordsList, randomSeed);
        
        // Création des personnages principaux avec des caractéristiques détaillées
        const personnages = creerPersonnages(keywordsList, univers, randomSeed);
        
        // Création d'une structure narrative complète
        const structureNarrative = creerStructureNarrative(keywordsList, univers, personnages, randomSeed);
        
        // Génération des chapitres détaillés
        const chapitres = genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed);
        
        // Construction de l'objet scénario complet
        const scenario = {
            title: title,
            theme: keywords,
            univers: univers,
            personnages: personnages,
            structureNarrative: structureNarrative,
            chapters: chapitres,
            generatedAt: Date.now()
        };
        
        return scenario;
    } catch (error) {
        console.error("Erreur lors de la génération du scénario détaillé:", error);
        return null;
    }
}

/**
 * Génère un titre créatif basé sur les mots-clés
 */
function genererTitreCreatif(keywordsList, randomSeed) {
    const titresCreatifs = [
        "Les Chroniques de [Mot-clé]",
        "L'Odyssée [Mot-clé]",
        "Le Secret des [Mot-clé]",
        "Au-delà des [Mot-clé]",
        "[Mot-clé]: La Légende Oubliée",
        "Les Gardiens de [Mot-clé]",
        "L'Éveil de [Mot-clé]",
        "La Prophétie des [Mot-clé]",
        "Le Dernier [Mot-clé]",
        "L'Écho des [Mot-clé]"
    ];
    
    // Sélection d'un modèle de titre
    const modeleIndex = Math.floor((randomSeed % 100) / 100 * titresCreatifs.length);
    let modele = titresCreatifs[modeleIndex];
    
    // Remplacement du placeholder par un mot-clé
    if (keywordsList.length > 0) {
        const keywordIndex = Math.floor((randomSeed % 200) / 200 * keywordsList.length);
        const keyword = keywordsList[keywordIndex];
        const keywordCapitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        modele = modele.replace("[Mot-clé]", keywordCapitalized);
    } else {
        modele = modele.replace("[Mot-clé]", "Mondes");
    }
    
    return modele;
}

/**
 * Crée un univers cohérent basé sur les mots-clés
 */
function creerUnivers(keywordsList, randomSeed) {
    // Types d'univers possibles
    const typesUnivers = [
        "médiéval-fantastique", "science-fiction", "post-apocalyptique", 
        "contemporain", "steampunk", "cyberpunk", "mythologique",
        "historique", "dystopique", "utopique"
    ];
    
    // Sélection d'un type d'univers influencé par les mots-clés
    let typeUnivers = typesUnivers[Math.floor((randomSeed % 300) / 300 * typesUnivers.length)];
    
    // Adaptation du type d'univers en fonction des mots-clés
    if (keywordsList.length > 0) {
        for (const keyword of keywordsList) {
            if (keyword.includes("futur") || keyword.includes("robot") || keyword.includes("espace")) {
                typeUnivers = "science-fiction";
                break;
            } else if (keyword.includes("dragon") || keyword.includes("magie") || keyword.includes("elfe")) {
                typeUnivers = "médiéval-fantastique";
                break;
            } else if (keyword.includes("apocalypse") || keyword.includes("survie") || keyword.includes("ruine")) {
                typeUnivers = "post-apocalyptique";
                break;
            }
        }
    }
    
    // Caractéristiques de l'univers
    const caracteristiques = {
        "médiéval-fantastique": {
            epoque: "Âge des légendes",
            technologie: "Limitée, remplacée par la magie",
            particularites: "Créatures mythiques, royaumes en guerre, quêtes héroïques",
            lieux: ["Forêt enchantée", "Château ancestral", "Village paisible", "Montagne sacrée", "Cité fortifiée"]
        },
        "science-fiction": {
            epoque: "Futur lointain",
            technologie: "Très avancée, voyages interstellaires, intelligence artificielle",
            particularites: "Civilisations extraterrestres, conflits interplanétaires, exploration spatiale",
            lieux: ["Station spatiale", "Planète inconnue", "Métropole futuriste", "Laboratoire secret", "Vaisseau spatial"]
        },
        "post-apocalyptique": {
            epoque: "Après la chute de la civilisation",
            technologie: "Vestiges technologiques, innovations de fortune",
            particularites: "Ressources rares, territoires hostiles, nouvelles sociétés émergentes",
            lieux: ["Ruines urbaines", "Abri souterrain", "Oasis préservée", "Territoire contaminé", "Campement nomade"]
        },
        "contemporain": {
            epoque: "Présent",
            technologie: "Actuelle, avec possibles éléments fantastiques",
            particularites: "Intrigues urbaines, mystères cachés dans le quotidien",
            lieux: ["Métropole animée", "Petite ville tranquille", "Campus universitaire", "Quartier historique", "Zone industrielle"]
        },
        "steampunk": {
            epoque: "Ère victorienne alternative",
            technologie: "Mécanique avancée, vapeur, engrenages",
            particularites: "Aristocratie et inventeurs, exploration, sociétés secrètes",
            lieux: ["Cité industrielle", "Dirigeable majestueux", "Manoir mécanique", "Docks brumeux", "Laboratoire d'inventeur"]
        },
        "cyberpunk": {
            epoque: "Futur proche",
            technologie: "Cybernétique, réalité virtuelle, implants",
            particularites: "Mégacorporations, hackers, inégalités sociales extrêmes",
            lieux: ["Mégalopole néon", "Bas-fonds", "Quartier général corporatif", "Réseau virtuel", "Clinique clandestine"]
        },
        "mythologique": {
            epoque: "Temps des mythes",
            technologie: "Primitive, mais avec artefacts divins",
            particularites: "Dieux et héros, quêtes épiques, créatures légendaires",
            lieux: ["Temple sacré", "Île mystérieuse", "Royaume des dieux", "Forêt primordiale", "Cité antique"]
        },
        "historique": {
            epoque: "Période historique spécifique",
            technologie: "Correspondant à l'époque choisie",
            particularites: "Événements historiques réinterprétés, personnages inspirés de figures réelles",
            lieux: ["Palais royal", "Champ de bataille", "Port marchand", "Quartier populaire", "Monument emblématique"]
        },
        "dystopique": {
            epoque: "Futur oppressif",
            technologie: "Avancée mais contrôlée",
            particularites: "Régime totalitaire, surveillance, résistance clandestine",
            lieux: ["Centre de contrôle", "Zone de résistance", "Quartier d'habitation standardisé", "Centre de rééducation", "Frontière surveillée"]
        },
        "utopique": {
            epoque: "Futur idéalisé",
            technologie: "Harmonieusement intégrée à la société",
            particularites: "Société apparemment parfaite cachant des secrets troublants",
            lieux: ["Cité jardin", "Centre communautaire", "Dôme écologique", "Tour d'harmonie", "Réserve naturelle"]
        }
    };
    
    // Création de l'univers détaillé
    const univers = {
        type: typeUnivers,
        ...caracteristiques[typeUnivers],
        description: `Un monde ${typeUnivers} où ${caracteristiques[typeUnivers].particularites.toLowerCase()}.`
    };
    
    return univers;
}

/**
 * Crée des personnages principaux avec des caractéristiques détaillées
 */
function creerPersonnages(keywordsList, univers, randomSeed) {
    // Archétypes de personnages
    const archetypes = [
        "héros", "mentor", "allié", "antagoniste", "gardien", "messager", "ombre"
    ];
    
    // Traits de personnalité
    const traits = {
        "héros": ["courageux", "déterminé", "idéaliste", "loyal", "impulsif"],
        "mentor": ["sage", "patient", "mystérieux", "exigeant", "protecteur"],
        "allié": ["fidèle", "compétent", "humoristique", "pragmatique", "sceptique"],
        "antagoniste": ["ambitieux", "impitoyable", "charismatique", "calculateur", "vengeur"],
        "gardien": ["vigilant", "traditionnel", "inflexible", "honorable", "méfiant"],
        "messager": ["curieux", "neutre", "observateur", "adaptable", "insaisissable"],
        "ombre": ["tourmenté", "complexe", "imprévisible", "dangereux", "séduisant"]
    };
    
    // Motivations possibles
    const motivations = {
        "héros": ["protéger les innocents", "venger un proche", "prouver sa valeur", "découvrir la vérité", "accomplir une prophétie"],
        "mentor": ["transmettre un savoir", "réparer une erreur passée", "préparer la nouvelle génération", "maintenir l'équilibre", "expier une faute"],
        "allié": ["aider un ami", "poursuivre un intérêt commun", "rembourser une dette", "trouver sa place", "fuir son passé"],
        "antagoniste": ["conquérir le pouvoir", "renverser l'ordre établi", "se venger d'une injustice", "imposer sa vision du monde", "obtenir l'immortalité"],
        "gardien": ["préserver un secret", "protéger un lieu sacré", "maintenir les traditions", "tester les héros", "respecter un serment"],
        "messager": ["délivrer une information cruciale", "observer les événements", "manipuler les protagonistes", "rétablir l'équilibre", "servir une entité supérieure"],
        "ombre": ["racheter son âme", "défier son destin", "semer le chaos", "tester ses limites", "survivre à tout prix"]
    };
    
    // Nombre de personnages principaux (3-5)
    const nombrePersonnages = Math.floor((randomSeed % 400) / 400 * 3) + 3;
    
    // Création des personnages
    const personnages = [];
    const archetypesUtilises = new Set();
    
    // Toujours inclure un héros et un antagoniste
    archetypesUtilises.add("héros");
    archetypesUtilises.add("antagoniste");
    
    // Créer le héros
    const hero = creerPersonnage("héros", univers, keywordsList, randomSeed + 1);
    personnages.push(hero);
    
    // Créer l'antagoniste
    const antagoniste = creerPersonnage("antagoniste", univers, keywordsList, randomSeed + 2);
    personnages.push(antagoniste);
    
    // Créer les autres personnages
    for (let i = 2; i < nombrePersonnages; i++) {
        // Sélectionner un archétype non utilisé
        let archetype;
        do {
            archetype = archetypes[Math.floor((randomSeed % (500 + i * 100)) / (500 + i * 100) * archetypes.length)];
        } while (archetypesUtilises.has(archetype));
        
        archetypesUtilises.add(archetype);
        
        // Créer le personnage
        const personnage = creerPersonnage(archetype, univers, keywordsList, randomSeed + i + 1);
        personnages.push(personnage);
    }
    
    return personnages;
    
    // Fonction interne pour créer un personnage
    function creerPersonnage(archetype, univers, keywordsList, seed) {
        // Noms selon le type d'univers
        const prenoms = {
            "médiéval-fantastique": ["Elric", "Galadriel", "Thorin", "Lyra", "Aragorn", "Morgana", "Thalia", "Gareth"],
            "science-fiction": ["Nova", "Orion", "Zephyr", "Andromeda", "Cygnus", "Vega", "Altair", "Lyra"],
            "post-apocalyptique": ["Ash", "Rust", "Ember", "Flint", "Raven", "Storm", "Dust", "Echo"],
            "contemporain": ["Alex", "Morgan", "Jordan", "Casey", "Taylor", "Riley", "Quinn", "Jamie"],
            "steampunk": ["Augustus", "Victoria", "Edison", "Phileas", "Amelia", "Cornelius", "Eliza", "Bartholomew"],
            "cyberpunk": ["Neon", "Zero", "Glitch", "Pixel", "Cipher", "Hack", "Chrome", "Bit"],
            "mythologique": ["Perseus", "Athena", "Orion", "Cassandra", "Theseus", "Persephone", "Hermes", "Artemis"],
            "historique": ["William", "Eleanor", "Henry", "Catherine", "Richard", "Elizabeth", "Thomas", "Anne"],
            "dystopique": ["Cipher", "Unity", "Proctor", "Harmony", "Vector", "Proxy", "Index", "Metric"],
            "utopique": ["Aether", "Serenity", "Harmony", "Zenith", "Lumina", "Pax", "Nova", "Celestia"]
        };
        
        const noms = {
            "médiéval-fantastique": ["Lumebois", "Acierétoile", "Corbefeu", "Ventdargent", "Pierrelune", "Ombreronce"],
            "science-fiction": ["Stellaris", "Quantos", "Nebulon", "Voidwalker", "Lightspeed", "Cosmotron"],
            "post-apocalyptique": ["Survivant", "Wasteland", "Scavenger", "Deadzone", "Rustwalker", "Ashborne"],
            "contemporain": ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia"],
            "steampunk": ["Cogsworth", "Brassington", "Steamwright", "Gearhart", "Copperfield", "Ironside"],
            "cyberpunk": ["Wirehead", "Netrunner", "Datasmith", "Gridlock", "Bitstream", "Neuromancer"],
            "mythologique": ["d'Olympe", "de Troie", "d'Atlantis", "des Hespérides", "du Styx", "de Delphes"],
            "historique": ["de Montfort", "Plantagenet", "Borgia", "Medici", "Tudor", "Bourbon", "Habsburg"],
            "dystopique": ["Alpha", "Prime", "Omega", "Control", "Order", "Compliance", "Protocol"],
            "utopique": ["Harmony", "Tranquil", "Serene", "Enlightened", "Ascendant", "Transcendent"]
        };
        
        // Sélection d'un prénom et d'un nom
        const prenomIndex = Math.floor((seed % 600) / 600 * prenoms[univers.type].length);
        const nomIndex = Math.floor((seed % 700) / 700 * noms[univers.type].length);
        
        const prenom = prenoms[univers.type][prenomIndex];
        const nom = noms[univers.type][nomIndex];
        
        // Sélection d'un trait de personnalité
        const traitIndex = Math.floor((seed % 800) / 800 * traits[archetype].length);
        const trait = traits[archetype][traitIndex];
        
        // Sélection d'une motivation
        const motivationIndex = Math.floor((seed % 900) / 900 * motivations[archetype].length);
        const motivation = motivations[archetype][motivationIndex];
        
        // Création d'une apparence physique
        const apparences = [
            "grand et élancé", "petit mais robuste", "d'allure athlétique", "à la silhouette imposante",
            "mince et agile", "de stature moyenne mais charismatique", "à l'apparence fragile mais déterminée"
        ];
        
        const apparenceIndex = Math.floor((seed % 1000) / 1000 * apparences.length);
        const apparence = apparences[apparenceIndex];
        
        // Création d'un trait distinctif
        const traitsDistinctifs = [
            "une cicatrice sur le visage", "des yeux d'une couleur inhabituelle", "un tatouage symbolique",
            "une mèche de cheveux colorée", "un accessoire unique toujours porté", "une démarche particulière",
            "une voix remarquable", "une marque de naissance mystérieuse"
        ];
        
        const traitDistinctifIndex = Math.floor((seed % 1100) / 1100 * traitsDistinctifs.length);
        const traitDistinctif = traitsDistinctifs[traitDistinctifIndex];
        
        // Intégration d'un mot-clé si disponible
        let competenceSpeciale = "";
        if (keywordsList.length <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>
