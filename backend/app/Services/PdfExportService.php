<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class PdfExportService
{
    /**
     * Generate PDF and return download response.
     *
     * @param string $view
     * @param array $data
     * @param string $filename
     * @return Response
     */
    public function export($view, $data = [], $filename = 'document.pdf')
    {
        $pdf = Pdf::loadView($view, $data);
        return $pdf->download($filename);
    }

    /**
     * Generate PDF and return stream response.
     *
     * @param string $view
     * @param array $data
     * @param string $filename
     * @return Response
     */
    public function stream($view, $data = [], $filename = 'document.pdf')
    {
        $pdf = Pdf::loadView($view, $data);
        return $pdf->stream($filename);
    }

    /**
     * Generate PDF and return raw binary data.
     *
     * @param string $view
     * @param array $data
     * @return string
     */
    public function raw($view, $data = [])
    {
        $pdf = Pdf::loadView($view, $data);
        return $pdf->output();
    }
}

