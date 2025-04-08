/**
 * auto-matcher.js - Système intelligent de rapprochement automatique
 * 
 * Fonctionnalités:
 * - Algorithmes avancés de correspondance de paiements et factures
 * - Apprentissage des patterns de paiement par client
 * - Gestion des seuils de tolérance et règles métier
 * - Traitement des cas complexes (paiements partiels, regroupés, etc.)
 */

// Configuration du système de rapprochement automatique
const autoMatcherConfig = {
    // Seuils de confiance pour l'acceptation automatique
    confidenceThresholds: {
        auto: 85,         // Seuil pour rapprochement automatique (%)
        suggestion: 60    // Seuil pour suggestion (%)
    },
    
    // Règles de correspondance et leur poids dans le score
    matchingRules: {
        exactAmount: { weight: 40, description: 'exact_amount' },
        exactReference: { weight: 30, description: 'exact_reference' },
        partialReference: { weight: 15, description: 'partial_reference' },
        sameClient: { weight: 10, description: 'identical_client' },
        closeDate: { weight: 5, description: 'close_dates' }
    },
    
    // Algorithmes de correspondance complexes
    complexMatching: {
        // Tolérance pour les écarts de montant (€)
        amountTolerance: 5.00,
        
        // Rapprochement N:1 (plusieurs factures pour un paiement)
        enableNto1Matching: true,
        
        // Rapprochement 1:N (une facture pour plusieurs paiements)
        enable1toNMatching: true,
        
        // Durée maximale de recherche (jours avant/après la date d'échéance)
        dateRange: 60
    },
    
    // Historique de rapprochement pour apprentissage
    enablePatternLearning: true,
    
    // Configuration de l'algorithme d'apprentissage
    learningConfig: {
        minHistoryItems: 3,       // Nombre minimum d'exemples pour apprendre
        clientPatternWeight: 15,  // Poids des patterns client dans le score
        globalPatternWeight: 5    // Poids des patterns globaux dans le score
    }
};

// Base de connaissances pour les patterns de paiement (simulé)
const paymentPatterns = {
    // Patterns spécifiques à un client
    clientPatterns: {},
    
    // Patterns globaux
    globalPatterns: {
        referenceFormats: [],
        paymentTiming: {}
    }
};

/**
 * Initialisation du système de rapprochement
 */
document.addEventListener('DOMContentLoaded', function() {
    // Charger la configuration depuis localStorage ou utiliser les valeurs par défaut
    loadConfiguration();
    
    // Initialiser les écouteurs d'événements pour l'interface
    initAutoMatcherUI();
    
    // Effectuer un rapprochement automatique initial si activé
    if (document.getElementById('auto-matching-toggle')?.checked) {
        runAutoMatching();
    }
});

/**
 * Charge la configuration du système
 */
function loadConfiguration() {
    try {
        const savedConfig = localStorage.getItem('autoMatcherConfig');
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            
            // Fusionner avec les valeurs par défaut
            Object.assign(autoMatcherConfig, parsedConfig);
            
            // Mettre à jour l'interface avec les valeurs chargées
            updateConfigUI();
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
    }
}

/**
 * Sauvegarde la configuration actuelle
 */
function saveConfiguration() {
    try {
        localStorage.setItem('autoMatcherConfig', JSON.stringify(autoMatcherConfig));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la configuration:', error);
    }
}

/**
 * Met à jour l'interface utilisateur avec les valeurs de configuration
 */
function updateConfigUI() {
    // Mettre à jour les seuils de confiance
    const autoThreshold = document.getElementById('auto-threshold');
    if (autoThreshold) {
        autoThreshold.value = autoMatcherConfig.confidenceThresholds.auto;
    }
    
    const suggestionThreshold = document.getElementById('suggestion-threshold');
    if (suggestionThreshold) {
        suggestionThreshold.value = autoMatcherConfig.confidenceThresholds.suggestion;
    }
    
    // Mettre à jour la tolérance des montants
    const amountTolerance = document.getElementById('amount-tolerance');
    if (amountTolerance) {
        amountTolerance.value = autoMatcherConfig.complexMatching.amountTolerance;
    }
    
    // Mettre à jour les options de rapprochement complexe
    const nto1Matching = document.getElementById('enable-nto1');
    if (nto1Matching) {
        nto1Matching.checked = autoMatcherConfig.complexMatching.enableNto1Matching;
    }
    
    const oneToNMatching = document.getElementById('enable-1ton');
    if (oneToNMatching) {
        oneToNMatching.checked = autoMatcherConfig.complexMatching.enable1toNMatching;
    }
    
    // Mettre à jour l'option d'apprentissage
    const patternLearning = document.getElementById('enable-learning');
    if (patternLearning) {
        patternLearning.checked = autoMatcherConfig.enablePatternLearning;
    }
}

/**
 * Initialise les écouteurs d'événements pour l'interface utilisateur
 */
function initAutoMatcherUI() {
    // Écouteur pour le bouton de rapprochement automatique
    const autoMatchButton = document.getElementById('run-auto-matching');
    if (autoMatchButton) {
        autoMatchButton.addEventListener('click', runAutoMatching);
    }
    
    // Écouteur pour le toggle d'activation/désactivation
    const autoMatchToggle = document.getElementById('auto-matching-toggle');
    if (autoMatchToggle) {
        autoMatchToggle.addEventListener('change', function(e) {
            const isEnabled = e.target.checked;
            
            // Activer/désactiver le rapprochement automatique lors du chargement des paiements
            if (isEnabled) {
                const notification = document.createElement('div');
                notification.className = 'alert alert-info alert-dismissible fade show';
                notification.innerHTML = `
                    <strong>${window.__('auto_matching_enabled')}</strong> ${window.__('auto_matching_enabled_desc')}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;
                document.querySelector('.notification-area')?.appendChild(notification);
                
                // Démarrer le rapprochement automatique
                runAutoMatching();
                
                // Disparaître après 5 secondes
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 150);
                }, 5000);
            }
        });
    }
    
    // Écouteurs pour les modifications de configuration
    document.getElementById('auto-threshold')?.addEventListener('change', function(e) {
        autoMatcherConfig.confidenceThresholds.auto = parseInt(e.target.value, 10);
        saveConfiguration();
    });
    
    document.getElementById('suggestion-threshold')?.addEventListener('change', function(e) {
        autoMatcherConfig.confidenceThresholds.suggestion = parseInt(e.target.value, 10);
        saveConfiguration();
    });
    
    document.getElementById('amount-tolerance')?.addEventListener('change', function(e) {
        autoMatcherConfig.complexMatching.amountTolerance = parseFloat(e.target.value);
        saveConfiguration();
    });
    
    document.getElementById('enable-nto1')?.addEventListener('change', function(e) {
        autoMatcherConfig.complexMatching.enableNto1Matching = e.target.checked;
        saveConfiguration();
    });
    
    document.getElementById('enable-1ton')?.addEventListener('change', function(e) {
        autoMatcherConfig.complexMatching.enable1toNMatching = e.target.checked;
        saveConfiguration();
    });
    
    document.getElementById('enable-learning')?.addEventListener('change', function(e) {
        autoMatcherConfig.enablePatternLearning = e.target.checked;
        saveConfiguration();
    });
    
    // Écouteur pour le bouton de réinitialisation
    document.getElementById('reset-config')?.addEventListener('click', function() {
        // Réinitialiser aux valeurs par défaut
        const defaultConfig = {
            confidenceThresholds: {
                auto: 85,
                suggestion: 60
            },
            complexMatching: {
                amountTolerance: 5.00,
                enableNto1Matching: true,
                enable1toNMatching: true,
                dateRange: 60
            },
            enablePatternLearning: true
        };
        
        Object.assign(autoMatcherConfig, defaultConfig);
        updateConfigUI();
        saveConfiguration();
        
        // Notification
        const notification = document.createElement('div');
        notification.className = 'alert alert-success alert-dismissible fade show';
        notification.innerHTML = `
            <strong>${window.__('config_reset')}</strong> ${window.__('config_reset_desc')}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.querySelector('.notification-area')?.appendChild(notification);
        
        // Disparaître après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 150);
        }, 3000);
    });
}
