<?php

namespace App\Services;

use App\Mail\GenericEmail;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    /**
     * Send email immediately and log the result.
     *
     * @param string $to
     * @param string $type
     * @param array $data
     * @param int|null $relatedId
     * @param string|null $relatedType
     * @param array $attachments
     * @param string|null $bodyOverride
     * @return bool
     */
    public function sendEmailImmediately($to, $type, $data = [], $relatedId = null, $relatedType = null, $attachments = [], $bodyOverride = null)
    {
        try {
            $emailSettings = $this->getEmailSettings();
            $this->configureMailSettings($emailSettings);

            $subject = $this->getSubject($type, $data);
            $body = $bodyOverride ?? $this->renderTemplate($type, $data);

            $fromEmail = $emailSettings['from_address'] ?? config('mail.from.address');
            $fromName = $emailSettings['from_name'] ?? config('mail.from.name');

            $mailable = new GenericEmail($subject, $body, $fromEmail, $fromName, $attachments);

            Mail::to($to)->send($mailable);

            $this->logEmail($to, $fromEmail, $type, $subject, $body, 'success', 'Email sent successfully', $relatedId, $relatedType);

            return true;
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            
            $this->logEmail(
                $to,
                $emailSettings['from_address'] ?? config('mail.from.address'),
                $type,
                $this->getSubject($type, $data),
                $bodyOverride ?? $this->renderTemplate($type, $data),
                'failed',
                $e->getMessage(),
                $relatedId,
                $relatedType
            );

            return false;
        }
    }

    /**
     * Get email settings from database.
     *
     * @return array
     */
    public function getEmailSettings()
    {
        return Setting::getAsArray('email');
    }

    /**
     * Configure mail settings dynamically.
     *
     * @param array $emailSettings
     * @return void
     */
    public function configureMailSettings($emailSettings)
    {
        if (isset($emailSettings['mailer'])) {
            config(['mail.default' => $emailSettings['mailer']]);
        }

        if (isset($emailSettings['host'])) {
            config(['mail.mailers.smtp.host' => $emailSettings['host']]);
        }

        if (isset($emailSettings['port'])) {
            config(['mail.mailers.smtp.port' => $emailSettings['port']]);
        }

        if (isset($emailSettings['username'])) {
            config(['mail.mailers.smtp.username' => $emailSettings['username']]);
        }

        if (isset($emailSettings['password'])) {
            config(['mail.mailers.smtp.password' => $emailSettings['password']]);
        }

        if (isset($emailSettings['encryption'])) {
            config(['mail.mailers.smtp.encryption' => $emailSettings['encryption']]);
        }

        if (isset($emailSettings['from_address'])) {
            config(['mail.from.address' => $emailSettings['from_address']]);
        }

        if (isset($emailSettings['from_name'])) {
            config(['mail.from.name' => $emailSettings['from_name']]);
        }
    }

    /**
     * Log email attempt.
     *
     * @param string $toEmail
     * @param string $fromEmail
     * @param string $type
     * @param string $subject
     * @param string $body
     * @param string $sendStatus
     * @param string $responseMessage
     * @param int|null $relatedId
     * @param string|null $relatedType
     * @return void
     */
    public function logEmail($toEmail, $fromEmail, $type, $subject, $body, $sendStatus, $responseMessage, $relatedId = null, $relatedType = null)
    {
        DB::table('emails')->insert([
            'to_email' => $toEmail,
            'from_email' => $fromEmail,
            'type' => $type,
            'subject' => $subject,
            'body' => $body,
            'send_status' => $sendStatus,
            'response_message' => $responseMessage,
            'related_id' => $relatedId,
            'related_type' => $relatedType,
            'sent_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Render email template.
     *
     * @param string $type
     * @param array $data
     * @return string
     */
    public function renderTemplate($type, $data = [])
    {
        try {
            $view = "emails.{$type}";
            if (view()->exists($view)) {
                return view($view, $data)->render();
            }
        } catch (\Exception $e) {
            Log::warning("Email template {$type} not found, using fallback");
        }

        // Fallback template
        return view('emails.generic', array_merge($data, ['type' => $type]))->render();
    }

    /**
     * Get email subject based on type.
     *
     * @param string $type
     * @param array $data
     * @return string
     */
    public function getSubject($type, $data = [])
    {
        $subjects = [
            'password_reset' => 'Password Reset Request',
            'welcome' => 'Welcome to ' . config('app.name'),
            'notification' => 'Notification from ' . config('app.name'),
        ];

        return $subjects[$type] ?? 'Email from ' . config('app.name');
    }
}

