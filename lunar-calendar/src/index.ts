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

		const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>农历 Lunar Calendar</title>
	<meta name="description" content="查看今日农历信息 - ${lunarDate}。包括天干地支、生肖、宜忌等传统文化内容。Check today's lunar calendar information including stems & branches, zodiac, and daily activities.">
	<meta name="keywords" content="农历, 黄历, 天干地支, 生肖, Lunar Calendar, Chinese Calendar, 宜忌, 日期">
	<meta name="author" content="吴文俊（Wú Wénjùn）">
	<link rel="author" href="https://tie.pub/me/">
	<meta name="robots" content="index, follow">
	<meta name="theme-color" content="#DC143C">
	<meta property="og:title" content="农历 ${lunarDate} | Lunar Calendar">
	<meta property="og:description" content="查看今日农历、天干地支、生肖及宜忌信息">
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://lunar.tie.pub">
	<meta property="og:locale" content="zh_CN">
	<meta name="twitter:card" content="summary">
	<meta name="twitter:title" content="农历 ${lunarDate} | Lunar Calendar">
	<meta name="twitter:description" content="查看今日农历、天干地支、生肖及宜忌信息">
	<link rel="canonical" href="https://lunar.tie.pub">
	<script type="application/ld+json">
	{
	  "@context": "https://schema.org",
	  "@type": "WebPage",
	  "name": "农历 ${lunarDate} - Lunar Calendar",
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
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: 'Noto Serif SC', 'STSong', 'SimSun', serif;
			min-height: 100vh;
			min-height: 100dvh;
			background: linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FFD700 100%);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20px;
			overflow-x: hidden;
		}

		.container {
			max-width: 500px;
			width: 100%;
			background: rgba(139, 0, 0, 0.85);
			border-radius: 20px;
			box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
						0 0 40px rgba(255, 215, 0, 0.3),
						inset 0 0 60px rgba(255, 215, 0, 0.1);
			border: 2px solid rgba(255, 215, 0, 0.4);
			padding: 40px 30px;
			color: #FFF8DC;
			animation: fadeIn 0.8s ease-out;
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

		.header {
			text-align: center;
			margin-bottom: 30px;
			padding-bottom: 20px;
			border-bottom: 2px solid rgba(255, 215, 0, 0.3);
		}

		.title {
			font-size: 2.5rem;
			font-weight: bold;
			color: #FFD700;
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
			margin-bottom: 8px;
			letter-spacing: 4px;
		}

		.subtitle {
			font-size: 1rem;
			color: #FFF8DC;
			opacity: 0.9;
			font-style: italic;
		}

		.section {
			margin-bottom: 25px;
			animation: slideIn 0.6s ease-out backwards;
		}

		.section:nth-child(1) { animation-delay: 0.1s; }
		.section:nth-child(2) { animation-delay: 0.2s; }
		.section:nth-child(3) { animation-delay: 0.3s; }
		.section:nth-child(4) { animation-delay: 0.4s; }
		.section:nth-child(5) { animation-delay: 0.5s; }
		.section:nth-child(6) { animation-delay: 0.6s; }

		@keyframes slideIn {
			from {
				opacity: 0;
				transform: translateX(-10px);
			}
			to {
				opacity: 1;
				transform: translateX(0);
			}
		}

		.label {
			font-size: 0.85rem;
			color: #FFD700;
			margin-bottom: 8px;
			text-transform: uppercase;
			letter-spacing: 2px;
			font-weight: 600;
		}

		.label-en {
			font-size: 0.75rem;
			color: #DAA520;
			margin-left: 6px;
			text-transform: none;
			letter-spacing: 1px;
			font-weight: normal;
		}

		.value {
			font-size: 1.3rem;
			color: #FFF8DC;
			line-height: 1.6;
			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
		}

		.value-large {
			font-size: 1.8rem;
			color: #FFD700;
			font-weight: bold;
			letter-spacing: 2px;
		}

		.stems-branches {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		.stem-branch {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 8px 12px;
			background: rgba(255, 215, 0, 0.1);
			border-radius: 8px;
			border-left: 3px solid #FFD700;
			transition: all 0.3s ease;
		}

		.stem-branch:hover {
			background: rgba(255, 215, 0, 0.2);
			transform: translateX(5px);
		}

		.stem-branch-label {
			font-size: 0.9rem;
			color: #FFD700;
		}

		.stem-branch-value {
			font-size: 1.1rem;
			color: #FFF8DC;
			font-weight: bold;
		}

		.zodiac-container {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 15px;
			padding: 15px;
			background: rgba(255, 215, 0, 0.15);
			border-radius: 12px;
			border: 2px solid rgba(255, 215, 0, 0.3);
		}

		.zodiac-cn {
			font-size: 3rem;
			color: #FFD700;
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
		}

		.zodiac-en {
			font-size: 1.2rem;
			color: #FFF8DC;
			font-weight: bold;
		}

		.activities-list {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
		}

		.activity-tag {
			padding: 6px 14px;
			border-radius: 20px;
			font-size: 0.95rem;
			transition: all 0.3s ease;
		}

		.yi-tag {
			background: rgba(255, 215, 0, 0.25);
			color: #FFD700;
			border: 1px solid rgba(255, 215, 0, 0.4);
		}

		.yi-tag:hover {
			background: rgba(255, 215, 0, 0.35);
			transform: scale(1.05);
		}

		.ji-tag {
			background: rgba(139, 0, 0, 0.4);
			color: #FFA07A;
			border: 1px solid rgba(255, 160, 122, 0.3);
		}

		.ji-tag:hover {
			background: rgba(139, 0, 0, 0.5);
			transform: scale(1.05);
		}

		.footer {
			text-align: center;
			margin-top: 30px;
			padding-top: 20px;
			border-top: 1px solid rgba(255, 215, 0, 0.2);
			font-size: 0.8rem;
			color: #DAA520;
			opacity: 0.8;
		}

		/* Mobile responsive */
		@media (max-width: 480px) {
			.container {
				padding: 30px 20px;
			}

			.title {
				font-size: 2rem;
				letter-spacing: 2px;
			}

			.value-large {
				font-size: 1.5rem;
			}

			.zodiac-cn {
				font-size: 2.5rem;
			}

			.stem-branch {
				flex-direction: column;
				gap: 5px;
				text-align: center;
			}
		}

		/* Small mobile */
		@media (max-width: 375px) {
			.container {
				padding: 25px 15px;
			}

			.title {
				font-size: 1.8rem;
			}

			.value {
				font-size: 1.1rem;
			}

			.value-large {
				font-size: 1.3rem;
			}

			.label {
				font-size: 0.8rem;
			}

			.activity-tag {
				padding: 5px 12px;
				font-size: 0.85rem;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<header class="header">
			<h1 class="title">农历</h1>
			<p class="subtitle">Lunar Calendar</p>
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
				<span class="label-en">Lunar Date</span>
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
				${yi.map(activity => `<span class="activity-tag yi-tag">${activity}</span>`).join('')}
			</div>
		</section>

		<section class="section">
			<h2 class="label">
				忌
				<span class="label-en">Avoid</span>
			</h2>
			<div class="activities-list">
				${ji.map(activity => `<span class="activity-tag ji-tag">${activity}</span>`).join('')}
			</div>
		</section>

		<footer class="footer">
			© 2025 Lunar Calendar
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
