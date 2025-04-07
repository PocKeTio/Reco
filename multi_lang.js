/**
 * Script pour la gestion multilingue de l'application
 */
document.addEventListener('DOMContentLoaded', function() {
    // Langues disponibles
    const languages = {
        'fr': 'Français',
        'en': 'English',
        'es': 'Español'
    };
    
    // Traductions
    const translations = {
        'fr': {
            // Éléments généraux
            "app_title": "RecoFinance - Rapprochement Bancaire",
            "dashboard": "Tableau de bord",
            "payments": "Paiements",
            "suspens": "Suspens",
            "imports": "Importations",
            "settings": "Paramètres",
            "logout": "Déconnexion",
            "search": "Rechercher...",
        
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
            "open_suspens": "Suspens ouverts",
            "older_than_30_days": "Suspens > 30 jours",
            "matched_this_month": "Rapprochés (ce mois)",
            "evolution_chart": "Évolution des suspens",
            "age_distribution_chart": "Répartition par âge des suspens",
            
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
            
            // Autres éléments spécifiques
            "associated_payments": "Paiements associés",
            "associated_invoices": "Factures associées",
            "payment_mode": "Mode de paiement",
            "wire_transfer": "Virement",
            "language": "Langue"
        },
        'en': {
            // General elements
            "app_title": "RecoFinance - Banking Reconciliation",
            "dashboard": "Dashboard",
            "payments": "Payments",
            "suspens": "Pending Items",
            "imports": "Imports",
            "settings": "Settings",
            "logout": "Logout",
            "search": "Search...",
        
            // Navigation and sections
            "dashboard_title": "Dashboard",
            "receivables_title": "Payments to Match",
            "suspens_title": "Pending Items",
            "import_title": "Data Import",
            "settings_title": "Settings",
        
            // KPIs and statistics
            "suspicious_payments": "Suspicious Payments",
            "unmatched_payments": "Unmatched Payments",
            "processed_today": "Processed Today",
            "automatic_matches": "Automatic Matches",
            "open_suspens": "Open Pending Items",
            "older_than_30_days": "Pending > 30 days",
            "matched_this_month": "Matched (this month)",
            "evolution_chart": "Pending Items Evolution",
            "age_distribution_chart": "Age Distribution of Pending Items",
            
            // Tables and lists
            "import_date": "Import Date",
            "file_name": "File Name",
            "status": "Status",
            "records": "Records",
            "actions": "Actions",
            "reference": "Reference",
            "amount": "Amount",
            "client": "Client",
            "reception_date": "Reception Date",
            "match_status": "Match Status",
            "validated": "Validated",
            "pending": "Pending",
            "invoice_number": "Invoice Number",
            "issue_date": "Issue Date",
            "due_date": "Due Date",
            "age": "Age",
            "days": "days",
            
            // Matching
            "match_suggestions": "Match Suggestions",
            "searching_matches": "Searching for matches...",
            "invoice": "Invoice",
            "payment": "Payment",
            "confidence_score": "Confidence Score",
            "exact_amount": "Exact Amount",
            "exact_reference": "Exact Reference",
            "partial_reference": "Partial Reference",
            "identical_client": "Identical Client",
            "matching_date": "Matching Date",
            "close_dates": "Close Dates",
            "cumulative_amount_matches": "Cumulative Amount Matches",
            "cumulative_amount_exact": "Exact Cumulative Amount",
            "relation_1_n": "1:N Relation",
            "relation_n_1": "N:1 Relation",
            "validate_match": "Validate this Match",
            "ignore": "Ignore",
            "adjust_amounts": "Adjust Amounts",
            "adjust_allocation": "Adjust Allocation",
            "auto_match": "Auto Match",
            
            // Adjustments
            "adjust_amounts_title": "Adjust Amounts",
            "adjust_allocation_title": "Adjust Allocation to Invoices",
            "total_amount": "Total Amount",
            "allocation_to_invoices": "Allocation to Invoices",
            "payment_allocation": "Payment Allocation",
            "total_invoice_amount": "Total Invoice Amount",
            "received_amount": "Received Amount",
            "remaining_to_allocate": "Remaining to Allocate",
            "remaining_to_cover": "Remaining to Cover",
            "save": "Save",
            "cancel": "Cancel",
            
            // Notifications and messages
            "match_validated": "Match successfully validated!",
            "adjustments_saved": "Adjustments successfully saved",
            "amount_must_be_fully_allocated": "Amount must be fully allocated",
            
            // Other specific elements
            "associated_payments": "Associated Payments",
            "associated_invoices": "Associated Invoices",
            "payment_mode": "Payment Mode",
            "wire_transfer": "Wire Transfer",
            "language": "Language"
        },
        'es': {
            // Elementos generales
            "app_title": "RecoFinance - Conciliación Bancaria",
            "dashboard": "Panel de Control",
            "payments": "Pagos",
            "suspens": "Pendientes",
            "imports": "Importaciones",
            "settings": "Configuraciones",
            "logout": "Cerrar Sesión",
            "search": "Buscar...",
        
            // Navegación y secciones
            "dashboard_title": "Panel de Control",
            "receivables_title": "Pagos por Conciliar",
            "suspens_title": "Elementos Pendientes",
            "import_title": "Importación de Datos",
            "settings_title": "Configuraciones",
        
            // KPI y estadísticas
            "suspicious_payments": "Pagos Sospechosos",
            "unmatched_payments": "Pagos No Conciliados",
            "processed_today": "Procesados Hoy",
            "automatic_matches": "Conciliaciones Automáticas",
            "open_suspens": "Pendientes Abiertos",
            "older_than_30_days": "Pendientes > 30 días",
            "matched_this_month": "Conciliados (este mes)",
            "evolution_chart": "Evolución de Pendientes",
            "age_distribution_chart": "Distribución por Antigüedad",
            
            // Tablas y listas
            "import_date": "Fecha de Importación",
            "file_name": "Nombre del Archivo",
            "status": "Estado",
            "records": "Registros",
            "actions": "Acciones",
            "reference": "Referencia",
            "amount": "Monto",
            "client": "Cliente",
            "reception_date": "Fecha de Recepción",
            "match_status": "Estado de Conciliación",
            "validated": "Validado",
            "pending": "Pendiente",
            "invoice_number": "Número de Factura",
            "issue_date": "Fecha de Emisión",
            "due_date": "Fecha de Vencimiento",
            "age": "Antigüedad",
            "days": "días",
            
            // Conciliaciones
            "match_suggestions": "Sugerencias de Conciliación",
            "searching_matches": "Buscando coincidencias...",
            "invoice": "Factura",
            "payment": "Pago",
            "confidence_score": "Nivel de Confianza",
            "exact_amount": "Monto Exacto",
            "exact_reference": "Referencia Exacta",
            "partial_reference": "Referencia Parcial",
            "identical_client": "Cliente Idéntico",
            "matching_date": "Fecha Correspondiente",
            "close_dates": "Fechas Cercanas",
            "cumulative_amount_matches": "Monto Acumulado Coincide",
            "cumulative_amount_exact": "Monto Acumulado Exacto",
            "relation_1_n": "Relación 1:N",
            "relation_n_1": "Relación N:1",
            "validate_match": "Validar esta Conciliación",
            "ignore": "Ignorar",
            "adjust_amounts": "Ajustar Montos",
            "adjust_allocation": "Ajustar Asignación",
            "auto_match": "Conciliación Automática",
            
            // Ajustes
            "adjust_amounts_title": "Ajustar Montos",
            "adjust_allocation_title": "Ajustar Asignación a Facturas",
            "total_amount": "Monto Total",
            "allocation_to_invoices": "Asignación a Facturas",
            "payment_allocation": "Asignación de Pagos",
            "total_invoice_amount": "Monto Total de Factura",
            "received_amount": "Monto Recibido",
            "remaining_to_allocate": "Restante por Asignar",
            "remaining_to_cover": "Restante por Cubrir",
            "save": "Guardar",
            "cancel": "Cancelar",
            
            // Notificaciones y mensajes
            "match_validated": "¡Conciliación validada con éxito!",
            "adjustments_saved": "Ajustes guardados con éxito",
            "amount_must_be_fully_allocated": "El monto debe ser completamente asignado",
            
            // Otros elementos específicos
            "associated_payments": "Pagos Asociados",
            "associated_invoices": "Facturas Asociadas",
            "payment_mode": "Modo de Pago",
            "wire_transfer": "Transferencia Bancaria",
            "language": "Idioma"
        }
    };
    
    // Langue par défaut
    let currentLanguage = localStorage.getItem('appLanguage') || 'fr';
    
    // Initialiser la langue
    setLanguage(currentLanguage);
    
    // Mettre à jour le sélecteur de langue
    updateLanguageSelector();
    
    // Fonction pour définir la langue
    function setLanguage(lang) {
        if (!translations[lang]) {
            console.error(`Langue '${lang}' non disponible.`);
            return;
        }
        
        // Sauvegarder la langue sélectionnée
        currentLanguage = lang;
        localStorage.setItem('appLanguage', lang);
        
        // Mettre à jour l'attribut lang de la page
        document.documentElement.lang = lang;
        
        // Traduire tous les éléments
        translatePage();
    }
    
    // Fonction pour mettre à jour le sélecteur de langue
    function updateLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        if (!languageSelector) {
            // Créer le sélecteur s'il n'existe pas
            const navbar = document.querySelector('.navbar .ms-auto');
            if (navbar) {
                const langSelectorDiv = document.createElement('div');
                langSelectorDiv.className = 'language-selector me-3';
                
                const select = document.createElement('select');
                select.id = 'language-selector';
                select.className = 'form-select form-select-sm';
                
                // Ajouter les options pour chaque langue
                Object.keys(languages).forEach(langCode => {
                    const option = document.createElement('option');
                    option.value = langCode;
                    option.textContent = languages[langCode];
                    if (langCode === currentLanguage) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });
                
                // Ajouter l'écouteur d'événement
                select.addEventListener('change', function() {
                    setLanguage(this.value);
                });
                
                langSelectorDiv.appendChild(select);
                
                // Insérer avant la première notification
                const firstChild = navbar.firstChild;
                navbar.insertBefore(langSelectorDiv, firstChild);
            }
        } else {
            // Mettre à jour la sélection
            languageSelector.value = currentLanguage;
        }
    }
    
    // Fonction pour traduire la page
    function translatePage() {
        const trans = translations[currentLanguage];
        
        // Traduire le titre
        document.title = trans['app_title'] || 'RecoFinance';
        
        // Traduire les éléments avec l'attribut data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (trans[key]) {
                element.textContent = trans[key];
            }
        });
        
        // Traduire les attributs placeholder, title, etc.
        ['placeholder', 'title', 'alt'].forEach(attr => {
            document.querySelectorAll(`[data-i18n-${attr}]`).forEach(element => {
                const key = element.getAttribute(`data-i18n-${attr}`);
                if (trans[key]) {
                    element.setAttribute(attr, trans[key]);
                }
            });
        });
        
        // Traduire les éléments du menu latéral si data-i18n n'est pas défini
        document.querySelectorAll('#sidebar .components li a').forEach(item => {
            const text = item.lastChild;
            const view = item.getAttribute('data-view');
            if (view && !item.querySelector('[data-i18n]')) {
                // Créer un span avec data-i18n si nécessaire
                const icon = item.querySelector('i');
                item.innerHTML = '';
                if (icon) item.appendChild(icon);
                const span = document.createElement('span');
                span.setAttribute('data-i18n', view);
                span.textContent = trans[view] || view;
                item.appendChild(span);
            }
        });
        
        // Traduire les graphiques
        updateChartLabels();
    }
    
    // Fonction pour mettre à jour les libellés des graphiques
    function updateChartLabels() {
        const trans = translations[currentLanguage];
        
        // Si Chart.js est disponible
        if (window.Chart && Chart.instances) {
            Chart.instances.forEach(chart => {
                if (chart.config.type === 'line' && chart.canvas.id === 'suspensChart') {
                    // Mise à jour des libellés pour le graphique d'évolution
                    const months = ['january', 'february', 'march', 'april', 'may', 'june'];
                    if (chart.data.labels) {
                        chart.data.labels = months.map(month => trans[month] || month);
                    }
                    
                    if (chart.data.datasets) {
                        chart.data.datasets.forEach(dataset => {
                            if (dataset.label === 'Suspens ouverts') {
                                dataset.label = trans['open_suspens'] || 'Open Pending Items';
                            } else if (dataset.label === 'Paiements non rapprochés') {
                                dataset.label = trans['unmatched_payments'] || 'Unmatched Payments';
                            }
                        });
                    }
                    
                    if (chart.options && chart.options.scales && chart.options.scales.y && chart.options.scales.y.title) {
                        chart.options.scales.y.title.text = trans['number'] || 'Number';
                    }
                    
                    chart.update();
                } else if (chart.config.type === 'doughnut' && chart.canvas.id === 'ageDistributionChart') {
                    // Mise à jour des libellés pour le graphique de répartition par âge
                    const ageLabels = ['less_than_15_days', '15_30_days', '30_60_days', 'more_than_60_days'];
                    if (chart.data.labels) {
                        chart.data.labels = ageLabels.map(label => trans[label] || label);
                    }
                    
                    chart.update();
                }
            });
        }
    }
    
    // Écouter les changements de langue depuis le sélecteur s'il existe
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            setLanguage(this.value);
        });
    }
});
