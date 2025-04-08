/**
 * auto-matcher-engine.js - Moteur d'algorithmes de rapprochement
 * 
 * Ce fichier contient les algorithmes principaux de rapprochement automatique
 */

// Import/link avec le fichier de configuration principal
// Dans un environnement de production, ces variables seraient importées
// const { autoMatcherConfig, paymentPatterns } = require('./auto-matcher.js');

/**
 * Exécute le processus de rapprochement automatique
 */
function runAutoMatching() {
    showLoadingIndicator();
    
    // Récupérer les données nécessaires
    const invoices = getUnmatchedInvoices();
    const payments = getUnmatchedPayments();
    
    if (invoices.length === 0 || payments.length === 0) {
        hideLoadingIndicator();
        showNoDataMessage();
        return;
    }
    
    // Rechercher les correspondances potentielles
    const matches = findPotentialMatches(invoices, payments);
    
    // Afficher les résultats dans l'interface
    displayMatchResults(matches);
    
    // Valider automatiquement les correspondances de confiance élevée
    autoValidateHighConfidenceMatches(matches);
    
    hideLoadingIndicator();
}

/**
 * Affiche l'indicateur de chargement pendant le traitement
 */
function showLoadingIndicator() {
    const matchingArea = document.querySelector('.matching-container');
    if (matchingArea) {
        matchingArea.innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">${window.__('searching_matches')}</span>
                </div>
                <p class="mt-3">${window.__('searching_matches')}</p>
            </div>
        `;
    }
}

/**
 * Cache l'indicateur de chargement
 */
function hideLoadingIndicator() {
    // Suppression du spinner si nécessaire
}

/**
 * Affiche un message quand aucune donnée n'est disponible
 */
function showNoDataMessage() {
    const matchingArea = document.querySelector('.matching-container');
    if (matchingArea) {
        matchingArea.innerHTML = `
            <div class="alert alert-info my-4">
                <i class="fas fa-info-circle me-2"></i>
                ${window.__('no_data_to_match')}
            </div>
        `;
    }
}

/**
 * Récupère les factures non rapprochées
 * @returns {Array} Liste des factures
 */
function getUnmatchedInvoices() {
    // Dans un environnement réel, ces données viendraient d'une API ou BDD
    // Simulation pour la démonstration
    return [
        {
            id: 'INV-2025-001',
            reference: 'FAC-2025-0042',
            amount: 5280,
            client: 'ACME CORP',
            issueDate: '2025-03-15',
            dueDate: '2025-04-15'
        },
        {
            id: 'INV-2025-002',
            reference: 'FAC-2025-0043',
            amount: 3150,
            client: 'GLOBEX INC',
            issueDate: '2025-03-20',
            dueDate: '2025-04-20'
        },
        {
            id: 'INV-2025-003',
            reference: 'FAC-2025-0044',
            amount: 7890,
            client: 'STARK INDUSTRIES',
            issueDate: '2025-03-25',
            dueDate: '2025-04-25'
        }
    ];
}

/**
 * Récupère les paiements non rapprochés
 * @returns {Array} Liste des paiements
 */
function getUnmatchedPayments() {
    // Dans un environnement réel, ces données viendraient d'une API ou BDD
    // Simulation pour la démonstration
    return [
        {
            id: 'PAY-2025-001',
            reference: 'PAIEMENT FAC-2025-0042',
            amount: 5280,
            client: 'ACME CORP',
            receptionDate: '2025-04-05'
        },
        {
            id: 'PAY-2025-002',
            reference: 'PAIEMENT GLOBEX 43',
            amount: 3150,
            client: 'GLOBEX INC',
            receptionDate: '2025-04-10'
        },
        {
            id: 'PAY-2025-003',
            reference: 'VIREMENT STARK / REF0044',
            amount: 7890,
            client: 'STARK INDUSTRIES',
            receptionDate: '2025-04-12'
        }
    ];
}

/**
 * Recherche les correspondances potentielles entre factures et paiements
 * @param {Array} invoices - Liste des factures
 * @param {Array} payments - Liste des paiements
 * @returns {Array} Liste des correspondances trouvées
 */
function findPotentialMatches(invoices, payments) {
    const matches = [];
    
    // Pour chaque paiement, rechercher les factures correspondantes
    payments.forEach(payment => {
        const potentialInvoices = [];
        
        // Parcourir les factures pour trouver des correspondances
        invoices.forEach(invoice => {
            // Calculer le score de confiance
            const score = calculateConfidenceScore(payment, invoice);
            
            // Si le score dépasse le seuil minimum, ajouter à la liste des potentiels
            if (score.totalScore >= autoMatcherConfig.confidenceThresholds.suggestion) {
                potentialInvoices.push({
                    invoice: invoice,
                    score: score
                });
            }
        });
        
        // Trier les factures potentielles par score décroissant
        potentialInvoices.sort((a, b) => b.score.totalScore - a.score.totalScore);
        
        // Ajouter les correspondances trouvées
        if (potentialInvoices.length > 0) {
            matches.push({
                payment: payment,
                matches: potentialInvoices
            });
        }
    });
    
    // Recherche de correspondances complexes (N:1 et 1:N)
    if (autoMatcherConfig.complexMatching.enableNto1Matching) {
        findNto1Matches(invoices, payments, matches);
    }
    
    if (autoMatcherConfig.complexMatching.enable1toNMatching) {
        find1toNMatches(invoices, payments, matches);
    }
    
    return matches;
}

/**
 * Calcule le score de confiance entre un paiement et une facture
 * @param {Object} payment - Paiement à évaluer
 * @param {Object} invoice - Facture à évaluer
 * @returns {Object} Détails du score de confiance
 */
function calculateConfidenceScore(payment, invoice) {
    const rules = autoMatcherConfig.matchingRules;
    const scoreDetails = {};
    let totalScore = 0;
    
    // Vérifier la correspondance exacte du montant
    if (payment.amount === invoice.amount) {
        scoreDetails.exactAmount = rules.exactAmount.weight;
        totalScore += rules.exactAmount.weight;
    } else if (Math.abs(payment.amount - invoice.amount) <= autoMatcherConfig.complexMatching.amountTolerance) {
        // Tolérance pour de petits écarts
        const tolerance = autoMatcherConfig.complexMatching.amountTolerance;
        const diff = Math.abs(payment.amount - invoice.amount);
        const toleranceScore = rules.exactAmount.weight * (1 - diff / tolerance);
        scoreDetails.closeAmount = Math.round(toleranceScore);
        totalScore += scoreDetails.closeAmount;
    }
    
    // Vérifier la correspondance exacte de la référence
    if (payment.reference.includes(invoice.reference)) {
        scoreDetails.exactReference = rules.exactReference.weight;
        totalScore += rules.exactReference.weight;
    } else {
        // Vérifier la correspondance partielle de la référence
        const invoiceRefNormalized = normalizeString(invoice.reference);
        const paymentRefNormalized = normalizeString(payment.reference);
        
        if (paymentRefNormalized.includes(invoiceRefNormalized) || 
            invoiceRefNormalized.includes(paymentRefNormalized)) {
            scoreDetails.partialReference = rules.partialReference.weight;
            totalScore += rules.partialReference.weight;
        } else {
            // Recherche de numéro de facture dans la référence de paiement
            const invoiceNumber = invoice.reference.match(/\d+/);
            if (invoiceNumber && payment.reference.includes(invoiceNumber[0])) {
                scoreDetails.numberReference = Math.floor(rules.partialReference.weight / 2);
                totalScore += scoreDetails.numberReference;
            }
        }
    }
    
    // Vérifier la correspondance du client
    if (payment.client === invoice.client) {
        scoreDetails.sameClient = rules.sameClient.weight;
        totalScore += rules.sameClient.weight;
    } else {
        // Vérification moins stricte du nom du client
        const paymentClientNormalized = normalizeString(payment.client);
        const invoiceClientNormalized = normalizeString(invoice.client);
        
        if (paymentClientNormalized.includes(invoiceClientNormalized) || 
            invoiceClientNormalized.includes(paymentClientNormalized)) {
            scoreDetails.similarClient = Math.floor(rules.sameClient.weight / 2);
            totalScore += scoreDetails.similarClient;
        }
    }
    
    // Vérifier la proximité des dates
    const paymentDate = new Date(payment.receptionDate);
    const dueDate = new Date(invoice.dueDate);
    
    // Calcul de la différence en jours
    const diffTime = Math.abs(paymentDate - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 5) {
        scoreDetails.closeDate = rules.closeDate.weight;
        totalScore += rules.closeDate.weight;
    } else if (diffDays <= 15) {
        scoreDetails.relativelyCloseDate = Math.floor(rules.closeDate.weight / 2);
        totalScore += scoreDetails.relativelyCloseDate;
    }
    
    // Apprentissage de pattern si activé
    if (autoMatcherConfig.enablePatternLearning) {
        const patternScore = calculatePatternBasedScore(payment, invoice);
        if (patternScore > 0) {
            scoreDetails.patternMatching = patternScore;
            totalScore += patternScore;
        }
    }
    
    return {
        totalScore: Math.min(totalScore, 100), // Plafonner à 100%
        details: scoreDetails
    };
}

/**
 * Normalise une chaîne pour les comparaisons
 * @param {string} str - Chaîne à normaliser
 * @returns {string} Chaîne normalisée
 */
function normalizeString(str) {
    return str.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprimer accents
        .replace(/[^\w\s]/g, '') // Supprimer caractères spéciaux
        .replace(/\s+/g, ' ').trim(); // Normaliser espaces
}

/**
 * Calcule un score basé sur les patterns d'apprentissage
 * @param {Object} payment - Paiement à évaluer
 * @param {Object} invoice - Facture à évaluer
 * @returns {number} Score additionnel basé sur les patterns
 */
function calculatePatternBasedScore(payment, invoice) {
    // Simulation: dans un cas réel, cette fonction utiliserait
    // l'historique des rapprochements pour ce client
    
    return 0; // Pas de pattern reconnu pour la démo
}

/**
 * Affiche les résultats de correspondance dans l'interface
 * @param {Array} matches - Liste des correspondances trouvées
 */
function displayMatchResults(matches) {
    const matchingArea = document.querySelector('.matching-container');
    if (!matchingArea) return;
    
    if (matches.length === 0) {
        matchingArea.innerHTML = `
            <div class="alert alert-info my-4">
                <i class="fas fa-info-circle me-2"></i>
                ${window.__('no_matches_found')}
            </div>
        `;
        return;
    }
    
    let matchesHtml = `
        <h4 class="mt-4 mb-3">${window.__('match_suggestions')}</h4>
    `;
    
    matches.forEach(matchGroup => {
        matchesHtml += `
            <div class="match-group card mb-4">
                <div class="card-header bg-light">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">${window.__('payment')}: ${matchGroup.payment.reference}</h5>
                        <span class="badge bg-primary">${formatCurrency(matchGroup.payment.amount)}</span>
                    </div>
                    <div class="small text-muted">
                        ${matchGroup.payment.client} | ${formatDate(matchGroup.payment.receptionDate)}
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>${window.__('invoice')}</th>
                                    <th>${window.__('amount')}</th>
                                    <th>${window.__('client')}</th>
                                    <th>${window.__('due_date')}</th>
                                    <th>${window.__('confidence_score')}</th>
                                    <th>${window.__('matched_tags')}</th>
                                    <th>${window.__('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        matchGroup.matches.forEach(match => {
            const confidenceClass = getConfidenceClass(match.score.totalScore);
            
            matchesHtml += `
                <tr>
                    <td>${match.invoice.reference}</td>
                    <td>${formatCurrency(match.invoice.amount)}</td>
                    <td>${match.invoice.client}</td>
                    <td>${formatDate(match.invoice.dueDate)}</td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar ${confidenceClass}" role="progressbar" 
                                style="width: ${match.score.totalScore}%;" 
                                aria-valuenow="${match.score.totalScore}" aria-valuemin="0" aria-valuemax="100">
                                ${match.score.totalScore}%
                            </div>
                        </div>
                    </td>
                    <td>${formatMatchTags(match.score.details)}</td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-success validate-match" 
                                data-payment="${matchGroup.payment.id}" 
                                data-invoice="${match.invoice.id}"
                                title="${window.__('validate_match')}">
                                <i class="fas fa-check"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary adjust-match" 
                                data-payment="${matchGroup.payment.id}" 
                                data-invoice="${match.invoice.id}"
                                title="${window.__('adjust_allocation')}">
                                <i class="fas fa-sliders-h"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger ignore-match" 
                                data-payment="${matchGroup.payment.id}" 
                                data-invoice="${match.invoice.id}"
                                title="${window.__('ignore')}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        matchesHtml += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    });
    
    matchingArea.innerHTML = matchesHtml;
    
    // Ajouter les écouteurs d'événements pour les actions
    attachMatchActionListeners();
}

/**
 * Détermine la classe CSS pour le niveau de confiance
 * @param {number} score - Score de confiance
 * @returns {string} Classe CSS pour la barre de progression
 */
function getConfidenceClass(score) {
    if (score >= autoMatcherConfig.confidenceThresholds.auto) {
        return 'bg-success';
    } else if (score >= 75) {
        return 'bg-info';
    } else if (score >= 50) {
        return 'bg-warning';
    } else {
        return 'bg-danger';
    }
}

/**
 * Formate les tags de correspondance pour l'affichage
 * @param {Object} details - Détails du score
 * @returns {string} HTML formaté des tags
 */
function formatMatchTags(details) {
    const tags = [];
    
    if (details.exactAmount) tags.push('<span class="badge bg-success me-1">'+window.__('exact_amount')+'</span>');
    if (details.closeAmount) tags.push('<span class="badge bg-info me-1">'+window.__('close_amount')+'</span>');
    
    if (details.exactReference) tags.push('<span class="badge bg-success me-1">'+window.__('exact_reference')+'</span>');
    if (details.partialReference) tags.push('<span class="badge bg-info me-1">'+window.__('partial_reference')+'</span>');
    if (details.numberReference) tags.push('<span class="badge bg-secondary me-1">'+window.__('number_reference')+'</span>');
    
    if (details.sameClient) tags.push('<span class="badge bg-success me-1">'+window.__('identical_client')+'</span>');
    if (details.similarClient) tags.push('<span class="badge bg-info me-1">'+window.__('similar_client')+'</span>');
    
    if (details.closeDate) tags.push('<span class="badge bg-success me-1">'+window.__('close_dates')+'</span>');
    if (details.relativelyCloseDate) tags.push('<span class="badge bg-info me-1">'+window.__('relative_dates')+'</span>');
    
    if (details.patternMatching) tags.push('<span class="badge bg-primary me-1">'+window.__('pattern_matched')+'</span>');
    
    return tags.join('');
}

/**
 * Attache les écouteurs d'événements aux boutons d'action
 */
function attachMatchActionListeners() {
    // Boutons de validation
    document.querySelectorAll('.validate-match').forEach(btn => {
        btn.addEventListener('click', function() {
            const paymentId = this.getAttribute('data-payment');
            const invoiceId = this.getAttribute('data-invoice');
            validateMatch(paymentId, invoiceId);
        });
    });
    
    // Boutons d'ajustement
    document.querySelectorAll('.adjust-match').forEach(btn => {
        btn.addEventListener('click', function() {
            const paymentId = this.getAttribute('data-payment');
            const invoiceId = this.getAttribute('data-invoice');
            showAdjustmentModal(paymentId, invoiceId);
        });
    });
    
    // Boutons d'ignorance
    document.querySelectorAll('.ignore-match').forEach(btn => {
        btn.addEventListener('click', function() {
            const paymentId = this.getAttribute('data-payment');
            const invoiceId = this.getAttribute('data-invoice');
            ignoreMatch(paymentId, invoiceId);
        });
    });
}

/**
 * Format un montant en devise
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Format une date
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @returns {string} Date formatée
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR').format(date);
}

// Exporter les fonctions nécessaires
window.autoMatcherEngine = {
    runAutoMatching,
    displayMatchResults,
    calculateConfidenceScore
};
