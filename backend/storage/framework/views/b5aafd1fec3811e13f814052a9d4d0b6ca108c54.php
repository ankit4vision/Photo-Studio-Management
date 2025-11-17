<style>
    @page {
        margin: 32px 28px;
    }

    * {
        box-sizing: border-box;
    }

    body {
        font-family: 'DejaVu Sans', sans-serif;
        font-size: 12px;
        color: #0f172a;
        line-height: 1.6;
        background: #fcfcfd;
    }

    .pdf-header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding: 16px 0 20px;
        margin-bottom: 28px;
        border-bottom: 2px solid #eceff5;
    }

    .pdf-intro {
        flex: 1;
    }

    .document-title {
        font-size: 18px;
        letter-spacing: 0.18em;
        color: #0f172a;
        margin: 0 0 12px;
        text-transform: uppercase;
    }

    .business-card {
        background: #fff;
        border: 1px solid #e4e7ec;
        border-radius: 10px;
        padding: 14px;
        box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05);
    }

    .business-card h1 {
        margin: 0 0 6px;
        font-size: 20px;
        color: #111c3d;
    }

    .business-card p {
        margin: 2px 0;
        font-size: 11px;
        color: #526074;
    }

    .meta-card {
        min-width: 220px;
        background: #f8f9ff;
        border: 1px solid #dfe4ff;
        border-radius: 10px;
        padding: 14px 18px;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
    }

    .meta-card table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
    }

    .meta-card td {
        padding: 4px 0;
    }

    .meta-card td:first-child {
        font-weight: 600;
        color: #5c647a;
        padding-right: 12px;
        white-space: nowrap;
    }

    .pdf-section {
        margin-bottom: 24px;
    }

    .section-title {
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #475569;
        margin-bottom: 10px;
    }

    .section-heading {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
    }

    .section-subtitle {
        font-size: 11px;
        color: #94a3b8;
    }

    .info-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
    }

    .info-table th {
        width: 34%;
        padding: 10px 14px;
        background: #f4f6fb;
        text-align: left;
        font-size: 10px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #475569;
        border-bottom: 1px solid #e2e8f0;
    }

    .info-table td {
        padding: 10px 14px;
        border-bottom: 1px solid #e2e8f0;
        color: #0f172a;
    }

    .info-table tr:last-child th,
    .info-table tr:last-child td {
        border-bottom: none;
    }

    .summary-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .summary-card {
        flex: 1;
        min-width: 140px;
        background: #fff;
        border: 1px solid #e5eaf5;
        border-radius: 12px;
        padding: 12px 14px;
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
    }

    .summary-card span {
        display: block;
    }

    .summary-label {
        text-transform: uppercase;
        font-size: 10px;
        letter-spacing: 0.1em;
        color: #94a3b8;
        margin-bottom: 6px;
    }

    .summary-value {
        font-size: 20px;
        font-weight: 700;
        color: #111c3d;
        margin-bottom: 4px;
    }

    .summary-foot {
        font-size: 10px;
        color: #a0aec0;
    }

    .filter-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .filter-tag {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        border: 1px dashed #cbd5f5;
        border-radius: 999px;
        padding: 4px 10px;
        color: #475569;
    }

    .section-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 12px;
        page-break-inside: avoid;
    }

    .stats-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        page-break-inside: avoid;
    }

    .stats-row .stat-card {
        flex: 1 1 calc(25% - 10px);
        min-width: 120px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 10px;
        text-align: center;
        page-break-inside: avoid;
    }

    .stats-row .stat-card small {
        display: block;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #94a3b8;
        margin-bottom: 4px;
    }

    .stats-row .stat-card strong {
        font-size: 16px;
        color: #111827;
    }

    .grid-2 {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }

    .grid-2 .grid-item {
        flex: 1;
        min-width: 220px;
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 6px;
    }

    .data-table th {
        background: #ede9fe;
        color: #4c1d95;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 11px;
        padding: 8px 10px;
        border: 1px solid #e2e8f0;
    }

    .data-table td {
        border: 1px solid #e2e8f0;
        padding: 8px 10px;
        font-size: 11px;
    }

    .data-table tr:nth-child(even) td {
        background: #f8fafc;
    }

    .text-right {
        text-align: right;
    }

    .text-center {
        text-align: center;
    }

    .badge {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .badge-success {
        background: #dcfce7;
        color: #15803d;
    }

    .badge-warning {
        background: #fef3c7;
        color: #b45309;
    }

    .badge-danger {
        background: #fee2e2;
        color: #b91c1c;
    }

    .badge-info {
        background: #e0f2fe;
        color: #0369a1;
    }

    .summary-table {
        width: 320px;
        margin-left: auto;
    }

    .summary-table td {
        border: 1px solid #e2e8f0;
        padding: 8px 12px;
        font-size: 11px;
    }

    .summary-table tr:last-child td {
        background: #4c1d95;
        color: #f8fafc;
        font-weight: 600;
        font-size: 13px;
    }

    .pdf-footer {
        margin-top: 36px;
        padding-top: 12px;
        border-top: 1px solid #e2e8f0;
        text-align: center;
        font-size: 10px;
        color: #94a3b8;
    }
</style>

<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/partials/styles.blade.php ENDPATH**/ ?>