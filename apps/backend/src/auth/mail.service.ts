import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  private buildPasswordResetHtml(resetLink: string): string {
    const href = escapeHtmlAttr(resetLink);
    const linkText = escapeHtml(resetLink);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <tr>
            <td bgcolor="#0f172a" style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#f8fafc;">AutoHub</p>
              <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;">Password reset</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 28px;">
              <h1 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#0f172a;line-height:1.3;">Reset your password</h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569;">
                We received a request to set a new password for your AutoHub account. Use the button below — the link is valid for <strong style="color:#334155;">one hour</strong>.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="border-radius:8px;background-color:#2563eb;">
                          <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Choose a new password</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#64748b;">
                If the button does not work, copy this link into your browser:
              </p>
              <p style="margin:0 0 24px;font-size:12px;line-height:1.5;word-break:break-all;color:#2563eb;">
                <a href="${href}" style="color:#2563eb;text-decoration:underline;">${linkText}</a>
              </p>
              <p style="margin:0;padding-top:20px;border-top:1px solid #e2e8f0;font-size:13px;line-height:1.6;color:#94a3b8;">
                If you did not request a password reset, you can safely ignore this email — your password will stay the same.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 28px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#cbd5e1;">© AutoHub</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private buildGoogleOnlyNoticeHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password reset</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <tr>
            <td bgcolor="#0f172a" style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#f8fafc;">AutoHub</p>
              <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;">Account notice</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 28px;">
              <h1 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#0f172a;line-height:1.3;">No password to reset</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#475569;">
                You asked to reset your AutoHub password, but this email is linked to an account that signs in with <strong style="color:#334155;">Google</strong>.
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
                There is no separate password to change. Please use <strong style="color:#334155;">Sign in with Google</strong> on the login page.
              </p>
              <p style="margin:0;padding-top:20px;border-top:1px solid #e2e8f0;font-size:13px;line-height:1.6;color:#94a3b8;">
                If you did not request this, you can ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 28px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#cbd5e1;">© AutoHub</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  /** Gmail app passwords are often copied with spaces; SMTP expects 16 chars without spaces. */
  private getSmtpAuth():
    | { user: string; pass: string }
    | undefined {
    const user = this.config.get<string>('SMTP_USER')?.trim();
    const pass = (this.config.get<string>('SMTP_PASS') ?? '').replace(
      /\s+/g,
      '',
    );
    if (!user || !pass) {
      return undefined;
    }
    return { user, pass };
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    const host = this.config.get<string>('SMTP_HOST');
    const from =
      this.config.get<string>('SMTP_FROM') ?? 'AutoHub <noreply@localhost>';

    if (!host) {
      this.logger.warn(
        `SMTP_HOST not set; password reset email not sent. Link for ${to}: ${resetLink}`,
      );
      return;
    }

    const port = Number(this.config.get<string>('SMTP_PORT') ?? '587');
    const secure = this.config.get<string>('SMTP_SECURE') === 'true';
    const auth = this.getSmtpAuth();

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth,
    });

    const text =
      'AutoHub — reset your password\n\n' +
      'We received a request to set a new password. Open the link below (valid for one hour):\n\n' +
      `${resetLink}\n\n` +
      'If you did not request this, you can ignore this email.';

    await transporter.sendMail({
      from,
      to,
      subject: 'Reset your AutoHub password',
      text,
      html: this.buildPasswordResetHtml(resetLink),
    });
  }

  /** Shown when the address belongs to a Google-only account (no local password). */
  async sendGoogleOnlyResetNotice(to: string): Promise<void> {
    const host = this.config.get<string>('SMTP_HOST');
    const from =
      this.config.get<string>('SMTP_FROM') ?? 'AutoHub <noreply@localhost>';

    if (!host) {
      this.logger.warn(
        `SMTP_HOST not set; Google-only notice email not sent for ${to}`,
      );
      return;
    }

    const port = Number(this.config.get<string>('SMTP_PORT') ?? '587');
    const secure = this.config.get<string>('SMTP_SECURE') === 'true';
    const auth = this.getSmtpAuth();

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth,
    });

    const text =
      'You requested a password reset for AutoHub, but this email is linked to an account that signs in with Google.\n\n' +
      'There is no separate password to reset. Please use “Sign in with Google” on the login page.\n\n' +
      'If you did not request this, you can ignore this email.';

    await transporter.sendMail({
      from,
      to,
      subject: 'AutoHub: password reset not available for this account',
      text,
      html: this.buildGoogleOnlyNoticeHtml(),
    });
  }
}
