import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker, { generateHtml } from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

const FIXED_DATE = new Date('2026-04-03T12:00:00Z');

describe('generateHtml', () => {
	it('contains correct HTML structure', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('<!DOCTYPE html>');
		expect(html).toContain('<html lang="zh-CN">');
		expect(html).toContain('<meta charset="UTF-8">');
		expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
		expect(html).toContain('<title>农历 Traditional Chinese Calendar</title>');
	});

	it('contains SEO meta tags', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('<meta name="description"');
		expect(html).toContain('<meta name="keywords"');
		expect(html).toContain('<meta property="og:title"');
		expect(html).toContain('<meta property="og:description"');
		expect(html).toContain('<meta property="og:type" content="website">');
		expect(html).toContain('<meta property="og:url" content="https://lunar.tie.pub">');
		expect(html).toContain('<meta name="twitter:card" content="summary">');
		expect(html).toContain('<link rel="canonical" href="https://lunar.tie.pub">');
	});

	it('contains structured data (JSON-LD)', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('<script type="application/ld+json">');
		expect(html).toContain('"@context": "https://schema.org"');
		expect(html).toContain('"@type": "WebPage"');
		expect(html).toContain('"datePublished": "2026-05-05T05:25:11.284Z"');
		expect(html).toContain('"dateModified": "2026-04-03"');
	});

	it('contains CSS styles', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('--color-bg:');
		expect(html).toContain('--color-accent:');
		expect(html).toContain('.container');
		expect(html).toContain('.stem-branch');
		expect(html).toContain('.zodiac-container');
		expect(html).toContain('.activities-list');
		expect(html).toContain('.yi-tag');
		expect(html).toContain('.ji-tag');
	});

	it('contains responsive media queries', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('@media (max-width: 500px)');
		expect(html).toContain('@media (max-width: 380px)');
	});

	it('contains dark mode support', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('@media (prefers-color-scheme: dark)');
	});

	it('contains reduced motion accessibility', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('@media (prefers-reduced-motion: reduce)');
	});

	it('renders dynamic content sections', () => {
		const html = generateHtml(FIXED_DATE);

		// Gregorian date
		expect(html).toContain('<div class="value">2026-04-03</div>');
		// Lunar date
		expect(html).toMatch(/<div class="value value-large">[^<]+<\/div>/);
		// Stems & branches - 3 rows
		expect(html).toContain('年 Year');
		expect(html).toContain('月 Month');
		expect(html).toContain('日 Day');
		// Each stem-branch value ends with 年/月/日
		expect(html).toMatch(/stem-branch-value">[^<]+年<\/span>/);
		expect(html).toMatch(/stem-branch-value">[^<]+月<\/span>/);
		expect(html).toMatch(/stem-branch-value">[^<]+日<\/span>/);
		// Zodiac
		expect(html).toContain('zodiac-cn');
		expect(html).toContain('zodiac-en');
		// Yi/Ji sections
		expect(html).toContain('yi-tag');
		expect(html).toContain('ji-tag');
	});

	it('render jieQi for fixed date', () => {
		const html = generateHtml(new Date('2026-05-05T12:00:00Z'));

		expect(html).toContain('今日：立夏');
		expect(html).toContain('下期：小满（2026-05-21 · 四月初五）');
	});

	it('contains midnight refresh script', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('scheduleMidnightRefresh');
		expect(html).toContain('location.reload()');
	});

	it('contains footer with current year', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('© 2026 Traditional Chinese Calendar');
	});

	it('contains footer links to GitHub and author', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('https://github.com/scopewu/lunar');
		expect(html).toContain('https://tie.pub');
		expect(html).toContain('GitHub');
		expect(html).toContain('吴文俊');
	});

	it('contains inlined favicon and apple-touch-icon', () => {
		const html = generateHtml(FIXED_DATE);

		expect(html).toContain('<link rel="icon"');
		expect(html).toContain('<link rel="apple-touch-icon"');
		expect(html).toContain('data:image/png;base64,');
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
});
