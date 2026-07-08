import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "admin@whitneybateson.com";
export const FROM_EMAIL = process.env.FROM_EMAIL ?? "notifications@whitneybateson.com";
