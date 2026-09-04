import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { env, exports } from 'cloudflare:workers';
import { describe, it, expect, beforeAll } from 'vitest';
import worker, { generateHtml, todayInTimeZone } from '../src/index';

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

	describe('vertical reading mode', () => {
		it('renders the reading-mode toggle button', () => {
			expect(html).toContain('class="reading-toggle"');
			expect(html).toContain('aria-label="切换阅读方向 横排/竪排"');
		});

		it('includes the vertical writing-mode override', () => {
			expect(html).toContain('writing-mode: vertical-rl');
			expect(html).toContain('html.vertical');
		});

		it('persists the choice via localStorage', () => {
			expect(html).toContain("localStorage.setItem('reading-mode'");
			expect(html).toContain("localStorage.getItem('reading-mode')");
		});

		it('applies the saved direction before first paint', () => {
			// The no-FOUC script lives in <head>, before the <style> block.
			const headEnd = html.indexOf('</head>');
			const styleStart = html.indexOf('<style>');
			const noFlash = html.indexOf("classList.add('vertical')");
			expect(noFlash).toBeGreaterThan(-1);
			expect(noFlash).toBeLessThan(styleStart);
			expect(styleStart).toBeLessThan(headEnd);
		});

		it('defaults to horizontal (no vertical class in static HTML)', () => {
			expect(html).not.toContain('<html lang="zh-CN" class');
			expect(html).not.toContain('class="vertical"');
		});
	});

	it('contains footer with a copyright year', () => {
		// Year comes from the server clock, so assert the shape rather than a fixed year.
		expect(html).toMatch(/© \d{4} Traditional Chinese Calendar/);
	});

	it('contains footer links to GitHub and author', () => {
		expect(html).toContain('https://github.com/scopewu/lunar');
		expect(html).toContain('https://tie.pub');
		expect(html).toContain('GitHub');
		expect(html).toContain('吴文俊');
	});
});

describe('todayInTimeZone', () => {
	it('rolls to the next day in Asia/Shanghai before 08:00 UTC', () => {
		// 2026-08-24 20:30 UTC is already 04:30 on the 25th in UTC+8 Shanghai.
		expect(todayInTimeZone('Asia/Shanghai', new Date('2026-08-24T20:30:00Z')).toISOString()).toBe('2026-08-25T12:00:00.000Z');
	});

	it('stays on the same UTC day for timezones behind UTC', () => {
		// Same instant is 16:30 on 2026-08-24 in New York (EDT, UTC-4).
		expect(todayInTimeZone('America/New_York', new Date('2026-08-24T20:30:00Z')).toISOString()).toBe('2026-08-24T12:00:00.000Z');
	});

	it('rolls back across a year boundary', () => {
		// 2026-01-01 00:30 UTC is still the evening of 2025-12-31 in New York.
		expect(todayInTimeZone('America/New_York', new Date('2026-01-01T00:30:00Z')).toISOString()).toBe('2025-12-31T12:00:00.000Z');
	});

	it('falls back to Asia/Shanghai on an invalid timezone name', () => {
		const now = new Date('2026-08-24T20:30:00Z');
		expect(todayInTimeZone('Not/A_Zone', now).toISOString()).toBe(todayInTimeZone('Asia/Shanghai', now).toISOString());
	});
});

describe('Worker fetch handler', () => {
	it('returns HTML with correct headers (unit style)', async () => {
		const request = new IncomingRequest('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8');
		expect(response.headers.get('cache-control')).toContain('max-age=3600');
		const html = await response.text();
		expect(html).toContain('<!DOCTYPE html>');
		expect(html).toContain('农历');
	});

	it('returns HTML with correct content type (integration style)', async () => {
		const response = await exports.default.fetch('https://example.com');

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8');
		const html = await response.text();
		expect(html).toContain('<!DOCTYPE html>');
		expect(html).toContain('农历');
	});

	it('handles ?date= query parameter', async () => {
		const response = await exports.default.fetch('https://example.com?date=2025-02-12');

		expect(response.status).toBe(200);
		const html = await response.text();
		expect(html).toContain('2025-02-12');
	});

	it('defaults to Asia/Shanghai when cf.timezone is absent', async () => {
		const response = await exports.default.fetch('https://example.com');

		const html = await response.text();
		const expected = todayInTimeZone('Asia/Shanghai').toISOString().slice(0, 10);
		expect(html).toContain(`<div class="value">${expected}</div>`);
	});

	it('renders today in the visitor timezone from request.cf', async () => {
		// A real cf object carries many more fields; only timezone matters here.
		const cf = { timezone: 'America/New_York' } as IncomingRequestCfProperties;
		const request = new IncomingRequest('https://example.com', { cf });
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		const html = await response.text();
		const expected = todayInTimeZone('America/New_York').toISOString().slice(0, 10);
		expect(html).toContain(`<div class="value">${expected}</div>`);
	});
});

describe('static routes', () => {
	it('serves /robots.txt as plain text allowing all', async () => {
		const response = await exports.default.fetch('https://example.com/robots.txt');

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('text/plain;charset=UTF-8');
		expect(await response.text()).toBe('User-agent: *\nAllow: /\n');
	});

	it('serves /sitemap.xml as XML with the homepage entry', async () => {
		const response = await exports.default.fetch('https://example.com/sitemap.xml');

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('application/xml;charset=UTF-8');
		const body = await response.text();
		expect(body).toContain('<loc>https://example.com/</loc>');
		expect(body).toContain('<changefreq>daily</changefreq>');
	});

	it('serves /favicon.ico as a cacheable icon', async () => {
		const response = await exports.default.fetch('https://example.com/favicon.ico');

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('image/x-icon');
		expect(response.headers.get('cache-control')).toBe('public, max-age=86400');
		const body = await response.arrayBuffer();
		expect(body.byteLength).toBeGreaterThan(0);
	});
});

describe('error handling', () => {
	it('returns the styled 404 page for unknown paths', async () => {
		const response = await exports.default.fetch('https://example.com/no-such-page');

		expect(response.status).toBe(404);
		expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8');
		const html = await response.text();
		expect(html).toContain('<title>页面未找到 | Traditional Chinese Calendar</title>');
		expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
		expect(html).toContain('返回首页 · Back to Home');
	});

	it('returns 400 with an explicit error page on an invalid ?date=', async () => {
		for (const bad of ['not-a-date', '2025-13-45']) {
			const response = await exports.default.fetch(`https://example.com/?date=${bad}`);
			expect(response.status).toBe(400);
			const html = await response.text();
			expect(html).toContain('<title>日期无效 | Traditional Chinese Calendar</title>');
			expect(html).toContain('日期参数无效或超出支持范围');
		}
	});

	it('returns 400 for parseable dates unsupported by lunar-javascript', async () => {
		// 1582-10-05..14 is the Gregorian cutover gap: new Date() parses it,
		// but lunar-javascript throws 'wrong solar year 1582 month 10 day ...'.
		const response = await exports.default.fetch('https://example.com/?date=1582-10-10');
		expect(response.status).toBe(400);
		expect(await response.text()).toContain('400');
	});

	it('treats an empty ?date= as today', async () => {
		const response = await exports.default.fetch('https://example.com/?date=');

		expect(response.status).toBe(200);
		expect(await response.text()).toContain('<!DOCTYPE html>');
	});
});