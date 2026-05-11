import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';
import worker, { generateHtml } from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

const FIXED_DATE = new Date('2026-04-03T12:00:00Z');

describe('generateHtml', () => {
	let html: string;

	beforeAll(() => {
		html = generateHtml(FIXED_DATE);
	});

	it('contains correct HTML structure', () => {
		expect(html).toContain('<!DOCTYPE html>');
		expect(html).toContain('<html lang="zh-CN">');
		expect(html).toContain('<meta charset="UTF-8">');
		expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
		expect(html).toContain('<title>农历 Traditional Chinese Calendar</title>');
	});

	describe('SEO meta tags', () => {
		it('contains basic meta tags', () => {
			expect(html).toContain('<meta name="description"');
			expect(html).toContain('<meta name="keywords"');
		});

		it('contains Open Graph meta tags', () => {
			expect(html).toContain('<meta property="og:title"');
			expect(html).toContain('<meta property="og:description"');
			expect(html).toContain('<meta property="og:type" content="website">');
			expect(html).toContain('<meta property="og:url" content="https://lunar.tie.pub">');
		});

		it('contains Twitter and canonical meta tags', () => {
			expect(html).toContain('<meta name="twitter:card" content="summary">');
			expect(html).toContain('<link rel="canonical" href="https://lunar.tie.pub">');
		});
	});

	it('contains structured data (JSON-LD)', () => {
		expect(html).toContain('<script type="application/ld+json">');
		expect(html).toContain('"@context": "https://schema.org"');
		expect(html).toContain('"@type": "WebPage"');
		expect(html).toMatch(/"datePublished": "\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z"/);
		expect(html).toContain('"dateModified": "2026-04-03"');
	});

	describe('CSS styles', () => {
		it('contains CSS variables', () => {
			expect(html).toContain('--color-bg:');
			expect(html).toContain('--color-accent:');
		});

		it('contains component CSS classes', () => {
			expect(html).toContain('.container');
			expect(html).toContain('.stem-branch');
			expect(html).toContain('.zodiac-container');
			expect(html).toContain('.activities-list');
			expect(html).toContain('.yi-tag');
			expect(html).toContain('.ji-tag');
		});
	});

	it('contains responsive media queries', () => {
		expect(html).toContain('@media (max-width: 500px)');
		expect(html).toContain('@media (max-width: 380px)');
	});

	it('contains dark mode support', () => {
		expect(html).toContain('@media (prefers-color-scheme: dark)');
	});

	it('contains reduced motion accessibility', () => {
		expect(html).toContain('@media (prefers-reduced-motion: reduce)');
	});

	describe('renders dynamic content sections', () => {
		it('renders Gregorian and lunar dates', () => {
			expect(html).toContain('<div class="value">2026-04-03</div>');
			expect(html).toMatch(/<div class="value value-large">[^<]+<\/div>/);
		});

		it('renders stems and branches', () => {
			expect(html).toContain('年 Year');
			expect(html).toContain('月 Month');
			expect(html).toContain('日 Day');
			expect(html).toMatch(/stem-branch-value">[^<]+年<\/span>/);
			expect(html).toMatch(/stem-branch-value">[^<]+月<\/span>/);
			expect(html).toMatch(/stem-branch-value">[^<]+日<\/span>/);
		});

		it('renders zodiac', () => {
			expect(html).toContain('zodiac-cn');
			expect(html).toContain('zodiac-en');
		});

		it('renders yi and ji activities', () => {
			expect(html).toContain('yi-tag');
			expect(html).toContain('ji-tag');
		});
	});

	it('render jieQi for fixed date', () => {
		const html = generateHtml(new Date('2026-05-05T12:00:00Z'));

		expect(html).toContain('今日：立夏');
		expect(html).toContain('下期：小满（2026-05-21 · 四月初五）');
	});

	it('contains midnight refresh script', () => {
		expect(html).toContain('scheduleMidnightRefresh');
		expect(html).toContain('location.reload()');
	});

	it('contains footer with current year', () => {
		expect(html).toContain('© 2026 Traditional Chinese Calendar');
	});

	it('contains footer links to GitHub and author', () => {
		expect(html).toContain('https://github.com/scopewu/lunar');
		expect(html).toContain('https://tie.pub');
		expect(html).toContain('GitHub');
		expect(html).toContain('吴文俊');
	});
});

describe('generateHtml without argument', () => {
	it('uses current date when no argument provided', () => {
		const html = generateHtml();
		const today = new Date().toISOString().split('T')[0];
		expect(html).toContain(today);
	});
});

describe('Worker fetch handler', () => {
	it('returns HTML with correct content type (unit style)', async () => {
		const request = new IncomingRequest('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8');
		const html = await response.text();
		expect(html).toContain('<!DOCTYPE html>');
		expect(html).toContain('农历');
	});

	it('returns HTML with correct content type (integration style)', async () => {
		const response = await SELF.fetch('https://example.com');

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8');
		const html = await response.text();
		expect(html).toContain('<!DOCTYPE html>');
		expect(html).toContain('农历');
	});

	it('handles ?date= query parameter', async () => {
		const response = await SELF.fetch('https://example.com?date=2025-02-12');

		expect(response.status).toBe(200);
		const html = await response.text();
		expect(html).toContain('2025-02-12');
	});
});