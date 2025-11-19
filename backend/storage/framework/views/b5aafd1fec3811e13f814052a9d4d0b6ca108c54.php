<style>
  :root {
    --pad: 10px;
    --font-sans: "Helvetica Neue", Arial, Helvetica, "DejaVu Sans", sans-serif;
    --muted: #444;
  }
  
  @page {
    size: A4;
    margin: 10mm;
  }
  
  html, body {
    margin: 0;
    font-family: var(--font-sans);
    background: #fff;
  }
  
  .page {
    width: 210mm;
    padding: 12mm;
    box-sizing: border-box;
    font-size: 11px;
    color: #111;
  }
  
  .dd-hr {
    height: 2px;
    margin: 10px 0;
    background-image: radial-gradient(circle, rgba(0,0,0,0.35) 1px, transparent 1px);
    background-size: 6px 2px;
    background-repeat: repeat-x;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .biz {
    font-weight: 700;
    font-size: 20px;
  }
  
  .biz-sub {
    font-size: 10.5px;
    color: var(--muted);
    text-align: right;
    line-height: 1.3;
  }
  
  .body-row {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }
  
  .left, .right {
    width: 48%;
  }
  
  .inv-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  
  .meta, .cust {
    font-size: 10.5px;
    color: var(--muted);
    line-height: 1.4;
  }
  
  table.invoice-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10.5px;
    margin-top: 6px;
  }
  
  table.invoice-table thead th {
    text-align: left;
    padding: 6px;
    font-weight: 600;
    font-size: 10.5px;
  }
  
  table.invoice-table tbody td {
    padding: 6px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  
  table.invoice-table td.num {
    text-align: right;
    white-space: nowrap;
  }
  
  .product-col {
    word-break: break-word;
  }
  
  /* Order Summary Below Table */
  .order-summary-block {
    width: 100%;
    margin-top: 10px;
    text-align: right;
    font-size: 11px;
    line-height: 1.45;
  }
  
  .order-summary-block .line {
    padding: 3px 0;
  }
  
  .order-summary-block .grand {
    font-weight: 700;
    margin-top: 4px;
  }
  
  .payments {
    margin-top: 10px;
    font-size: 10.5px;
    color: var(--muted);
  }
  
  .footer {
    margin-top: 16px;
    text-align: center;
    font-size: 10px;
    color: var(--muted);
    line-height: 1.3;
  }
  
  .section-title {
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 4px;
  }
</style>
<?php /**PATH D:\Codexaa\Projects\1-ravi-patel\Photo-Studio-Management\backend\resources\views/pdfs/partials/styles.blade.php ENDPATH**/ ?>