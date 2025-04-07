const translations = {
    // General elements
    "app_title": "Reconciliation Application",
    "dashboard": "Dashboard",
    "payments": "Payments",
    "suspens": "Pending",
    "imports": "Imports",
    "settings": "Settings",
    "logout": "Logout",

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
    "evolution_chart": "Pending Items Evolution",
    "age_distribution_chart": "Age Distribution of Pending Items",
    "january": "January",
    "february": "February",
    "march": "March",
    "april": "April",
    "may": "May",
    "june": "June",
    "open_suspens": "Open Pending Items",
    "unmatched_payments_chart": "Unmatched Payments",
    "number": "Number",
    "less_than_15_days": "< 15 days",
    "15_30_days": "15-30 days",
    "30_60_days": "30-60 days",
    "more_than_60_days": "> 60 days",

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
    "file_imported": "File successfully imported",
    "import_failed": "Import failed",
    "config_saved": "Configuration saved",
    "user_added": "User added",
    "user_updated": "User updated",
    
    // Other specific elements
    "associated_payments": "Associated Payments",
    "associated_invoices": "Associated Invoices",
    "payment_mode": "Payment Mode",
    "wire_transfer": "Wire Transfer",
    "view": "View",
    "export": "Export",
    "delete": "Delete",
    "language": "Language"
};

// Export translations for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}
