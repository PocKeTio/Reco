const translations = {
    // Elementos generales
    "app_title": "Aplicación de Conciliación",
    "dashboard": "Panel de Control",
    "payments": "Pagos",
    "suspens": "Pendientes",
    "imports": "Importaciones",
    "settings": "Configuraciones",
    "logout": "Cerrar Sesión",

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
    "evolution_chart": "Evolución de Pendientes",
    "age_distribution_chart": "Distribución por Antigüedad",
    "january": "Enero",
    "february": "Febrero",
    "march": "Marzo",
    "april": "Abril",
    "may": "Mayo",
    "june": "Junio",
    "open_suspens": "Pendientes Abiertos",
    "unmatched_payments_chart": "Pagos No Conciliados",
    "number": "Número",
    "less_than_15_days": "< 15 días",
    "15_30_days": "15-30 días",
    "30_60_days": "30-60 días",
    "more_than_60_days": "> 60 días",

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
    "file_imported": "Archivo importado con éxito",
    "import_failed": "Importación fallida",
    "config_saved": "Configuración guardada",
    "user_added": "Usuario añadido",
    "user_updated": "Usuario actualizado",
    
    // Otros elementos específicos
    "associated_payments": "Pagos Asociados",
    "associated_invoices": "Facturas Asociadas",
    "payment_mode": "Modo de Pago",
    "wire_transfer": "Transferencia Bancaria",
    "view": "Ver",
    "export": "Exportar",
    "delete": "Eliminar",
    "language": "Idioma"
};

// Exportar traducciones para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}
