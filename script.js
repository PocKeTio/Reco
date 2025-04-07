document.addEventListener('DOMContentLoaded', function() {
    // Toggle Sidebar
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });
    
    // Navigation entre les vues
    document.querySelectorAll('[data-view]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetView = this.getAttribute('data-view');
            
            // Désactiver tous les liens de navigation
            document.querySelectorAll('.sidebar ul li').forEach(item => {
                item.classList.remove('active');
            });
            
            // Activer le lien cliqué
            if (this.parentElement.tagName === 'LI') {
                this.parentElement.classList.add('active');
            }
            
            // Masquer toutes les vues
            document.querySelectorAll('.content-view').forEach(view => {
                view.classList.remove('active');
            });
            
            // Afficher la vue cible
            document.getElementById(targetView + '-view').classList.add('active');
        });
    });
    
    // Initialisation des graphiques
    initCharts();
    
    // Initialisation des écouteurs d'événements pour les tableaux
    initTableListeners();

    // Initialisation des écouteurs pour les modals et formulaires
    initModalListeners();
});

// Fonction d'initialisation des graphiques
function initCharts() {
    // Détruire les graphiques existants s'ils existent pour éviter les problèmes de redimensionnement
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    
    // Définir des dimensions fixes pour les graphiques
    const chartHeight = 350;
    
    // Graphique d'évolution des suspens
    const suspensCtx = document.getElementById('suspensChart');
    if (suspensCtx) {
        // Définir une hauteur fixe pour le canvas
        suspensCtx.height = chartHeight;
        suspensCtx.style.height = chartHeight + 'px';
        suspensCtx.style.maxHeight = chartHeight + 'px';
        
        new Chart(suspensCtx, {
            type: 'line',
            data: {
                labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
                datasets: [
                    {
                        label: 'Suspens ouverts',
                        data: [45, 42, 50, 48, 40, 42],
                        borderColor: '#ff9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Paiements non rapprochés',
                        data: [30, 25, 35, 28, 32, 28],
                        borderColor: '#3f51b5',
                        backgroundColor: 'rgba(63, 81, 181, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Nombre'
                        }
                    }
                }
            }
        });
    }
    
    // Graphique de répartition par âge des suspens
    const ageDistributionCtx = document.getElementById('ageDistributionChart');
    if (ageDistributionCtx) {
        // Définir une hauteur fixe pour le canvas
        ageDistributionCtx.height = chartHeight;
        ageDistributionCtx.style.height = chartHeight + 'px';
        ageDistributionCtx.style.maxHeight = chartHeight + 'px';
        
        new Chart(ageDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['< 15 jours', '15-30 jours', '30-60 jours', '> 60 jours'],
                datasets: [{
                    data: [10, 5, 4, 3],
                    backgroundColor: [
                        '#4caf50',
                        '#ff9800',
                        '#f44336',
                        '#9c27b0'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
}

// Fonction d'initialisation des écouteurs d'événements pour les tableaux
function initTableListeners() {
    // Gestion des lignes cliquables dans les tableaux de paiements
    const paymentRows = document.querySelectorAll('#receivable-table tbody tr');
    paymentRows.forEach(row => {
        row.addEventListener('click', function() {
            // Supprimer la classe active de toutes les lignes
            paymentRows.forEach(r => r.classList.remove('table-active'));
            
            // Ajouter la classe active à la ligne cliquée
            this.classList.add('table-active');
            
            // Afficher le panneau de détails
            const detailsPanel = document.getElementById('payment-details-panel');
            if (detailsPanel) {
                detailsPanel.classList.add('active');
                
                // Simuler le chargement des suggestions
                simulateLoadingSuggestions();
            }
        });
    });
    
    // Gestion des lignes cliquables dans les tableaux de suspens
    const suspensRows = document.querySelectorAll('#suspens-table tbody tr');
    suspensRows.forEach(row => {
        row.addEventListener('click', function() {
            // Supprimer la classe active de toutes les lignes
            suspensRows.forEach(r => r.classList.remove('table-active'));
            
            // Ajouter la classe active à la ligne cliquée
            this.classList.add('table-active');
            
            // Afficher les détails du suspens
            showSuspensDetails(this.getAttribute('data-id'));
        });
    });
    
    // Gestion des boutons de validation
    document.querySelectorAll('.btn-validate-match').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const paymentId = this.closest('tr').getAttribute('data-id');
            validateMatch(paymentId);
        });
    });
    
    // Gestion des boutons d'action dans les détails
    document.querySelectorAll('.btn-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const itemId = this.closest('[data-id]').getAttribute('data-id');
            
            performAction(action, itemId);
        });
    });

    // Gestion des lignes cliquables dans l'historique d'importation
    const importHistoryRows = document.querySelectorAll('.import-history table tbody tr');
    importHistoryRows.forEach(row => {
        row.querySelector('.btn-outline-primary').addEventListener('click', function(e) {
            e.stopPropagation();
            const importId = row.getAttribute('data-id') || '1'; // Fallback ID
            showImportDetails(importId);
        });
    });
}

// Simulation de chargement des suggestions de rapprochement
function simulateLoadingSuggestions() {
    const suggestionsContainer = document.getElementById('match-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = '<div class="text-center p-4"><i class="fas fa-spinner fa-spin"></i> Recherche des correspondances...</div>';
        
        // Simuler un délai de chargement
        setTimeout(() => {
            suggestionsContainer.innerHTML = `
                <!-- Correspondance exacte 1:1 avec confiance élevée (rapprochement automatique) -->
                <div class="suggestion-item">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h5 class="mb-0">Facture FAC-2025-0087</h5>
                            <span class="text-muted">Client: Dupont SARL</span>
                        </div>
                        <div class="confidence-score">
                            <span class="badge bg-success">100%</span>
                            <i class="fas fa-check-circle text-success ms-1" title="Rapprochement automatique"></i>
                        </div>
                    </div>
                    <div class="suggestion-details">
                        <div class="row">
                            <div class="col-md-6">
                                <p class="mb-1"><strong>Montant:</strong> 3,450.00 €</p>
                                <p class="mb-1"><strong>Date émission:</strong> 01/04/2025</p>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-1"><strong>Référence:</strong> DUP25087</p>
                                <p class="mb-1"><strong>Statut:</strong> En attente</p>
                            </div>
                        </div>
                        <div class="match-criteria mt-2">
                            <span class="badge bg-info me-1">Montant exact</span>
                            <span class="badge bg-info me-1">Référence exacte</span>
                            <span class="badge bg-info me-1">Client identique</span>
                            <span class="badge bg-info">Date correspondante</span>
                        </div>
                    </div>
                    <div class="suggestion-actions mt-3">
                        <button class="btn btn-success btn-sm">Valider ce rapprochement</button>
                        <button class="btn btn-outline-secondary btn-sm">Ignorer</button>
                    </div>
                </div>

                <!-- Correspondance 1:N (une facture, plusieurs paiements) -->
                <div class="suggestion-item mt-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h5 class="mb-0">Facture FAC-2025-0092</h5>
                            <span class="text-muted">Client: Dupont SARL</span>
                            <span class="badge bg-primary ms-2">Relation 1:N</span>
                        </div>
                        <div class="confidence-score">
                            <span class="badge bg-warning">75%</span>
                        </div>
                    </div>
                    <div class="suggestion-details">
                        <div class="row">
                            <div class="col-md-6">
                                <p class="mb-1"><strong>Montant total:</strong> 5,800.00 €</p>
                                <p class="mb-1"><strong>Date émission:</strong> 05/04/2025</p>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-1"><strong>Référence:</strong> DUP25092</p>
                                <p class="mb-1"><strong>Statut:</strong> En attente</p>
                            </div>
                        </div>
                        <div class="mt-2 mb-2">
                            <p class="mb-1"><strong>Paiements associés:</strong></p>
                            <div class="associated-payments">
                                <div class="payment-item border-start border-primary ps-2 mb-1">
                                    <p class="mb-0">Paiement #PAY-20250408 - 3,650.00 € - 08/04/2025</p>
                                </div>
                                <div class="payment-item border-start border-primary ps-2">
                                    <p class="mb-0">Paiement #PAY-20250412 - 2,150.00 € - 12/04/2025</p>
                                </div>
                            </div>
                        </div>
                        <div class="match-criteria mt-2">
                            <span class="badge bg-warning me-1">Montant cumulé correspond</span>
                            <span class="badge bg-info me-1">Client identique</span>
                            <span class="badge bg-warning me-1">Dates proches</span>
                        </div>
                    </div>
                    <div class="suggestion-actions mt-3">
                        <button class="btn btn-success btn-sm">Valider ce rapprochement</button>
                        <button class="btn btn-outline-secondary btn-sm">Ignorer</button>
                        <button class="btn btn-outline-primary btn-sm">Ajuster les montants</button>
                    </div>
                </div>

                <!-- Correspondance N:1 (plusieurs factures, un paiement) -->
                <div class="suggestion-item mt-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h5 class="mb-0">Paiement #PAY-20250415</h5>
                            <span class="text-muted">Client: Martin SAS</span>
                            <span class="badge bg-primary ms-2">Relation N:1</span>
                        </div>
                        <div class="confidence-score">
                            <span class="badge bg-info">85%</span>
                        </div>
                    </div>
                    <div class="suggestion-details">
                        <div class="row">
                            <div class="col-md-6">
                                <p class="mb-1"><strong>Montant:</strong> 7,200.00 €</p>
                                <p class="mb-1"><strong>Date réception:</strong> 15/04/2025</p>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-1"><strong>Référence:</strong> MARTIN0415</p>
                                <p class="mb-1"><strong>Mode:</strong> Virement</p>
                            </div>
                        </div>
                        <div class="mt-2 mb-2">
                            <p class="mb-1"><strong>Factures associées:</strong></p>
                            <div class="associated-invoices">
                                <div class="invoice-item border-start border-info ps-2 mb-1">
                                    <p class="mb-0">Facture FAC-2025-0103 - 4,500.00 € - 01/04/2025</p>
                                </div>
                                <div class="invoice-item border-start border-info ps-2">
                                    <p class="mb-0">Facture FAC-2025-0112 - 2,700.00 € - 05/04/2025</p>
                                </div>
                            </div>
                        </div>
                        <div class="match-criteria mt-2">
                            <span class="badge bg-info me-1">Montant cumulé exact</span>
                            <span class="badge bg-info me-1">Client identique</span>
                            <span class="badge bg-warning me-1">Références partielles</span>
                        </div>
                    </div>
                    <div class="suggestion-actions mt-3">
                        <button class="btn btn-success btn-sm">Valider ce rapprochement</button>
                        <button class="btn btn-outline-secondary btn-sm">Ignorer</button>
                        <button class="btn btn-outline-primary btn-sm">Ajuster l'affectation</button>
                    </div>
                </div>
            `;
            
            // Ajouter les écouteurs pour les boutons de validation
            document.querySelectorAll('.suggestion-actions .btn-success').forEach(btn => {
                btn.addEventListener('click', function() {
                    const suggestionItem = this.closest('.suggestion-item');
                    const factureId = suggestionItem.querySelector('h5').textContent.split(' ')[1];
                    
                    showMatchConfirmation(factureId);
                });
            });
            
            // Ajouter des écouteurs pour les boutons d'ajustement spécifiques aux cas 1:N
            document.querySelectorAll('.suggestion-actions .btn-outline-primary').forEach(btn => {
                btn.addEventListener('click', function() {
                    const suggestionItem = this.closest('.suggestion-item');
                    const itemId = suggestionItem.querySelector('h5').textContent.split(' ')[1];
                    const isMultiFacture = suggestionItem.querySelector('.badge.bg-primary').textContent.includes('N:1');
                    
                    showAdjustmentModal(itemId, isMultiFacture);
                });
            });
        }, 1500);
    }
}

// Fonction pour calculer le score de confiance d'un rapprochement
function calculateConfidenceScore(matchCriteria) {
    let score = 0;
    let maxScore = 0;
    
    // Poids pour chaque critère
    const weights = {
        'montantExact': 40,
        'montantProche': 25,
        'referenceExacte': 25,
        'referencePartielle': 15,
        'clientIdentique': 20,
        'dateCorrespondante': 15,
        'dateProche': 8
    };
    
    // Calculer le score en fonction des critères présents
    for (const [criterion, value] of Object.entries(matchCriteria)) {
        if (value && weights[criterion]) {
            score += weights[criterion];
        }
        
        // Si le critère est applicable, ajouter son poids au score maximum possible
        if (criterion in weights) {
            maxScore += weights[criterion];
        }
    }
    
    // Calculer le pourcentage
    const confidencePercentage = Math.round((score / maxScore) * 100);
    
    // Déterminer si c'est un rapprochement automatique (100% de confiance)
    const isAutoMatch = confidencePercentage >= 95 && 
                         matchCriteria.montantExact && 
                         (matchCriteria.referenceExacte || matchCriteria.clientIdentique);
    
    return {
        score: confidencePercentage,
        isAutoMatch: isAutoMatch
    };
}

// Fonction pour afficher la modal d'ajustement pour les cas 1:N
function showAdjustmentModal(itemId, isMultiFacture) {
    // Créer le contenu de la modal en fonction du type de relation (1:N ou N:1)
    let modalTitle, modalContent;
    
    if (isMultiFacture) {
        modalTitle = "Ajuster l'affectation aux factures";
        modalContent = `
            <p>Paiement: <strong>#${itemId}</strong> - Montant total: <strong>7,200.00 €</strong></p>
            <div class="mb-3">
                <label class="form-label">Affectation aux factures:</label>
                <div class="adjustment-items">
                    <div class="adjustment-item mb-2">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <p class="mb-0">Facture FAC-2025-0103</p>
                                <small>Montant total: 4,500.00 €</small>
                            </div>
                            <div class="adjustment-amount">
                                <input type="number" class="form-control form-control-sm" value="4500" min="0" max="7200">
                            </div>
                        </div>
                    </div>
                    <div class="adjustment-item">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <p class="mb-0">Facture FAC-2025-0112</p>
                                <small>Montant total: 2,700.00 €</small>
                            </div>
                            <div class="adjustment-amount">
                                <input type="number" class="form-control form-control-sm" value="2700" min="0" max="7200">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between mt-3">
                    <span><strong>Reste à affecter:</strong></span>
                    <span class="remaining-amount">0.00 €</span>
                </div>
            </div>
        `;
    } else {
        modalTitle = "Ajuster les montants";
        modalContent = `
            <p>Facture: <strong>${itemId}</strong> - Montant total: <strong>5,800.00 €</strong></p>
            <div class="mb-3">
                <label class="form-label">Affectation des paiements:</label>
                <div class="adjustment-items">
                    <div class="adjustment-item mb-2">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <p class="mb-0">Paiement #PAY-20250408</p>
                                <small>Montant reçu: 3,650.00 €</small>
                            </div>
                            <div class="adjustment-amount">
                                <input type="number" class="form-control form-control-sm" value="3650" min="0" max="3650">
                            </div>
                        </div>
                    </div>
                    <div class="adjustment-item">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <p class="mb-0">Paiement #PAY-20250412</p>
                                <small>Montant reçu: 2,150.00 €</small>
                            </div>
                            <div class="adjustment-amount">
                                <input type="number" class="form-control form-control-sm" value="2150" min="0" max="2150">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between mt-3">
                    <span><strong>Reste à couvrir:</strong></span>
                    <span class="remaining-amount">0.00 €</span>
                </div>
            </div>
        `;
    }
    
    // Créer et afficher la modal
    const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
    document.getElementById('dynamicModalLabel').textContent = modalTitle;
    document.getElementById('dynamicModalBody').innerHTML = modalContent;
    document.getElementById('dynamicModalFooter').innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" id="saveAdjustment">Enregistrer</button>
    `;
    
    // Afficher la modal
    modal.show();
    
    // Ajouter l'écouteur pour calculer le reste à affecter/couvrir
    document.querySelectorAll('.adjustment-amount input').forEach(input => {
        input.addEventListener('input', updateRemainingAmount);
    });
    
    // Fonction pour mettre à jour le reste à affecter/couvrir
    function updateRemainingAmount() {
        const inputs = document.querySelectorAll('.adjustment-amount input');
        let total = 0;
        
        inputs.forEach(input => {
            total += parseFloat(input.value) || 0;
        });
        
        const remainingAmount = isMultiFacture ? 
            7200 - total : // Pour N:1 (montant du paiement - somme des montants affectés)
            5800 - total;  // Pour 1:N (montant de la facture - somme des montants affectés)
        
        const remainingAmountElement = document.querySelector('.remaining-amount');
        remainingAmountElement.textContent = remainingAmount.toFixed(2) + ' €';
        
        // Mise en évidence si le montant n'est pas équilibré
        if (Math.abs(remainingAmount) < 0.01) {
            remainingAmountElement.classList.remove('text-danger');
            remainingAmountElement.classList.add('text-success');
        } else {
            remainingAmountElement.classList.remove('text-success');
            remainingAmountElement.classList.add('text-danger');
        }
    }
    
    // Initialiser le calcul du reste
    updateRemainingAmount();
    
    // Ajouter l'écouteur pour le bouton d'enregistrement
    document.getElementById('saveAdjustment').addEventListener('click', function() {
        // Vérifier si le montant est équilibré
        const remainingAmount = parseFloat(document.querySelector('.remaining-amount').textContent);
        if (Math.abs(remainingAmount) < 0.01) {
            // Enregistrer les ajustements (simulé pour le moment)
            modal.hide();
            showToast('Ajustements enregistrés avec succès', 'success');
        } else {
            showToast('Le montant doit être complètement affecté', 'warning');
        }
    });
}

// Fonction pour afficher les détails d'un suspens
function showSuspensDetails(suspensId) {
    // Cette fonction serait implémentée pour afficher les détails d'un suspens spécifique
    console.log(`Affichage des détails du suspens ID: ${suspensId}`);
}

// Fonction pour valider un rapprochement
function validateMatch(paymentId) {
    // Cette fonction serait implémentée pour enregistrer la validation d'un rapprochement
    showToast(`Rapprochement validé pour le paiement ID: ${paymentId}`, 'success');
}

// Fonction pour effectuer des actions sur les éléments
function performAction(action, itemId) {
    switch(action) {
        case 'investigate':
            showToast(`Paiement ${itemId} marqué comme "En investigation"`, 'info');
            break;
        case 'followup':
            showToast(`Suspens ${itemId} marqué comme "À relancer"`, 'info');
            break;
        case 'check-swift':
            // Simuler une vérification SWIFT
            showToast(`Vérification SWIFT en cours pour ${itemId}...`, 'info');
            setTimeout(() => {
                showToast(`Aucune information SWIFT trouvée pour ${itemId}`, 'warning');
            }, 2000);
            break;
        default:
            console.log(`Action non reconnue: ${action} pour l'élément ${itemId}`);
    }
}

// Fonction pour initialiser les écouteurs des modals
function initModalListeners() {
    // Configuration des modals Bootstrap
    const modalElements = document.querySelectorAll('.modal');
    modalElements.forEach(modalElement => {
        const modal = new bootstrap.Modal(modalElement);
        
        // Fermeture du modal via les boutons de fermeture
        modalElement.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
            btn.addEventListener('click', function() {
                modal.hide();
            });
        });
    });

    // Initialiser les écouteurs pour la vue d'importation
    initImportListeners();

    // Initialiser les écouteurs pour la vue des paramètres
    initSettingsListeners();
}

// Fonctions pour la gestion des importations de données
function handleFileUpload(files, type) {
    if (!files || files.length === 0) return;
    
    // Activer le bouton d'import
    const importButton = document.querySelector(`#${type}-file-form .btn-primary`);
    if (importButton) {
        importButton.disabled = false;
    }
    
    // Afficher les fichiers sélectionnés
    let fileNames = Array.from(files).map(file => file.name).join(', ');
    
    // Mettre à jour l'interface pour montrer les fichiers sélectionnés
    const dropzone = document.querySelector(`#${type}-file-form .dropzone h5`);
    if (dropzone) {
        dropzone.textContent = files.length > 1 
            ? `${files.length} fichiers sélectionnés` 
            : fileNames;
    }
    
    showToast(`${files.length} fichier(s) prêt(s) à être importé(s)`, 'info');
}

// Initialisation des écouteurs pour la vue d'importation
function initImportListeners() {
    // Gestion des radios pour basculer entre API et fichier pour les paiements
    const receivableApiRadio = document.getElementById('receivable-api');
    const receivableFileRadio = document.getElementById('receivable-file');
    const receivableApiForm = document.getElementById('receivable-api-form');
    const receivableFileForm = document.getElementById('receivable-file-form');
    
    if (receivableApiRadio && receivableFileRadio) {
        receivableApiRadio.addEventListener('change', function() {
            if (this.checked) {
                receivableApiForm.style.display = 'block';
                receivableFileForm.style.display = 'none';
            }
        });
        
        receivableFileRadio.addEventListener('change', function() {
            if (this.checked) {
                receivableApiForm.style.display = 'none';
                receivableFileForm.style.display = 'block';
            }
        });
    }
    
    // Gestion des radios pour basculer entre API et fichier pour les suspens
    const pivotApiRadio = document.getElementById('pivot-api');
    const pivotFileRadio = document.getElementById('pivot-file');
    const pivotApiForm = document.getElementById('pivot-api-form');
    const pivotFileForm = document.getElementById('pivot-file-form');
    
    if (pivotApiRadio && pivotFileRadio) {
        pivotApiRadio.addEventListener('change', function() {
            if (this.checked) {
                pivotApiForm.style.display = 'block';
                pivotFileForm.style.display = 'none';
            }
        });
        
        pivotFileRadio.addEventListener('change', function() {
            if (this.checked) {
                pivotApiForm.style.display = 'none';
                pivotFileForm.style.display = 'block';
            }
        });
    }
    
    // Gestion des radios pour basculer entre API et fichier pour les factures
    const invoiceApiRadio = document.getElementById('invoice-api');
    const invoiceFileRadio = document.getElementById('invoice-file');
    const invoiceApiForm = document.getElementById('invoice-api-form');
    const invoiceFileForm = document.getElementById('invoice-file-form');
    
    if (invoiceApiRadio && invoiceFileRadio) {
        invoiceApiRadio.addEventListener('change', function() {
            if (this.checked) {
                invoiceApiForm.style.display = 'block';
                invoiceFileForm.style.display = 'none';
            }
        });
        
        invoiceFileRadio.addEventListener('change', function() {
            if (this.checked) {
                invoiceApiForm.style.display = 'none';
                invoiceFileForm.style.display = 'block';
            }
        });
    }
    
    // Gestion des uploads de fichiers
    const fileInputs = ['receivable', 'pivot', 'invoice'];
    
    fileInputs.forEach(type => {
        const fileInput = document.getElementById(`${type}-file-input`);
        const dropzone = document.querySelector(`#${type}-file-form .dropzone`);
        
        if (fileInput && dropzone) {
            fileInput.addEventListener('change', function() {
                handleFileUpload(this.files, type);
            });
            
            // Gestion du drag & drop
            dropzone.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.add('dragover');
            });
            
            dropzone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.remove('dragover');
            });
            
            dropzone.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.remove('dragover');
                
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    handleFileUpload(e.dataTransfer.files, type);
                }
            });
            
            // Gestion du clic sur la dropzone
            dropzone.addEventListener('click', function() {
                fileInput.click();
            });
        }
        
        // Gestion des boutons d'import
        const importButton = document.querySelector(`#${type}-file-form .btn-primary`);
        if (importButton) {
            importButton.addEventListener('click', function() {
                if (fileInput.files.length) {
                    // Simuler un import
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importation en cours...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        showToast(`Import des ${fileInput.files.length} fichier(s) ${type} réussi`, 'success');
                        this.innerHTML = '<i class="fas fa-upload"></i> Importer les fichiers';
                        this.disabled = true;
                        
                        // Réinitialiser l'affichage
                        const dropzoneTitle = document.querySelector(`#${type}-file-form .dropzone h5`);
                        if (dropzoneTitle) {
                            dropzoneTitle.textContent = 'Déposez vos fichiers ici';
                        }
                        
                        // Réinitialiser l'input
                        fileInput.value = '';
                    }, 2000);
                }
            });
        }
    });
    
    // Gestion des boutons d'API
    const apiButtons = document.querySelectorAll('.import-section .btn-primary:not([disabled])');
    apiButtons.forEach(button => {
        if (!button.closest('[id$="-file-form"]')) {
            button.addEventListener('click', function() {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion à l\'API...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importation des données...';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        
                        // Déterminer le type d'importation
                        let type = 'données';
                        if (this.closest('#receivable-api-form')) type = 'paiements';
                        else if (this.closest('#pivot-api-form')) type = 'suspens';
                        else if (this.closest('#invoice-api-form')) type = 'factures';
                        
                        showToast(`Import des ${type} via API réussi`, 'success');
                    }, 1500);
                }, 1500);
            });
        }
    });
}

// Fonction pour afficher les détails d'une importation
function showImportDetails(importId) {
    // Dans une application réelle, on récupérerait les détails depuis le backend
    
    const importDetails = {
        id: importId,
        date: '07/04/2025 10:15',
        type: 'Paiements',
        source: 'API Bancaire',
        user: 'Jean Dupont',
        count: 12,
        status: 'Succès',
        details: [
            { reference: 'PAY-20250407-001', amount: '1 250,00 €', status: 'Importé' },
            { reference: 'PAY-20250407-002', amount: '825,50 €', status: 'Importé' },
            { reference: 'PAY-20250407-003', amount: '2 150,75 €', status: 'Importé' },
            { reference: 'PAY-20250407-004', amount: '390,00 €', status: 'Importé' },
            { reference: 'PAY-20250407-005', amount: '1 575,25 €', status: 'Importé' }
        ]
    };
    
    // Créer et afficher un modal avec les détails
    let modalHtml = `
        <div class="modal fade" id="importDetailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails de l'importation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <p><strong>Date:</strong> ${importDetails.date}</p>
                                <p><strong>Type:</strong> ${importDetails.type}</p>
                                <p><strong>Source:</strong> ${importDetails.source}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Utilisateur:</strong> ${importDetails.user}</p>
                                <p><strong>Éléments importés:</strong> ${importDetails.count}</p>
                                <p><strong>Statut:</strong> <span class="badge bg-success">${importDetails.status}</span></p>
                            </div>
                        </div>
                        
                        <h6>Éléments importés</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Référence</th>
                                        <th>Montant</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
    `;
    
    importDetails.details.forEach(detail => {
        modalHtml += `
            <tr>
                <td>${detail.reference}</td>
                <td>${detail.amount}</td>
                <td><span class="badge bg-success">${detail.status}</span></td>
            </tr>
        `;
    });
    
    modalHtml += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter le modal au DOM s'il n'existe pas déjà
    if (!document.getElementById('importDetailsModal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
    } else {
        document.getElementById('importDetailsModal').outerHTML = modalHtml;
    }
    
    // Afficher le modal
    const importDetailsModal = new bootstrap.Modal(document.getElementById('importDetailsModal'));
    importDetailsModal.show();
}

// Initialisation des écouteurs pour la vue des paramètres
function initSettingsListeners() {
    // Gestion des boutons de configuration dans les paramètres
    const configButtons = document.querySelectorAll('.settings-card .btn-outline-primary');
    configButtons.forEach(button => {
        button.addEventListener('click', function() {
            const configType = this.closest('.mb-3').querySelector('.form-label').textContent;
            showConfigModal(configType);
        });
    });
    
    // Gestion du bouton "Ajouter un utilisateur"
    const addUserButton = document.querySelector('.settings-card .btn-primary');
    if (addUserButton && addUserButton.textContent.includes('Ajouter un utilisateur')) {
        addUserButton.addEventListener('click', function() {
            showUserModal();
        });
    }
    
    // Gestion des boutons d'édition d'utilisateur
    const editUserButtons = document.querySelectorAll('.settings-card .btn-outline-primary');
    editUserButtons.forEach(button => {
        if (button.innerHTML.includes('fa-edit')) {
            button.addEventListener('click', function() {
                const userName = this.closest('tr').querySelector('td:first-child').textContent;
                const userEmail = this.closest('tr').querySelector('td:nth-child(2)').textContent;
                const userRole = this.closest('tr').querySelector('td:nth-child(3)').textContent;
                
                showUserModal(userName, userEmail, userRole);
            });
        }
    });
    
    // Gestion du bouton "Enregistrer les paramètres"
    const saveSettingsButton = document.querySelector('#settings-view .btn-primary:last-child');
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', function() {
            // Simuler la sauvegarde
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                showToast('Paramètres enregistrés avec succès', 'success');
            }, 1500);
        });
    }
}

// Fonction pour afficher le modal de configuration
function showConfigModal(configType) {
    // Créer un contenu adapté au type de configuration
    let modalTitle = 'Configuration';
    let modalBody = '';
    
    if (configType.includes('Application de gestion')) {
        modalTitle = 'Configuration de l\'application de gestion';
        modalBody = `
            <div class="mb-3">
                <label class="form-label">URL de l'API</label>
                <input type="text" class="form-control" value="https://api.gestion.example.com/v1">
            </div>
            <div class="mb-3">
                <label class="form-label">Clé d'API</label>
                <div class="input-group">
                    <input type="password" class="form-control" value="api_key_12345">
                    <button class="btn btn-outline-secondary"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">Méthode d'authentification</label>
                <select class="form-select">
                    <option selected>OAuth 2.0</option>
                    <option>Clé API</option>
                    <option>JWT</option>
                </select>
            </div>
        `;
    } else if (configType.includes('API bancaire')) {
        modalTitle = 'Configuration de l\'API bancaire';
        modalBody = `
            <div class="mb-3">
                <label class="form-label">URL de l'API</label>
                <input type="text" class="form-control" value="https://api.banque.example.com/v2">
            </div>
            <div class="mb-3">
                <label class="form-label">Identifiant client</label>
                <input type="text" class="form-control" value="client_12345">
            </div>
            <div class="mb-3">
                <label class="form-label">Clé secrète</label>
                <div class="input-group">
                    <input type="password" class="form-control" value="secret_key_12345">
                    <button class="btn btn-outline-secondary"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">Format d'export</label>
                <select class="form-select">
                    <option selected>CAMT.053</option>
                    <option>JSON</option>
                    <option>CSV</option>
                </select>
            </div>
        `;
    }
    
    // Créer et afficher le modal
    let modalHtml = `
        <div class="modal fade" id="configModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${modalTitle}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${modalBody}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter le modal au DOM s'il n'existe pas déjà
    if (!document.getElementById('configModal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
    } else {
        document.getElementById('configModal').outerHTML = modalHtml;
    }
    
    // Afficher le modal
    const configModal = new bootstrap.Modal(document.getElementById('configModal'));
    configModal.show();
    
    // Ajouter l'écouteur pour le bouton Enregistrer
    document.querySelector('#configModal .btn-primary').addEventListener('click', function() {
        configModal.hide();
        showToast('Configuration enregistrée', 'success');
    });
}

// Fonction pour afficher le modal d'ajout/édition d'utilisateur
function showUserModal(name = '', email = '', role = '') {
    const isEdit = name !== '';
    
    // Créer et afficher le modal
    let modalHtml = `
        <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${isEdit ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Nom complet</label>
                            <input type="text" class="form-control" value="${name}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" value="${email}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Rôle</label>
                            <select class="form-select">
                                <option ${role === 'Administrateur' ? 'selected' : ''}>Administrateur</option>
                                <option ${role === 'Comptable' ? 'selected' : ''}>Comptable</option>
                                <option ${role === 'Lecture seule' ? 'selected' : ''}>Lecture seule</option>
                            </select>
                        </div>
                        ${!isEdit ? `
                        <div class="mb-3">
                            <label class="form-label">Mot de passe</label>
                            <input type="password" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Confirmer le mot de passe</label>
                            <input type="password" class="form-control">
                        </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary">${isEdit ? 'Enregistrer' : 'Ajouter'}</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter le modal au DOM s'il n'existe pas déjà
    if (!document.getElementById('userModal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
    } else {
        document.getElementById('userModal').outerHTML = modalHtml;
    }
    
    // Afficher le modal
    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    userModal.show();
    
    // Ajouter l'écouteur pour le bouton Enregistrer/Ajouter
    document.querySelector('#userModal .btn-primary').addEventListener('click', function() {
        userModal.hide();
        showToast(`Utilisateur ${isEdit ? 'modifié' : 'ajouté'} avec succès`, 'success');
    });
}

// Fonction pour afficher des notifications toast
function showToast(message, type = 'info') {
    // Créer le conteneur de toast s'il n'existe pas
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Créer un toast
    const toast = document.createElement('div');
    toast.className = `toast bg-${type} text-white`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="toast-header bg-${type} text-white">
            <strong class="me-auto">${type === 'info' ? 'Information' : type === 'success' ? 'Succès' : type === 'warning' ? 'Attention' : 'Erreur'}</strong>
            <small>à l'instant</small>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Ajouter le toast au conteneur
    toastContainer.appendChild(toast);
    
    // Initialiser le toast avec Bootstrap
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 5000
    });
    
    // Afficher le toast
    bsToast.show();
    
    // Ajouter l'écouteur pour supprimer le toast du DOM après sa fermeture
    toast.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// Initialisation des fonctionnalités de l'application au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Code existant...
    
    // Activer la vue par défaut (dashboard)
    document.getElementById('dashboard-view').classList.add('active');
    document.querySelector('a[data-view="dashboard"]').parentElement.classList.add('active');
});
