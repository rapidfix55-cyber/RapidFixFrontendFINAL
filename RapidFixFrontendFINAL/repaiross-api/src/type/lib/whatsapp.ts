const WA_API = 'https://graph.facebook.com/v25.0';

// Meta expects the recipient as digits-only with country code and no '+'.
// Customers are stored inconsistently (+91…, spaces, or bare 10-digit), so
// every outbound message normalizes the recipient here.
export function normalizeTo(phone: string): string {
	const d = String(phone ?? '').replace(/\D/g, '');
	if (d.length === 10) return `91${d}`; // bare Indian mobile
	if (d.length === 11 && d.startsWith('0')) return `91${d.slice(1)}`; // 0XXXXXXXXXX
	if (d.length === 12 && d.startsWith('91')) return d; // already 91XXXXXXXXXX
	if (d.length === 13 && d.startsWith('091')) return d.slice(1); // 091XXXXXXXXXX
	return d; // fallback — assume already has a country code
}

interface WaSendTextParams {
	waNumberId: string;
	accessToken: string;
	to: string;
	body: string;
}

interface WaSendTemplateParams {
	waNumberId: string;
	accessToken: string;
	to: string;
	templateName: string;
	variables: string[];
	language?: string;
}

async function waPost(waNumberId: string, accessToken: string, payload: object): Promise<void> {
	const res = await fetch(`${WA_API}/${waNumberId}/messages`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ messaging_product: 'whatsapp', ...payload }),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(`WhatsApp send failed: ${JSON.stringify(err)}`);
	}
}

export async function waSendText({ waNumberId, accessToken, to, body }: WaSendTextParams): Promise<void> {
	await waPost(waNumberId, accessToken, { to: normalizeTo(to), type: 'text', text: { body } });
}

export async function waSendTemplate({ waNumberId, accessToken, to, templateName, variables, language = 'en' }: WaSendTemplateParams): Promise<void> {
	await waPost(waNumberId, accessToken, {
		to: normalizeTo(to),
		type: 'template',
		template: {
			name: templateName,
			language: { code: language },
			components: [
				{
					type: 'body',
					parameters: variables.map((v) => ({ type: 'text', text: v })),
				},
			],
		},
	});
}

interface WaSendOtpParams {
	waNumberId: string;
	accessToken: string;
	to: string;
	templateName: string;
	code: string;
	language?: string;
}

// Authentication-category templates require the code in BOTH the body
// and the button component (Meta-mandated payload shape).
export async function waSendOtp({ waNumberId, accessToken, to, templateName, code, language = 'en_US' }: WaSendOtpParams): Promise<void> {
	await waPost(waNumberId, accessToken, {
		to: normalizeTo(to),
		type: 'template',
		template: {
			name: templateName,
			language: { code: language },
			components: [
				{
					type: 'body',
					parameters: [{ type: 'text', text: code }],
				},
				{
					type: 'button',
					sub_type: 'url',
					index: '0',
					parameters: [{ type: 'text', text: code }],
				},
			],
		},
	});
}
