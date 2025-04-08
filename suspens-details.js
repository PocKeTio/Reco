/**
 * Module de gestion des détails enrichis des suspens
 * Permet d'ajouter les informations de garantie, références, SWIFT, etc.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialise les détails enrichis pour les suspens
    initSuspensDetails();
    
    /**
     * Initialise les détails enrichis des suspens
     */
    function initSuspensDetails() {
        // Modification de la structure du modal de détails 
        const modalBody = document.querySelector('#suspensDetailModal .modal-body');
        if (!modalBody) return;
        
        // Modification du contenu du modal pour inclure les onglets et les informations enrichies
        enrichSuspensModal(modalBody);
        
        // Écouteur d'événement pour l'ouverture du modal
        const suspensDetailModal = document.getElementById('suspensDetailModal');
        if (suspensDetailModal) {
            suspensDetailModal.addEventListener('show.bs.modal', function(event) {
                // Récupère le bouton qui a déclenché le modal
                const button = event.relatedTarget;
                // Récupère l'ID du suspens
                const suspensId = button.getAttribute('data-suspens-id') || 'UNKNOWN';
                
                // Charge les données du suspens
                loadSuspensData(suspensId);
            });
        }
    }
    
    /**
     * Enrichit la structure du modal avec les onglets et les zones d'information
     */
    function enrichSuspensModal(modalBody) {
        // Structure HTML pour les onglets et le contenu
        const modalContent = `
            <div class="d-flex justify-content-between mb-3">
                <h4 id="suspens-reference">FAC-2025-0042</h4>
                <span class="badge bg-danger" id="suspens-status-badge">En investigation depuis 43 jours</span>
            </div>
            
            <ul class="nav nav-tabs mb-3" id="suspensDetailTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="basic-tab" data-bs-toggle="tab" data-bs-target="#basic-info" type="button" role="tab" aria-controls="basic-info" aria-selected="true">Informations générales</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="guarantee-tab" data-bs-toggle="tab" data-bs-target="#guarantee-info" type="button" role="tab" aria-controls="guarantee-info" aria-selected="false">Garantie</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="swift-tab" data-bs-toggle="tab" data-bs-target="#swift-info-tab" type="button" role="tab" aria-controls="swift-info-tab" aria-selected="false">SWIFT</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history-info" type="button" role="tab" aria-controls="history-info" aria-selected="false">Historique</button>
                </li>
            </ul>
            
            <div class="tab-content" id="suspensDetailTabContent">
                <!-- Onglet Informations générales -->
                <div class="tab-pane fade show active" id="basic-info" role="tabpanel" aria-labelledby="basic-tab">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <div class="detail-group">
                                <h5>Informations client</h5>
                                <div class="detail-item">
                                    <span class="detail-label">Client:</span>
                                    <span class="detail-value" id="client-name">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Référence:</span>
                                    <span class="detail-value" id="suspens-ref">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Montant:</span>
                                    <span class="detail-value" id="suspens-amount">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Date de création:</span>
                                    <span class="detail-value" id="creation-date">-</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-group">
                                <h5>Statut et assignation</h5>
                                <div class="detail-item">
                                    <span class="detail-label">Statut:</span>
                                    <span class="detail-value" id="suspens-status">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Assigné à:</span>
                                    <span class="detail-value" id="assigned-to">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Dernière action:</span>
                                    <span class="detail-value" id="last-action">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Entité de booking:</span>
                                    <span class="detail-value" id="booking-entity">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Compte:</span>
                                    <span class="detail-value" id="account-name">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="detail-group">
                                <h5>Commentaires</h5>
                                <div class="comments-container" id="comments-list">
                                    <!-- Les commentaires seront injectés ici -->
                                </div>
                                <div class="mt-3">
                                    <textarea class="form-control" rows="2" placeholder="Ajouter un commentaire..." id="new-comment"></textarea>
                                    <button class="btn btn-sm btn-primary mt-2" id="add-comment-btn">Ajouter</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Onglet Garantie -->
                <div class="tab-pane fade" id="guarantee-info" role="tabpanel" aria-labelledby="guarantee-tab">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <div class="detail-group">
                                <h5>Informations de garantie</h5>
                                <div class="detail-item">
                                    <span class="detail-label">Référence garantie:</span>
                                    <span class="detail-value" id="guarantee-ref">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Référence BGI:</span>
                                    <span class="detail-value" id="bgi-ref">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Statut garantie:</span>
                                    <span class="detail-value" id="guarantee-status">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Montant garanti:</span>
                                    <span class="detail-value" id="guarantee-amount">-</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-group">
                                <h5>Dates importantes</h5>
                                <div class="detail-item">
                                    <span class="detail-label">Date d'émission:</span>
                                    <span class="detail-value" id="issue-date">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Date d'expiration:</span>
                                    <span class="detail-value" id="expiry-date">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Dernier amendement:</span>
                                    <span class="detail-value" id="last-amendment">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Type de garantie:</span>
                                    <span class="detail-value" id="guarantee-type">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-12">
                            <div class="detail-group">
                                <h5>Notes de garantie</h5>
                                <div class="p-3 border rounded bg-light" id="guarantee-notes">
                                    <!-- Les notes seront injectées ici -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Onglet SWIFT -->
                <div class="tab-pane fade" id="swift-info-tab" role="tabpanel" aria-labelledby="swift-tab">
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <div class="detail-group">
                                <h5>Dernier message SWIFT</h5>
                                <div class="detail-item">
                                    <span class="detail-label">Référence SWIFT:</span>
                                    <span class="detail-value" id="swift-ref">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Date du message:</span>
                                    <span class="detail-value" id="swift-date">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Type de message:</span>
                                    <span class="detail-value" id="message-type">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Statut:</span>
                                    <span class="detail-value" id="swift-status">-</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-group">
                                <h5>Détails du message</h5>
                                <div class="detail-item">
                                    <span class="detail-label">Expéditeur:</span>
                                    <span class="detail-value" id="swift-sender">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Destinataire:</span>
                                    <span class="detail-value" id="swift-receiver">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Motif du délai:</span>
                                    <span class="detail-value" id="delay-reason">-</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Date estimée de traitement:</span>
                                    <span class="detail-value" id="processing-date">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-12">
                            <h5>Historique des messages</h5>
                            <div class="table-responsive">
                                <table class="table table-sm table-hover">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Statut</th>
                                            <th>Message</th>
                                        </tr>
                                    </thead>
                                    <tbody id="swift-history">
                                        <!-- L'historique SWIFT sera injecté ici -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Onglet Historique -->
                <div class="tab-pane fade" id="history-info" role="tabpanel" aria-labelledby="history-tab">
                    <div class="row mb-4">
                        <div class="col-12">
                            <h5>Activités du suspens</h5>
                            <div class="table-responsive">
                                <table class="table table-sm table-hover">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Utilisateur</th>
                                            <th>Action</th>
                                            <th>Détails</th>
                                        </tr>
                                    </thead>
                                    <tbody id="suspens-history">
                                        <!-- L'historique sera injecté ici -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remplace le contenu du modal
        modalBody.innerHTML = modalContent;
        
        // Ajout du gestionnaire d'événements pour l'ajout de commentaires
        const addCommentBtn = document.getElementById('add-comment-btn');
        if (addCommentBtn) {
            addCommentBtn.addEventListener('click', function() {
                addComment();
            });
        }
    }
    
    /**
     * Charge les données d'un suspens
     * @param {string} suspensId - L'identifiant du suspens
     */
    function loadSuspensData(suspensId) {
        // Dans un environnement réel, ces données seraient récupérées via une API
        // Nous simulons ici un jeu de données
        
        // Données simulées pour le suspens
        const suspensData = {
            'FAC-2025-0042': {
                reference: 'FAC-2025-0042',
                client: 'Durand & Cie',
                amount: '4 250,00 €',
                creationDate: '23/02/2025',
                status: 'investigate',
                statusDisplayName: 'En investigation',
                daysSinceOpen: 43,
                assignedTo: 'Marie Dupont',
                lastAction: 'Contact client 25/03',
                bookingEntity: 'France',
                account: 'Receivable-FR',
                comments: [
                    { author: 'Marie Dupont', date: '25/03/2025 14:30', content: 'Client contacté par téléphone, en attente de leur confirmation sur le numéro de facture exact.' },
                    { author: 'Jean Martin', date: '05/03/2025 10:15', content: 'Email envoyé au client pour demander des précisions sur le paiement.' }
                ],
                guarantee: {
                    reference: 'G2504FR000123456',
                    bgiReference: 'BGI123456789',
                    status: 'active',
                    amount: '5 000,00 €',
                    issueDate: '15/01/2025',
                    expiryDate: '15/01/2026',
                    lastAmendment: '20/02/2025',
                    type: 'Lettre de crédit standby',
                    notes: 'La garantie a été émise selon les conditions suivantes : paiement à première demande, irrévocable, soumise aux règles ISP 98. Cette garantie couvre entièrement le montant du suspens et reste valide jusqu\'à la réception du paiement complet.'
                },
                swift: {
                    reference: 'SWFTRF20250406789541',
                    date: '02/04/2025 14:35',
                    type: 'MT103 (Transfert client)',
                    status: 'pending',
                    sender: 'BNPAFRPP',
                    receiver: 'SOCGFRPP',
                    delayReason: 'Vérification KYC supplémentaire',
                    processingDate: '08/04/2025',
                    history: [
                        { date: '02/04/2025 14:35', type: 'MT103', status: 'sent', message: 'Initiation du transfert' },
                        { date: '03/04/2025 09:12', type: 'MT199', status: 'pending', message: 'Vérification KYC requise' },
                        { date: '04/04/2025 11:45', type: 'MT299', status: 'info', message: 'Documents KYC en cours d\'analyse' }
                    ]
                },
                history: [
                    { date: '25/03/2025 14:30', user: 'Marie Dupont', action: 'Contact client', details: 'Appel téléphonique pour vérification' },
                    { date: '15/03/2025 09:45', user: 'Système', action: 'Changement de statut', details: 'Passage de "Ouvert" à "En investigation"' },
                    { date: '05/03/2025 10:15', user: 'Jean Martin', action: 'Contact client', details: 'Email envoyé' },
                    { date: '23/02/2025 08:30', user: 'Système', action: 'Création', details: 'Suspens créé automatiquement' }
                ]
            },
            // Autres suspens...
        };
        
        // Récupère les données du suspens
        const data = suspensData[suspensId] || null;
        
        // Si on a des données, on les affiche
        if (data) {
            populateSuspensDetails(data);
        } else {
            console.warn(`Aucune donnée trouvée pour le suspens ${suspensId}`);
        }
    }
    
    /**
     * Remplit les détails du suspens dans le modal
     * @param {Object} data - Les données du suspens
     */
    function populateSuspensDetails(data) {
        // Informations générales
        document.getElementById('suspens-reference').textContent = data.reference;
        document.getElementById('suspens-status-badge').textContent = `${data.statusDisplayName} depuis ${data.daysSinceOpen} jours`;
        document.getElementById('client-name').textContent = data.client;
        document.getElementById('suspens-ref').textContent = data.reference;
        document.getElementById('suspens-amount').textContent = data.amount;
        document.getElementById('creation-date').textContent = data.creationDate;
        document.getElementById('suspens-status').innerHTML = `<span class="status status-${data.status}">${data.statusDisplayName}</span>`;
        document.getElementById('assigned-to').textContent = data.assignedTo;
        document.getElementById('last-action').textContent = data.lastAction;
        document.getElementById('booking-entity').textContent = data.bookingEntity;
        document.getElementById('account-name').textContent = data.account;
        
        // Commentaires
        const commentsContainer = document.getElementById('comments-list');
        commentsContainer.innerHTML = '';
        
        data.comments.forEach(comment => {
            const commentHTML = `
                <div class="comment">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                    <div class="comment-body">
                        ${comment.content}
                    </div>
                </div>
            `;
            commentsContainer.innerHTML += commentHTML;
        });
        
        // Informations de garantie
        if (data.guarantee) {
            document.getElementById('guarantee-ref').textContent = data.guarantee.reference;
            document.getElementById('bgi-ref').textContent = data.guarantee.bgiReference;
            
            let statusBadge = '';
            if (data.guarantee.status === 'active') {
                statusBadge = '<span class="badge bg-success">Active</span>';
            } else if (data.guarantee.status === 'released') {
                statusBadge = '<span class="badge bg-secondary">Main levée</span>';
            } else {
                statusBadge = `<span class="badge bg-info">${data.guarantee.status}</span>`;
            }
            
            document.getElementById('guarantee-status').innerHTML = statusBadge;
            document.getElementById('guarantee-amount').textContent = data.guarantee.amount;
            document.getElementById('issue-date').textContent = data.guarantee.issueDate;
            document.getElementById('expiry-date').textContent = data.guarantee.expiryDate;
            document.getElementById('last-amendment').textContent = data.guarantee.lastAmendment;
            document.getElementById('guarantee-type').textContent = data.guarantee.type;
            document.getElementById('guarantee-notes').innerHTML = `<p>${data.guarantee.notes.replace(/\n/g, '</p><p>')}</p>`;
        }
        
        // Informations SWIFT
        if (data.swift) {
            document.getElementById('swift-ref').textContent = data.swift.reference;
            document.getElementById('swift-date').textContent = data.swift.date;
            document.getElementById('message-type').textContent = data.swift.type;
            
            let swiftStatusBadge = '';
            if (data.swift.status === 'pending') {
                swiftStatusBadge = '<span class="badge bg-warning">En attente</span>';
            } else if (data.swift.status === 'sent') {
                swiftStatusBadge = '<span class="badge bg-success">Envoyé</span>';
            } else if (data.swift.status === 'info') {
                swiftStatusBadge = '<span class="badge bg-info">Information</span>';
            } else {
                swiftStatusBadge = `<span class="badge bg-secondary">${data.swift.status}</span>`;
            }
            
            document.getElementById('swift-status').innerHTML = swiftStatusBadge;
            document.getElementById('swift-sender').textContent = data.swift.sender;
            document.getElementById('swift-receiver').textContent = data.swift.receiver;
            document.getElementById('delay-reason').textContent = data.swift.delayReason;
            document.getElementById('processing-date').textContent = data.swift.processingDate;
            
            // Historique SWIFT
            const swiftHistoryContainer = document.getElementById('swift-history');
            swiftHistoryContainer.innerHTML = '';
            
            data.swift.history.forEach(item => {
                let statusBadge = '';
                if (item.status === 'pending') {
                    statusBadge = '<span class="badge bg-warning">En attente</span>';
                } else if (item.status === 'sent') {
                    statusBadge = '<span class="badge bg-success">Envoyé</span>';
                } else if (item.status === 'info') {
                    statusBadge = '<span class="badge bg-info">Information</span>';
                } else {
                    statusBadge = `<span class="badge bg-secondary">${item.status}</span>`;
                }
                
                const rowHTML = `
                    <tr>
                        <td>${item.date}</td>
                        <td>${item.type}</td>
                        <td>${statusBadge}</td>
                        <td>${item.message}</td>
                    </tr>
                `;
                swiftHistoryContainer.innerHTML += rowHTML;
            });
        }
        
        // Historique des activités
        if (data.history) {
            const historyContainer = document.getElementById('suspens-history');
            historyContainer.innerHTML = '';
            
            data.history.forEach(item => {
                const rowHTML = `
                    <tr>
                        <td>${item.date}</td>
                        <td>${item.user}</td>
                        <td>${item.action}</td>
                        <td>${item.details}</td>
                    </tr>
                `;
                historyContainer.innerHTML += rowHTML;
            });
        }
    }
    
    /**
     * Ajoute un nouveau commentaire
     */
    function addComment() {
        const commentInput = document.getElementById('new-comment');
        if (!commentInput || !commentInput.value.trim()) return;
        
        const commentHTML = `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">Utilisateur actuel</span>
                    <span class="comment-date">${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="comment-body">
                    ${commentInput.value.trim()}
                </div>
            </div>
        `;
        
        const commentsContainer = document.getElementById('comments-list');
        commentsContainer.innerHTML = commentHTML + commentsContainer.innerHTML;
        
        // Vide le champ de saisie
        commentInput.value = '';
    }
    
    // Expose des fonctions publiques
    window.suspensDetails = {
        loadSuspensData: loadSuspensData
    };
});
