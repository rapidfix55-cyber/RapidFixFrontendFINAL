const WA_API = 'https://graph.facebook.com/v25.0';

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
	await waPost(waNumberId, accessToken, { to, type: 'text', text: { body } });
}

export async function waSendTemplate({ waNumberId, accessToken, to, templateName, variables, language = 'en' }: WaSendTemplateParams): Promise<void> {
	await waPost(waNumberId, accessToken, {
		to,
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
		to,
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
