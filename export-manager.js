/**
 * export-manager.js - Gestionnaire d'export des opérations rapprochées
 * 
 * Fonctionnalités:
 * - Export Excel des opérations rapprochées automatiquement
 * - Suivi des opérations exportées/non exportées
 * - Gestion des formats d'export pour compatibilité avec outils de gestion
 * - Historique des exports
 */

// Configuration du système d'export
const exportConfig = {
    // Format des données pour l'export
    exportFormat: {
        dateFormat: 'DD/MM/YYYY',
        includeHeaders: true,
        headerStyle: {
            bold: true,
            color: '#FFFFFF',
            backgroundColor: '#4472C4'
        },
        columns: [
            { field: 'date', header: 'Date', width: 15 },
            { field: 'reference', header: 'Référence', width: 20 },
            { field: 'client', header: 'Client', width: 30 },
            { field: 'amount', header: 'Montant', width: 15 },
            { field: 'confidence', header: 'Confiance (%)', width: 15 },
            { field: 'matchedBy', header: 'Rapproché par', width: 20 },
            { field: 'matchDate', header: 'Date de rapprochement', width: 15 }
        ]
    },
    
    // Paramètres pour l'export vers l'outil de gestion
    managementToolExport: {
        includeExtraData: true,
        statusField: 'CONFIRMED',
        fileName: 'paiements_confirmes.xlsx'
    },
    
    // Historique des exports
    trackExportHistory: true,
    markAsExported: true
};

// Historique des exports (pour le suivi)
let exportHistory = [];

/**
 * Initialisation du gestionnaire d'export
 */
document.addEventListener('DOMContentLoaded', function() {
    // Charger la configuration depuis localStorage ou utiliser les valeurs par défaut
    loadExportConfiguration();
    
    // Initialiser les écouteurs d'événements pour les boutons d'export
    initExportButtonListeners();
    
    // Charger l'historique des exports
    loadExportHistory();
});

/**
 * Charge la configuration d'export depuis le localStorage
 */
function loadExportConfiguration() {
    try {
        const savedConfig = localStorage.getItem('exportConfig');
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            
            // Fusionner avec les valeurs par défaut
            Object.assign(exportConfig, parsedConfig);
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la configuration d\'export:', error);
    }
}

/**
 * Sauvegarde la configuration d'export
 */
function saveExportConfiguration() {
    try {
        localStorage.setItem('exportConfig', JSON.stringify(exportConfig));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la configuration d\'export:', error);
    }
}

/**
 * Charge l'historique des exports depuis le localStorage
 */
function loadExportHistory() {
    try {
        const savedHistory = localStorage.getItem('exportHistory');
        if (savedHistory) {
            exportHistory = JSON.parse(savedHistory);
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'historique d\'export:', error);
    }
}

/**
 * Sauvegarde l'historique des exports
 */
function saveExportHistory() {
    try {
        localStorage.setItem('exportHistory', JSON.stringify(exportHistory));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'historique d\'export:', error);
    }
}

/**
 * Initialise les écouteurs pour les boutons d'export
 */
function initExportButtonListeners() {
    // Bouton d'export des rapprochements automatiques (tableau de bord)
    const exportAutoMatchedBtn = document.getElementById('export-auto-matched');
    if (exportAutoMatchedBtn) {
        exportAutoMatchedBtn.addEventListener('click', exportAutoMatchedOperations);
    }
    
    // Bouton d'export des rapprochements (vue rapprochement)
    const exportMatchedPaymentsBtn = document.getElementById('export-matched-payments');
    if (exportMatchedPaymentsBtn) {
        exportMatchedPaymentsBtn.addEventListener('click', exportMatchedPayments);
    }
}

/**
 * Exporte les opérations rapprochées automatiquement
 */
function exportAutoMatchedOperations() {
    // Récupérer les données des opérations rapprochées automatiquement
    const autoMatchedData = getAutoMatchedOperations();
    
    if (autoMatchedData.length === 0) {
        showNotification(window.__('no_operations_to_export'), 'warning');
        return;
    }
    
    // Exporter les données
    exportToExcel(autoMatchedData, 'operations_rapprochees_auto.xlsx');
    
    // Marquer les opérations comme exportées si cette option est activée
    if (exportConfig.markAsExported) {
        markOperationsAsExported(autoMatchedData);
        refreshAutoMatchedDisplay();
    }
    
    // Ajouter à l'historique
    addToExportHistory({
        date: new Date(),
        type: 'auto_matched',
        count: autoMatchedData.length,
        totalAmount: calculateTotalAmount(autoMatchedData)
    });
    
    // Afficher une notification
    showNotification(
        window.__('export_successful').replace('{0}', autoMatchedData.length),
        'success'
    );
}

/**
 * Exporte les paiements rapprochés pour l'outil de gestion
 */
function exportMatchedPayments() {
    // Récupérer tous les paiements rapprochés
    const matchedPayments = getAllMatchedPayments();
    
    if (matchedPayments.length === 0) {
        showNotification(window.__('no_payments_to_export'), 'warning');
        return;
    }
    
    // Formater les données pour l'outil de gestion
    const formattedData = formatForManagementTool(matchedPayments);
    
    // Exporter les données
    exportToExcel(formattedData, exportConfig.managementToolExport.fileName);
    
    // Marquer les paiements comme exportés
    if (exportConfig.markAsExported) {
        markPaymentsAsExported(matchedPayments);
        refreshPaymentsDisplay();
    }
    
    // Ajouter à l'historique
    addToExportHistory({
        date: new Date(),
        type: 'management_tool',
        count: matchedPayments.length,
        totalAmount: calculateTotalAmount(matchedPayments)
    });
    
    // Afficher une notification
    showNotification(
        window.__('export_to_management_tool_successful').replace('{0}', matchedPayments.length),
        'success'
    );
}

/**
 * Récupère les opérations rapprochées automatiquement
 * Note: ceci est une implémentation de démonstration, à remplacer par la logique réelle
 * @returns {Array} Tableau des opérations rapprochées automatiquement
 */
function getAutoMatchedOperations() {
    // Dans une implémentation réelle, cette fonction récupérerait les données depuis l'API
    // Pour la démonstration, on renvoie des données statiques
    return [
        {
            date: new Date(),
            reference: 'FAC-2025-0118',
            client: 'Dupont SARL',
            amount: 3450.00,
            confidence: 98,
            matchedBy: 'auto',
            matchDate: new Date()
        },
        {
            date: new Date(),
            reference: 'FAC-2025-0117',
            client: 'Martin & Fils',
            amount: 5820.00,
            confidence: 97,
            matchedBy: 'auto',
            matchDate: new Date()
        },
        {
            date: new Date(),
            reference: 'FAC-2025-0112',
            client: 'Techno Solutions',
            amount: 12350.00,
            confidence: 85,
            matchedBy: 'auto',
            matchDate: new Date()
        }
    ];
}

/**
 * Récupère tous les paiements rapprochés
 * Note: ceci est une implémentation de démonstration, à remplacer par la logique réelle
 * @returns {Array} Tableau des paiements rapprochés
 */
function getAllMatchedPayments() {
    // Dans une implémentation réelle, cette fonction récupérerait les données depuis l'API
    // Pour la démonstration, on renvoie des données statiques
    return [
        {
            date: new Date(),
            reference: 'FAC-2025-0118',
            client: 'Dupont SARL',
            amount: 3450.00,
            confidence: 98,
            matchedBy: 'auto',
            matchDate: new Date()
        },
        {
            date: new Date(),
            reference: 'FAC-2025-0117',
            client: 'Martin & Fils',
            amount: 5820.00,
            confidence: 97,
            matchedBy: 'auto',
            matchDate: new Date()
        },
        {
            date: new Date(),
            reference: 'FAC-2025-0112',
            client: 'Techno Solutions',
            amount: 12350.00,
            confidence: 85,
            matchedBy: 'auto',
            matchDate: new Date()
        },
        {
            date: new Date(Date.now() - 86400000),
            reference: 'FAC-2025-0109',
            client: 'Global Services',
            amount: 8750.00,
            confidence: 99,
            matchedBy: 'auto',
            matchDate: new Date(Date.now() - 86400000)
        },
        {
            date: new Date(Date.now() - 86400000),
            reference: 'FAC-2025-0105',
            client: 'Entreprise Durand',
            amount: 6120.00,
            confidence: 72,
            matchedBy: 'manual',
            matchDate: new Date(Date.now() - 86400000)
        }
    ];
}

/**
 * Formate les données pour l'export vers l'outil de gestion
 * @param {Array} data Données à formater
 * @returns {Array} Données formatées
 */
function formatForManagementTool(data) {
    return data.map(item => {
        const formatted = { ...item };
        
        // Formater la date
        formatted.date = formatDate(item.date);
        formatted.matchDate = formatDate(item.matchDate);
        
        // Ajouter le statut pour l'outil de gestion
        if (exportConfig.managementToolExport.includeExtraData) {
            formatted.status = exportConfig.managementToolExport.statusField;
        }
        
        return formatted;
    });
}

/**
 * Formate une date selon le format configuré
 * @param {Date} date Date à formater
 * @returns {string} Date formatée
 */
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
}

/**
 * Exporte les données vers un fichier Excel
 * @param {Array} data Données à exporter
 * @param {string} fileName Nom du fichier
 */
function exportToExcel(data, fileName) {
    // Cette fonction utiliserait une bibliothèque comme SheetJS (xlsx) dans une implémentation réelle
    // Pour la démonstration, nous allons simplement utiliser un export CSV basique
    
    // Créer les en-têtes
    const headers = exportConfig.exportFormat.columns.map(col => col.header);
    const fields = exportConfig.exportFormat.columns.map(col => col.field);
    
    // Construire le contenu CSV
    let csvContent = '';
    
    // Ajouter les en-têtes si demandé
    if (exportConfig.exportFormat.includeHeaders) {
        csvContent += headers.join(',') + '\n';
    }
    
    // Ajouter les données
    data.forEach(item => {
        const row = fields.map(field => {
            const value = item[field];
            // Échapper les virgules et les guillemets
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvContent += row.join(',') + '\n';
    });
    
    // Créer un objet Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    
    // Créer une URL pour le blob
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName.replace('.xlsx', '.csv'));
    link.style.visibility = 'hidden';
    
    // Ajouter le lien au document
    document.body.appendChild(link);
    
    // Cliquer sur le lien pour déclencher le téléchargement
    link.click();
    
    // Nettoyer
    document.body.removeChild(link);
}

/**
 * Marque les opérations comme exportées
 * @param {Array} operations Opérations à marquer
 */
function markOperationsAsExported(operations) {
    // Dans une implémentation réelle, cette fonction mettrait à jour le statut dans la base de données
    // Pour la démonstration, nous ne faisons rien
    console.log('Opérations marquées comme exportées:', operations.length);
}

/**
 * Marque les paiements comme exportés
 * @param {Array} payments Paiements à marquer
 */
function markPaymentsAsExported(payments) {
    // Dans une implémentation réelle, cette fonction mettrait à jour le statut dans la base de données
    // Pour la démonstration, nous ne faisons rien
    console.log('Paiements marqués comme exportés:', payments.length);
}

/**
 * Rafraîchit l'affichage des opérations rapprochées automatiquement
 */
function refreshAutoMatchedDisplay() {
    // Mettre à jour l'affichage des opérations rapprochées automatiquement
    const rows = document.querySelectorAll('#dashboard-view .auto-match-card tbody tr');
    rows.forEach(row => {
        const statusCell = row.querySelector('td:nth-child(6)');
        if (statusCell && statusCell.innerText.trim() === 'En attente') {
            statusCell.innerHTML = '<span class="status-badge status-exported">Exporté</span>';
        }
    });
}

/**
 * Rafraîchit l'affichage des paiements
 */
function refreshPaymentsDisplay() {
    // Dans une implémentation réelle, cette fonction mettrait à jour l'interface utilisateur
}

/**
 * Calcule le montant total d'un ensemble d'opérations
 * @param {Array} operations Opérations
 * @returns {number} Montant total
 */
function calculateTotalAmount(operations) {
    return operations.reduce((total, op) => total + op.amount, 0);
}

/**
 * Ajoute un enregistrement à l'historique des exports
 * @param {Object} record Enregistrement à ajouter
 */
function addToExportHistory(record) {
    if (!exportConfig.trackExportHistory) return;
    
    exportHistory.push(record);
    
    // Limiter la taille de l'historique (garder les 100 derniers exports)
    if (exportHistory.length > 100) {
        exportHistory = exportHistory.slice(-100);
    }
    
    saveExportHistory();
}

/**
 * Affiche une notification
 * @param {string} message Message à afficher
 * @param {string} type Type de notification (success, warning, error, info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.innerHTML = `
        <strong>${type === 'success' ? 'Succès!' : type === 'warning' ? 'Attention!' : type === 'error' ? 'Erreur!' : 'Info:'}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Ajouter la notification à la zone dédiée
    const notificationArea = document.querySelector('.notification-area');
    if (notificationArea) {
        notificationArea.appendChild(notification);
        
        // Disparaître après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 150);
        }, 5000);
    }
}

// Fonction utilitaire pour la traduction
// Elle utilise la fonction de traduction globale si elle existe, sinon renvoie la clé
window.__ = window.__ || function(key) {
    return key;
};
