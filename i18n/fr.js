const translations = {
    // Éléments généraux
    "app_title": "Application de Rapprochement",
    "dashboard": "Tableau de bord",
    "payments": "Paiements",
    "suspens": "Suspens",
    "imports": "Importations",
    "settings": "Paramètres",
    "logout": "Déconnexion",

    // Navigation et sections
    "dashboard_title": "Tableau de bord",
    "receivables_title": "Paiements à rapprocher",
    "suspens_title": "Suspens en attente",
    "import_title": "Importation de données",
    "settings_title": "Paramètres",

    // KPI et statistiques
    "suspicious_payments": "Paiements suspects",
    "unmatched_payments": "Paiements non rapprochés",
    "processed_today": "Traitements du jour",
    "automatic_matches": "Rapprochements automatiques",
    "evolution_chart": "Évolution des suspens",
    "age_distribution_chart": "Répartition par âge des suspens",
    "january": "Janvier",
    "february": "Février",
    "march": "Mars",
    "april": "Avril",
    "may": "Mai",
    "june": "Juin",
    "open_suspens": "Suspens ouverts",
    "unmatched_payments_chart": "Paiements non rapprochés",
    "number": "Nombre",
    "less_than_15_days": "< 15 jours",
    "15_30_days": "15-30 jours",
    "30_60_days": "30-60 jours",
    "more_than_60_days": "> 60 jours",

    // Tableaux et listes
    "import_date": "Date d'importation",
    "file_name": "Nom du fichier",
    "status": "Statut",
    "records": "Enregistrements",
    "actions": "Actions",
    "reference": "Référence",
    "amount": "Montant",
    "client": "Client",
    "reception_date": "Date de réception",
    "match_status": "Statut du rapprochement",
    "validated": "Validé",
    "pending": "En attente",
    "invoice_number": "N° Facture",
    "issue_date": "Date d'émission",
    "due_date": "Date d'échéance",
    "age": "Âge",
    "days": "jours",

    // Rapprochements
    "match_suggestions": "Suggestions de rapprochement",
    "searching_matches": "Recherche des correspondances...",
    "invoice": "Facture",
    "payment": "Paiement",
    "confidence_score": "Indice de confiance",
    "exact_amount": "Montant exact",
    "exact_reference": "Référence exacte",
    "partial_reference": "Référence partielle",
    "identical_client": "Client identique",
    "matching_date": "Date correspondante",
    "close_dates": "Dates proches",
    "cumulative_amount_matches": "Montant cumulé correspond",
    "cumulative_amount_exact": "Montant cumulé exact",
    "relation_1_n": "Relation 1:N",
    "relation_n_1": "Relation N:1",
    "validate_match": "Valider ce rapprochement",
    "ignore": "Ignorer",
    "adjust_amounts": "Ajuster les montants",
    "adjust_allocation": "Ajuster l'affectation",
    "auto_match": "Rapprochement automatique",
    
    // Ajustements
    "adjust_amounts_title": "Ajuster les montants",
    "adjust_allocation_title": "Ajuster l'affectation aux factures",
    "total_amount": "Montant total",
    "allocation_to_invoices": "Affectation aux factures",
    "payment_allocation": "Affectation des paiements",
    "total_invoice_amount": "Montant total de la facture",
    "received_amount": "Montant reçu",
    "remaining_to_allocate": "Reste à affecter",
    "remaining_to_cover": "Reste à couvrir",
    "save": "Enregistrer",
    "cancel": "Annuler",
    
    // Notifications et messages
    "match_validated": "Rapprochement validé avec succès!",
    "adjustments_saved": "Ajustements enregistrés avec succès",
    "amount_must_be_fully_allocated": "Le montant doit être complètement affecté",
    "file_imported": "Fichier importé avec succès",
    "import_failed": "Échec de l'importation",
    "config_saved": "Configuration enregistrée",
    "user_added": "Utilisateur ajouté",
    "user_updated": "Utilisateur mis à jour",
    
    // Autres éléments spécifiques
    "associated_payments": "Paiements associés",
    "associated_invoices": "Factures associées",
    "payment_mode": "Mode de paiement",
    "wire_transfer": "Virement",
    "view": "Voir",
    "export": "Exporter",
    "delete": "Supprimer",
    "language": "Langue"
};

// Exporter les traductions pour une utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}
