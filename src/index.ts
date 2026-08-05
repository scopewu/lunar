import { Solar } from 'lunar-javascript';
import { FAVICON_ICO_BASE64 } from './favicon';

const FAVICON_ICO = Uint8Array.from(atob(FAVICON_ICO_BASE64), (c) => c.charCodeAt(0));

export function generateHtml(date?: Date): string {
	const solar = Solar.fromDate(date ?? new Date());
	const lunar = solar.getLunar();

	const gregorianDate = solar.toString();
	// const lunarDate = lunar.toString();
	const lunarDate = `${lunar.getYearInGanZhi()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
	const yearGanZhi = lunar.getYearInGanZhi();
	const monthGanZhi = lunar.getMonthInGanZhi();
	const dayGanZhi = lunar.getDayInGanZhi();
	const zodiac = lunar.getYearShengXiao();
	const yi = lunar.getDayYi();
	const ji = lunar.getDayJi();
	const jieQi = lunar.getJieQi();
	const nextJieQi = lunar.getNextJieQi(true);
	const nextJieQiName = nextJieQi?.getName() ?? '';
	const nextJieQiSolar = nextJieQi?.getSolar() ?? null;
	const nextJieQiDate = nextJieQiSolar?.toString() ?? '';
	const nextJieQiLunar = nextJieQiSolar?.getLunar() ?? null;
	const nextJieQiLunarDate = nextJieQiLunar ? `${nextJieQiLunar.getMonthInChinese()}月${nextJieQiLunar.getDayInChinese()}` : '';

	const year = new Date().getFullYear();

	const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>农历 Traditional Chinese Calendar</title>
	<meta name="description" content="查看今日农历信息 - ${lunarDate}。包括天干地支、生肖、宜忌等传统文化内容。Check today's traditional chinese calendar information including stems & branches, zodiac, and daily activities.">
	<meta name="keywords" content="农历, 黄历, 天干地支, 生肖, the traditional chinese calendar, Chinese Calendar, 宜忌, 日期">
	<meta name="author" content="吴文俊（Wú Wénjùn）">
	<link rel="author" href="https://tie.pub/me/">
	<meta name="robots" content="index, follow">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;500&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">
	<meta property="og:title" content="农历 ${lunarDate} | Traditional Chinese Calendar">
	<meta property="og:description" content="查看今日农历、天干地支、生肖及宜忌信息">
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://lunar.tie.pub">
	<meta property="og:locale" content="zh_CN">
	<meta property="og:locale:alternate" content="en_US">
	<meta property="og:site_name" content="农历">
	<meta property="og:image" content="https://s.tie.pub/lunar-icons/android-chrome-512x512.png" />
	<meta property="og:image:alt" content="农历, traditional chinese calendar" />
	<meta name="twitter:card" content="summary">
	<link rel="canonical" href="https://lunar.tie.pub">
	<link rel="sitemap" type="application/xml" href="https://lunar.tie.pub/sitemap.xml">
	<link rel="apple-touch-icon" sizes="180x180" href="https://s.tie.pub/lunar-icons/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="https://s.tie.pub/lunar-icons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="https://s.tie.pub/lunar-icons/favicon-16x16.png">
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebPage",
		"name": "农历 ${lunarDate} - Traditional Chinese Calendar",
		"description": "查看今日农历、天干地支、生肖及宜忌等传统文化信息",
		"url": "https://lunar.tie.pub",
		"datePublished": "2026-05-05T05:25:11.284Z",
		"dateModified": "${gregorianDate}",
		"inLanguage": "zh-CN",
		"author": {
			"@type": "Person",
			"name": "吴文俊",
			"alternateName": "Wú Wénjùn",
			"url": "https://tie.pub/me/"
		}
	}
	</script>

	<style>
		/* ========== CSS Variables ========== */
		:root {
			/* Colors - Fresh & Clean Palette */
			--color-bg: #FAFAF7;
			--color-card: #FFFFFF;
			--color-text-primary: #1A1A1A;
			--color-text-secondary: #6B7280;
			--color-accent: #5B8C85;
			--color-accent-light: #E8F0EE;
			--color-gold: #C4956A;
			--color-border: #E5E5E0;

			/* Typography */
			--font-display: 'Ma Shan Zheng', cursive;
			--font-heading: 'ZCOOL XiaoWei', serif;
			--font-body: 'Noto Serif SC', 'STSong', 'SimSun', serif;

			/* Spacing */
			--space-xs: 4px;
			--space-sm: 8px;
			--space-md: 16px;
			--space-lg: 24px;
			--space-xl: 32px;

			/* Effects */
			--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04),
							 0 8px 24px rgba(0, 0, 0, 0.04);
		}

		/* ========== Reset & Base ========== */
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: var(--font-body);
			min-height: 100vh;
			min-height: 100dvh;
			background-color: var(--color-bg);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20px;
			color: var(--color-text-primary);
			line-height: 1.6;
		}

		/* ========== Container ========== */
		.container {
			position: relative;
			max-width: 520px;
			width: 100%;
			background: var(--color-card);
			border-radius: 16px;
			box-shadow: var(--shadow-card);
			border: 1px solid var(--color-border);
			padding: 48px 40px 40px;
			animation: fadeIn 0.6s ease-out;
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
				transform: translateY(20px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}

		/* ========== Header ========== */
		.header {
			text-align: center;
			margin-bottom: 40px;
			padding-bottom: 28px;
			border-bottom: 1px solid var(--color-border);
		}

		.title {
			font-family: var(--font-display);
			font-size: 2.75rem;
			color: var(--color-accent);
			margin-bottom: 8px;
			letter-spacing: 6px;
			line-height: 1.2;
		}

		.subtitle {
			font-family: var(--font-heading);
			font-size: 0.95rem;
			color: var(--color-text-secondary);
			letter-spacing: 2px;
			font-weight: 400;
		}

		/* ========== Sections ========== */
		.section {
			margin-bottom: 36px;
		}

		/* ========== Labels ========== */
		.label {
			font-size: 0.75rem;
			color: var(--color-text-secondary);
			margin-bottom: 12px;
			text-transform: uppercase;
			letter-spacing: 2px;
			font-weight: 500;
			display: flex;
			align-items: center;
			gap: 6px;
		}

		.label-en {
			font-size: 0.7rem;
			color: var(--color-text-secondary);
			margin-left: 2px;
			text-transform: none;
			letter-spacing: 1px;
			font-weight: 400;
			opacity: 0.75;
		}

		.label::before {
			content: '—';
			color: var(--color-text-secondary);
			font-size: 0.9rem;
		}

		/* ========== Values ========== */
		.value {
			font-size: 1.15rem;
			color: var(--color-text-primary);
			line-height: 1.7;
		}

		.value-large {
			font-family: var(--font-heading);
			font-size: 1.75rem;
			color: var(--color-text-primary);
			font-weight: 500;
			letter-spacing: 2px;
		}

		/* ========== Stems & Branches ========== */
		.stems-branches {
			display: flex;
			flex-direction: column;
			gap: 12px;
		}

		.stem-branch {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12px 16px;
			background: var(--color-accent-light);
			border-radius: 8px;
			border-left: 2px solid var(--color-accent);
			transition: background-color 0.2s ease;
		}

		.stem-branch:hover {
			background: #D8E6E2;
		}

		.stem-branch-label {
			font-size: 0.85rem;
			color: var(--color-text-secondary);
			font-weight: 500;
		}

		.stem-branch-value {
			font-size: 1rem;
			color: var(--color-text-primary);
			font-weight: 500;
			font-family: var(--font-heading);
		}

		/* ========== Zodiac ========== */
		.zodiac-container {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 20px;
			padding: 24px;
			background: var(--color-accent-light);
			border-radius: 12px;
		}

		.zodiac-cn {
			font-family: var(--font-display);
			font-size: 2.25rem;
			color: var(--color-accent);
			line-height: 1;
		}

		.zodiac-en {
			font-family: var(--font-heading);
			font-size: 1.15rem;
			color: var(--color-text-primary);
			font-weight: 500;
			letter-spacing: 1.5px;
			text-transform: capitalize;
		}

		/* ========== Activities (Yi/Ji) ========== */
		.activities-list {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
		}

		.activity-tag {
			padding: 6px 14px;
			border-radius: 20px;
			font-size: 0.9rem;
			transition: background-color 0.2s ease;
			cursor: default;
		}

		.yi-tag {
			background: var(--color-accent-light);
			color: var(--color-text-primary);
			border: 1px solid var(--color-accent);
		}

		.yi-tag:hover {
			background: #D8E6E2;
		}

		.ji-tag {
			background: #F5F5F4;
			color: var(--color-text-primary);
			border: 1px solid var(--color-border);
		}

		.ji-tag:hover {
			background: #EBEBE9;
		}

		/* ========== Footer ========== */
		.footer {
			text-align: center;
			margin-top: 40px;
			padding-top: 24px;
			border-top: 1px solid var(--color-border);
			font-size: 0.75rem;
			color: var(--color-text-secondary);
			font-family: var(--font-heading);
			letter-spacing: 0.5px;
		}

		.footer-links {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 16px;
			margin-top: 10px;
		}

		.footer-link {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			color: var(--color-text-secondary);
			text-decoration: none;
			transition: color 0.2s ease;
			cursor: pointer;
		}

		.footer-link:hover {
			color: var(--color-accent);
		}

		.footer-link svg {
			width: 14px;
			height: 14px;
			fill: currentColor;
		}

		.footer-link svg[data-stroke] {
			fill: none;
			stroke: currentColor;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
		}

		.footer-divider {
			color: var(--color-border);
		}

		/* ========== Responsive Design ========== */
		@media (max-width: 500px) {
			body {
				padding: 16px;
			}

			.container {
				padding: 36px 28px 36px;
				border-radius: 14px;
			}

			.title {
				font-size: 2.25rem;
				letter-spacing: 4px;
			}

			.subtitle {
				font-size: 0.85rem;
				letter-spacing: 1.5px;
			}

			.value-large {
				font-size: 1.5rem;
			}

			.zodiac-cn {
				font-size: 2.75rem;
			}

			.zodiac-en {
				font-size: 1rem;
			}
		}

		@media (max-width: 380px) {
			.container {
				padding: 32px 20px 32px;
			}

			.title {
				font-size: 2rem;
				letter-spacing: 3px;
			}

			.value {
				font-size: 1.05rem;
			}

			.value-large {
				font-size: 1.35rem;
			}

			.label {
				font-size: 0.7rem;
				letter-spacing: 1.5px;
			}

			.activity-tag {
				padding: 5px 12px;
				font-size: 0.85rem;
			}

			.stem-branch {
				flex-direction: column;
				gap: 6px;
				text-align: center;
				padding: 12px 10px;
			}

			.stem-branch-value {
				font-size: 0.95rem;
			}

			.footer-links {
				gap: 12px;
				flex-wrap: wrap;
			}
		}

		/* ========== Dark Mode ========== */
		@media (prefers-color-scheme: dark) {
			:root {
				--color-bg: #111110;
				--color-card: #1C1C1A;
				--color-text-primary: #EAEAE6;
				--color-text-secondary: #9CA3AF;
				--color-accent: #7FADA6;
				--color-accent-light: #232D2B;
				--color-gold: #D4A878;
				--color-border: #2E2E2A;
				--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.2),
								 0 8px 24px rgba(0, 0, 0, 0.25);
			}

			.stem-branch:hover {
				background: #2B3A36;
			}

			.yi-tag:hover {
				background: #2B3A36;
			}

			.ji-tag {
				background: #242422;
				border-color: var(--color-border);
			}

			.ji-tag:hover {
				background: #2E2E2A;
			}
		}

		/* ========== Accessibility: Reduced Motion ========== */
		@media (prefers-reduced-motion: reduce) {
			*,
			*::before,
			*::after {
				animation-duration: 0.01ms !important;
				animation-iteration-count: 1 !important;
				transition-duration: 0.01ms !important;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<header class="header">
			<h1 class="title">农历</h1>
			<p class="subtitle">Traditional Chinese Calendar</p>
		</header>

		<section class="section">
			<h2 class="label">
				公历
				<span class="label-en">Gregorian Date</span>
			</h2>
			<div class="value">${gregorianDate}</div>
		</section>

		<section class="section">
			<h2 class="label">
				农历
				<span class="label-en">Traditional Date</span>
			</h2>
			<div class="value value-large">${lunarDate}</div>
		</section>

		<section class="section">
			<h2 class="label">
				天干地支
				<span class="label-en">Stems & Branches</span>
			</h2>
			<div class="stems-branches">
				<div class="stem-branch">
					<span class="stem-branch-label">年 Year</span>
					<span class="stem-branch-value">${yearGanZhi}年</span>
				</div>
				<div class="stem-branch">
					<span class="stem-branch-label">月 Month</span>
					<span class="stem-branch-value">${monthGanZhi}月</span>
				</div>
				<div class="stem-branch">
					<span class="stem-branch-label">日 Day</span>
					<span class="stem-branch-value">${dayGanZhi}日</span>
				</div>
			</div>
		</section>

		<section class="section">
			<h2 class="label">
				生肖
				<span class="label-en">Zodiac</span>
			</h2>
			<div class="zodiac-container">
				<span class="zodiac-cn">${zodiac}</span>
				<span class="zodiac-en">${zodiac}</span>
			</div>
		</section>

		<section class="section">
			<h2 class="label">
				节气
				<span class="label-en">Solar Term</span>
			</h2>
			<div class="value">
				${jieQi ? `<p>今日：${jieQi}</p>` : ''}
				${nextJieQiName ? `<p>下期：${nextJieQiName}（${nextJieQiDate} · ${nextJieQiLunarDate}）</p>` : ''}
			</div>
		</section>

		<section class="section">
			<h2 class="label">
				宜
				<span class="label-en">Suitable For</span>
			</h2>
			<div class="activities-list">
				${yi.map((activity) => `<span class="activity-tag yi-tag">${activity}</span>`).join('')}
			</div>
		</section>

		<section class="section">
			<h2 class="label">
				忌
				<span class="label-en">Avoid</span>
			</h2>
			<div class="activities-list">
				${ji.map((activity) => `<span class="activity-tag ji-tag">${activity}</span>`).join('')}
			</div>
		</section>

		<footer class="footer">
			<div>© ${year} Traditional Chinese Calendar</div>
			<div class="footer-links">
				<a class="footer-link" href="https://github.com/scopewu/lunar" target="_blank" rel="noopener nofollow">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/></svg>
					GitHub
				</a>
				<span class="footer-divider">|</span>
				<a class="footer-link" href="https://tie.pub/me/" target="_blank" rel="author me">
					<svg data-stroke viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
					吴文俊
				</a>
			</div>
		</footer>
	</div>

	<script>
		function scheduleMidnightRefresh() {
			const now = new Date();
			const tomorrow = new Date(now);
			tomorrow.setDate(tomorrow.getDate() + 1);
			tomorrow.setHours(0, 0, 0, 0);
			const msUntilMidnight = tomorrow - now;

			setTimeout(() => {
				location.reload();
			}, msUntilMidnight);
		}

		scheduleMidnightRefresh();
	</script>
</body>
</html>`;

	return html;
}

export function generate404Html(): string {
	const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>404 页面未找到 | Traditional Chinese Calendar</title>
	<meta name="description" content="您访问的页面不存在。The page you are looking for does not exist.">
	<meta name="robots" content="noindex, nofollow">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;500&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">
	<link rel="apple-touch-icon" sizes="180x180" href="https://s.tie.pub/lunar-icons/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="https://s.tie.pub/lunar-icons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="https://s.tie.pub/lunar-icons/favicon-16x16.png">

	<style>
		:root {
			--color-bg: #FAFAF7;
			--color-card: #FFFFFF;
			--color-text-primary: #1A1A1A;
			--color-text-secondary: #6B7280;
			--color-accent: #5B8C85;
			--color-accent-light: #E8F0EE;
			--color-border: #E5E5E0;

			--font-display: 'Ma Shan Zheng', cursive;
			--font-heading: 'ZCOOL XiaoWei', serif;
			--font-body: 'Noto Serif SC', 'STSong', 'SimSun', serif;

			--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04),
							 0 8px 24px rgba(0, 0, 0, 0.04);
		}

		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: var(--font-body);
			min-height: 100vh;
			min-height: 100dvh;
			background-color: var(--color-bg);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20px;
			color: var(--color-text-primary);
			line-height: 1.6;
		}

		.container {
			position: relative;
			max-width: 520px;
			width: 100%;
			background: var(--color-card);
			border-radius: 16px;
			box-shadow: var(--shadow-card);
			border: 1px solid var(--color-border);
			padding: 56px 40px 48px;
			text-align: center;
			animation: fadeIn 0.6s ease-out;
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
				transform: translateY(20px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}

		.error-code {
			font-family: var(--font-display);
			font-size: 6rem;
			color: var(--color-accent);
			line-height: 1;
			letter-spacing: 4px;
			margin-bottom: 16px;
		}

		.subtitle {
			font-family: var(--font-heading);
			font-size: 1.05rem;
			color: var(--color-text-secondary);
			letter-spacing: 2px;
			font-weight: 400;
			margin-bottom: 28px;
			padding-bottom: 28px;
			border-bottom: 1px solid var(--color-border);
		}

		.message {
			font-size: 0.95rem;
			color: var(--color-text-secondary);
			line-height: 1.8;
			margin-bottom: 36px;
		}

		.message p + p {
			margin-top: 4px;
			opacity: 0.8;
			font-size: 0.85rem;
		}

		.home-link {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 12px 32px;
			background: var(--color-accent);
			color: #FFFFFF;
			text-decoration: none;
			border-radius: 24px;
			font-family: var(--font-heading);
			font-size: 1rem;
			letter-spacing: 1.5px;
			transition: background-color 0.2s ease, transform 0.2s ease;
		}

		.home-link:hover {
			background: #4A7770;
			transform: translateY(-1px);
		}

		.home-link svg {
			width: 16px;
			height: 16px;
			fill: none;
			stroke: currentColor;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
		}

		@media (max-width: 500px) {
			body {
				padding: 16px;
			}

			.container {
				padding: 44px 28px 40px;
				border-radius: 14px;
			}

			.error-code {
				font-size: 4.5rem;
			}

			.subtitle {
				font-size: 0.95rem;
				letter-spacing: 1.5px;
			}
		}

		@media (max-width: 380px) {
			.container {
				padding: 36px 20px 36px;
			}

			.error-code {
				font-size: 3.75rem;
			}

			.home-link {
				padding: 11px 26px;
				font-size: 0.95rem;
			}
		}

		@media (prefers-color-scheme: dark) {
			:root {
				--color-bg: #111110;
				--color-card: #1C1C1A;
				--color-text-primary: #EAEAE6;
				--color-text-secondary: #9CA3AF;
				--color-accent: #7FADA6;
				--color-accent-light: #232D2B;
				--color-border: #2E2E2A;
				--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.2),
								 0 8px 24px rgba(0, 0, 0, 0.25);
			}

			.home-link {
				background: var(--color-accent);
				color: #111110;
			}

			.home-link:hover {
				background: #94BFB8;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			*,
			*::before,
			*::after {
				animation-duration: 0.01ms !important;
				animation-iteration-count: 1 !important;
				transition-duration: 0.01ms !important;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="error-code">404</div>
		<p class="subtitle">页面未找到 · Page Not Found</p>
		<div class="message">
			<p>您访问的页面不存在。</p>
			<p>The page you are looking for does not exist.</p>
		</div>
		<a class="home-link" href="/" aria-label="返回首页 Back to Home">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/><path d="M9 21v-6h6v6"/></svg>
			返回首页 · Back to Home
		</a>
	</div>
</body>
</html>`;

	return html;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/robots.txt') {
			return new Response('User-agent: *\nAllow: /\n', {
				headers: {
					'content-type': 'text/plain;charset=UTF-8',
				},
			});
		}

		if (url.pathname === '/favicon.ico') {
			return new Response(FAVICON_ICO, {
				headers: {
					'content-type': 'image/x-icon',
					'cache-control': 'public, max-age=86400',
				},
			});
		}

		if (url.pathname === '/sitemap.xml') {
			const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${url.protocol}//${url.host}/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
</urlset>`;
			return new Response(sitemap, {
				headers: {
					'content-type': 'application/xml;charset=UTF-8',
				},
			});
		}

		const dateParam = url.searchParams.get('date');
		const date = dateParam ? new Date(dateParam) : undefined;
		const html = generateHtml(date);

		if (url.pathname === '/') {
			return new Response(html, {
				headers: {
					'content-type': 'text/html;charset=UTF-8',
				},
			});
		}

		return new Response(generate404Html(), {
			status: 404,
			headers: {
				'content-type': 'text/html;charset=UTF-8',
			},
		});
	},
} satisfies ExportedHandler<Env>;
