import { Solar } from 'lunar-javascript';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const solar = Solar.fromDate(new Date());
		const lunar = solar.getLunar();

		const gregorianDate = solar.toString();
		const lunarDate = lunar.toString();
		const yearGanZhi = lunar.getYearInGanZhi();
		const monthGanZhi = lunar.getMonthInGanZhi();
		const dayGanZhi = lunar.getDayInGanZhi();
		const zodiac = lunar.getYearShengXiao();
		const yi = lunar.getDayYi();
		const ji = lunar.getDayJi();

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
	<meta name="theme-color" content="#DC143C">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;500;600;700&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">
	<meta property="og:title" content="农历 ${lunarDate} | Traditional Chinese Calendar">
	<meta property="og:description" content="查看今日农历、天干地支、生肖及宜忌信息">
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://lunar.tie.pub">
	<meta property="og:locale" content="zh_CN">
	<meta name="twitter:card" content="summary">
	<meta name="twitter:title" content="农历 ${lunarDate} | Traditional Chinese Calendar">
	<meta name="twitter:description" content="查看今日农历、天干地支、生肖及宜忌信息">
	<link rel="canonical" href="https://lunar.tie.pub">
	<script type="application/ld+json">
	{
	  "@context": "https://schema.org",
	  "@type": "WebPage",
	  "name": "农历 ${lunarDate} - Traditional Chinese Calendar",
	  "description": "查看今日农历、天干地支、生肖及宜忌等传统文化信息",
 	  "url": "https://lunar.tie.pub",
	  "datePublished": "${gregorianDate}",
	  "inLanguage": "zh-CN",
	  "author": {
	    "@type": "Person",
	    "name": "吴文俊（Wú Wénjùn）",
	    "url": "https://tie.pub/me/"
	  }
	}
	</script>

	<style>
		/* ========== CSS Variables ========== */
		:root {
			/* Colors */
			--color-primary-jade: #8BA9A9;
			--color-bright-jade: #A8C5C0;
			--color-soft-gold: #D4BC8E;
			--color-porcelain: #FAF8F3;
			--color-warm-sand: #E5D4BC;
			--color-celadon: #C8DDD3;
			--color-deep-ink: #5A6A6A;
			--color-semi-jade: rgba(139, 169, 169, 0.12);
			--color-semi-jade-dark: rgba(139, 169, 169, 0.75);

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
			--shadow-card: 0 25px 70px rgba(0, 0, 0, 0.45),
							 0 0 50px rgba(139, 169, 169, 0.15),
							 inset 0 0 80px rgba(139, 169, 169, 0.05);
			--shadow-text: 1px 1px 6px rgba(0, 0, 0, 0.25);
			--shadow-subtle: 0px 0px 2px rgba(0, 0, 0, 0.12);
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
background:
			radial-gradient(circle at 20% 30%, rgba(168, 197, 192, 0.12) 0%, transparent 50%),
			radial-gradient(circle at 80% 70%, rgba(200, 221, 211, 0.10) 0%, transparent 50%),
			linear-gradient(135deg, var(--color-porcelain) 0%, var(--color-primary-jade) 45%, var(--color-celadon) 100%);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20px;
			overflow-x: hidden;
			position: relative;
		}

		/* Noise texture overlay */
		body::before {
			content: '';
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			opacity: 0.03;
			z-index: 1;
			background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		}

		/* ========== Container ========== */
		.container {
			position: relative;
			z-index: 2;
			max-width: 540px;
			width: 100%;
			background: var(--color-semi-jade-dark);
			border-radius: 24px;
			box-shadow: var(--shadow-card);
			border: 2px solid rgba(212, 188, 142, 0.28);
			padding: 48px 36px 40px;
			color: var(--color-porcelain);
			animation: containerFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1);
		}

		/* Decorative corner borders */
		.container::before,
		.container::after {
			content: '';
			position: absolute;
			width: 60px;
			height: 60px;
			border: 2px solid var(--color-soft-gold);
			opacity: 0.6;
			pointer-events: none;
		}

		.container::before {
			top: 12px;
			left: 12px;
			border-right: none;
			border-bottom: none;
			border-radius: 12px 0 0 0;
		}

		.container::after {
			bottom: 12px;
			right: 12px;
			border-left: none;
			border-top: none;
			border-radius: 0 0 12px 0;
		}

		@keyframes containerFadeIn {
			from {
				opacity: 0;
				transform: translateY(30px) scale(0.95);
			}
			to {
				opacity: 1;
				transform: translateY(0) scale(1);
			}
		}

		/* ========== Header ========== */
		.header {
			text-align: center;
			margin-bottom: 36px;
			padding-bottom: 24px;
			border-bottom: 2px solid rgba(212, 188, 142, 0.20);
			position: relative;
		}

		/* Decorative element */
		.header::after {
			content: '◆';
			position: absolute;
			bottom: -9px;
			left: 50%;
			transform: translateX(-50%);
			font-size: 14px;
			color: var(--color-soft-gold);
			background: var(--color-primary-jade);
			padding: 0 10px;
		}

		.title {
			font-family: var(--font-display);
			font-size: 3rem;
			color: var(--color-soft-gold);
			text-shadow: var(--shadow-text);
			margin-bottom: 6px;
			letter-spacing: 8px;
			line-height: 1.2;
		}

		.subtitle {
			font-family: var(--font-heading);
			font-size: 1.1rem;
			color: var(--color-porcelain);
			opacity: 0.85;
			letter-spacing: 3px;
			font-weight: 400;
		}

		/* ========== Sections ========== */
		.section {
			margin-bottom: 28px;
			animation: sectionSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) backwards;
		}

		.section:nth-child(1) { animation-delay: 0.08s; }
		.section:nth-child(2) { animation-delay: 0.16s; }
		.section:nth-child(3) { animation-delay: 0.24s; }
		.section:nth-child(4) { animation-delay: 0.32s; }
		.section:nth-child(5) { animation-delay: 0.4s; }
		.section:nth-child(6) { animation-delay: 0.48s; }

		@keyframes sectionSlideIn {
			from {
				opacity: 0;
				transform: translateX(-15px);
			}
			to {
				opacity: 1;
				transform: translateX(0);
			}
		}

		/* ========== Labels ========== */
		.label {
			font-size: 0.8rem;
			color: var(--color-soft-gold);
			margin-bottom: 10px;
			text-transform: uppercase;
			letter-spacing: 3px;
			font-weight: 600;
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.label::before {
			content: '—';
			color: var(--color-warm-sand);
			font-size: 0.9rem;
		}
		.label-en {
			font-size: 0.7rem;
			color: var(--color-warm-sand);
			margin-left: 4px;
			text-transform: none;
			letter-spacing: 1.5px;
			font-weight: 400;
			opacity: 0.8;
		}

		/* ========== Values ========== */
		.value {
			font-size: 1.35rem;
			color: var(--color-porcelain);
			line-height: 1.7;
			text-shadow: var(--shadow-subtle);
		}

		.value-large {
			font-family: var(--font-heading);
			font-size: 2rem;
			color: var(--color-soft-gold);
			font-weight: 500;
			letter-spacing: 3px;
			text-shadow: var(--shadow-text);
		}

		/* ========== Stems & Branches ========== */
		.stems-branches {
			display: flex;
			flex-direction: column;
			gap: 10px;
		}

		.stem-branch {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 16px;
			background: linear-gradient(90deg, var(--color-semi-jade) 0%, rgba(92, 122, 122, 0.05) 100%);
			border-radius: 10px;
			border-left: 3px solid var(--color-soft-gold);
			transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
			position: relative;
			overflow: hidden;
		}

		/* Shimmer effect */
		.stem-branch::before {
			content: '';
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, transparent, rgba(212, 188, 142, 0.08), transparent);
			transition: left 0.6s ease;
		}
		.stem-branch:hover {
			background: linear-gradient(90deg, rgba(92, 122, 122, 0.15) 0%, rgba(92, 122, 122, 0.05) 100%);
			transform: translateX(8px);
			border-left-color: var(--color-warm-sand);
		}

		.stem-branch:hover::before {
			left: 100%;
		}
		.stem-branch-label {
			font-size: 0.9rem;
			color: var(--color-soft-gold);
			font-weight: 500;
		}

		.stem-branch-value {
			font-size: 1.15rem;
			color: var(--color-porcelain);
			font-weight: 600;
			font-family: var(--font-heading);
		}

		/* ========== Zodiac ========== */
		.zodiac-container {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 18px;
			padding: 20px;
			background:
				radial-gradient(circle at center, rgba(200, 221, 211, 0.15) 0%, rgba(168, 197, 192, 0.08) 100%);
			border-radius: 16px;
			border: 2px solid rgba(212, 188, 142, 0.25);
			position: relative;
			overflow: hidden;
		}

		/* Decorative pattern */
		.zodiac-container::before {
			content: '✦ ✦ ✦';
			position: absolute;
			top: 8px;
			left: 50%;
			transform: translateX(-50%);
			font-size: 10px;
			color: var(--color-warm-sand);
			letter-spacing: 8px;
			opacity: 0.5;
		}

		.zodiac-cn {
			font-family: var(--font-display);
			font-size: 3.5rem;
			color: var(--color-soft-gold);
			text-shadow: var(--shadow-text);
			line-height: 1;
		}

		.zodiac-en {
			font-family: var(--font-heading);
			font-size: 1.3rem;
			color: var(--color-porcelain);
			font-weight: 500;
			letter-spacing: 2px;
			text-transform: capitalize;
		}

		/* ========== Activities (Yi/Ji) ========== */
		.activities-list {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
		}

		.activity-tag {
			padding: 8px 16px;
			border-radius: 24px;
			font-size: 0.95rem;
			transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
			cursor: default;
			position: relative;
			overflow: hidden;
		}
		.yi-tag {
			background: linear-gradient(135deg, rgba(212, 188, 142, 0.18) 0%, rgba(212, 188, 142, 0.10) 100%);
			color: var(--color-soft-gold);
			border: 1px solid rgba(212, 188, 142, 0.30);
			box-shadow: 0 2px 8px rgba(212, 188, 142, 0.08);
		}
		.yi-tag:hover {
			background: linear-gradient(135deg, rgba(212, 188, 142, 0.25) 0%, rgba(212, 188, 142, 0.12) 100%);
			transform: translateY(-2px) scale(1.05);
			box-shadow: 0 4px 12px rgba(212, 188, 142, 0.15);
		}
		.ji-tag {
			background: linear-gradient(135deg, rgba(61, 74, 74, 0.45) 0%, rgba(92, 122, 122, 0.25) 100%);
			color: var(--color-celadon);
			border: 1px solid rgba(200, 221, 211, 0.20);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		}
		.ji-tag:hover {
			background: linear-gradient(135deg, rgba(61, 74, 74, 0.60) 0%, rgba(92, 122, 122, 0.35) 100%);
			transform: translateY(-2px) scale(1.05);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
		}

		/* ========== Footer ========== */
		.footer {
			text-align: center;
			margin-top: 36px;
			padding-top: 24px;
			border-top: 1px solid rgba(212, 188, 142, 0.15);
			font-size: 0.75rem;
			color: var(--color-warm-sand);
			opacity: 0.7;
			font-family: var(--font-heading);
			letter-spacing: 1px;
		}

		/* ========== Responsive Design ========== */
		@media (max-width: 500px) {
			body {
				padding: 16px;
			}

			.container {
				padding: 36px 24px 32px;
				border-radius: 20px;
			}

			.title {
				font-size: 2.5rem;
				letter-spacing: 6px;
			}

			.subtitle {
				font-size: 1rem;
				letter-spacing: 2px;
			}

			.value-large {
				font-size: 1.7rem;
			}

			.zodiac-cn {
				font-size: 3rem;
			}

			.zodiac-en {
				font-size: 1.1rem;
			}

			.stem-branch {
				padding: 8px 14px;
			}

			.container::before,
			.container::after {
				width: 40px;
				height: 40px;
			}
		}

		@media (max-width: 380px) {
			.container {
				padding: 30px 18px 28px;
			}

			.title {
				font-size: 2.2rem;
				letter-spacing: 4px;
			}

			.value {
				font-size: 1.15rem;
			}

			.value-large {
				font-size: 1.5rem;
			}

			.label {
				font-size: 0.75rem;
				letter-spacing: 2px;
			}

			.activity-tag {
				padding: 6px 14px;
				font-size: 0.85rem;
			}

			.stem-branch {
				flex-direction: column;
				gap: 6px;
				text-align: center;
				padding: 12px 10px;
			}

			.stem-branch-value {
				font-size: 1rem;
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
			© ${year} Traditional Chinese Calendar
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

		return new Response(html, {
			headers: {
				'content-type': 'text/html;charset=UTF-8',
			},
		});
	},
} satisfies ExportedHandler<Env>;
