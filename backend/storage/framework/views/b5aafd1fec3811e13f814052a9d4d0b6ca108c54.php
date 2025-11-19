<style>
    @page {
        margin: 32px 28px;
    }

    * {
        box-sizing: border-box;
    }

    body {
        font-family: 'DejaVu Sans', sans-serif;
        font-size: 11px;
        color: #111;
        line-height: 1.5;
        background: #fff;
    }

    .invoice-body {
        margin: 0;
        padding: 0;
    }

    .muted {
        color: #666;
        font-size: 10px;
    }

    .invoice-masthead {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding-bottom: 14px;
        margin-bottom: 20px;
        border-bottom: 1px solid #111;
    }

    .masthead-title {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 0.12em;
        margin: 0;
    }

    .masthead-right p {
        margin: 2px 0;
        text-align: right;
    }

    .invoice-info-row {
        display: flex;
        gap: 18px;
        margin-bottom: 20px;
    }

    .info-block {
        flex: 1;
        border: 1px solid #d5d5d5;
        padding: 10px 12px;
        min-height: 110px;
        background: #fff;
    }

    .info-label {
        font-size: 10px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        margin: 0 0 6px;
    }

    .info-line {
        margin: 2px 0;
    }

    .section-title {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 11px;
        margin-bottom: 8px;
    }

    .line-section {
        margin-bottom: 18px;
    }

    .products-grid {
        display: flex;
        gap: 16px;
    }

    .products-table {
        flex: 3;
    }

    .line-items {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
    }

    .line-items th,
    .line-items td {
        border: 1px solid #bcbcbc;
        padding: 6px;
    }

    .line-items th {
        font-weight: 600;
        font-size: 10px;
        background: #f6f6f6;
        text-transform: uppercase;
    }

    .line-items tbody tr:nth-child(even) td {
        background: #fafafa;
    }

    .order-summary {
        flex: 1;
        min-width: 220px;
    }

    .order-summary table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
    }

    .order-summary td {
        border: 1px solid #d5d5d5;
        padding: 7px;
    }

    .text-right {
        text-align: right;
    }

    .text-center {
        text-align: center;
    }

    .text-success {
        color: #0b6623;
        font-weight: 600;
    }

    .text-danger {
        color: #a60000;
        font-weight: 600;
    }

    .summary-grid {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 18px;
    }

    .summary-grid > div {
        flex: 1;
        min-width: 220px;
    }

    .summary-table {
        width: 100%;
        border-collapse: collapse;
    }

    .summary-table td {
        border: 1px solid #d5d5d5;
        padding: 8px;
    }

    .payment-lines {
        border: 1px solid #d5d5d5;
        padding: 10px 12px;
    }

    .payment-line {
        padding: 4px 0;
        font-size: 11px;
        border-bottom: 1px solid #e5e5e5;
    }

    .payment-line:last-child {
        border-bottom: none;
    }

    .pdf-footer {
        margin-top: 28px;
        padding-top: 12px;
        border-top: 1px solid #bbb;
        text-align: center;
        font-size: 10px;
        color: #555;
    }
</style>
<style>
    @page {
        margin: 32px 28px;
    }

    * {
        box-sizing: border-box;
    }

    body {
        font-family: 'DejaVu Sans', sans-serif;
        font-size: 11px;
        color: #111;
        line-height: 1.5;
        background: #fff;
    }

    .muted {
        color: #666;
        font-size: 10px;
    }

    .invoice-body {
        margin: 0;
        padding: 0;
    }

    .invoice-header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding-bottom: 16px;
        margin-bottom: 18px;
        border-bottom: 1px solid #111;
    }

    .invoice-type {
        font-size: 15px;
        letter-spacing: 0.25em;
        margin: 0 0 8px;
    }

    .invoice-brand h1 {
        margin: 0 0 6px;
        font-size: 22px;
    }

    .invoice-brand p {
        margin: 2px 0;
    }

    .invoice-meta table {
        border-collapse: collapse;
        font-size: 11px;
    }

    .invoice-meta td:first-child {
        font-weight: 600;
        padding-right: 12px;
        white-space: nowrap;
    }

    .invoice-meta td {
        padding: 3px 0;
    }

    .party-section {
        display: flex;
        gap: 12px;
        margin-bottom: 18px;
    }

    .party-card {
        flex: 1;
        border: 1px solid #dcdcdc;
        padding: 10px;
        background: #fff;
        min-height: 110px;
    }

    .party-label {
        font-size: 10px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-bottom: 6px;
        color: #444;
    }

    .party-name {
        font-size: 13px;
        font-weight: bold;
        margin: 0 0 4px;
    }

    .section-title {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 11px;
        margin-bottom: 6px;
    }

    .line-section {
        margin-bottom: 18px;
    }

    .line-items {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
    }

    .line-items th,
    .line-items td {
        border: 1px solid #bcbcbc;
        padding: 6px;
    }

    .line-items th {
        font-weight: 600;
        font-size: 10px;
        text-transform: uppercase;
        background: #f5f5f5;
    }

    .line-items tbody tr:nth-child(even) td {
        background: #fafafa;
    }

    .line-meta {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        margin-top: 6px;
    }

    .summary-grid {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 18px;
    }

    .summary-grid > div {
        flex: 1;
        min-width: 220px;
    }

    .summary-table {
        width: 100%;
        border-collapse: collapse;
    }

    .summary-table td {
        border: 1px solid #d5d5d5;
        padding: 8px;
    }

    .summary-table.compact td {
        font-size: 11px;
    }

    .text-right {
        text-align: right;
    }

    .text-center {
        text-align: center;
    }

    .text-success {
        color: #0b6623;
        font-weight: 600;
    }

    .text-danger {
        color: #a60000;
        font-weight: 600;
    }

    .pdf-footer {
        margin-top: 30px;
        padding-top: 12px;
        border-top: 1px solid #bbb;
        text-align: center;
        font-size: 10px;
        color: #555;
    }
</style>

<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/partials/styles.blade.php ENDPATH**/ ?>