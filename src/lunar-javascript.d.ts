declare module 'lunar-javascript' {
	export class Solar {
		static fromDate(date: Date): Solar;
		getLunar(): Lunar;
		getYear(): number;
		toString(): string;
	}

	export interface JieQi {
		getName(): string;
		getSolar(): Solar;
		toString(): string;
	}

	export class Lunar {
		toString(): string;
		getYearInGanZhi(): string;
		getMonthInGanZhi(): string;
		getDayInGanZhi(): string;
		getYearShengXiao(): string;
		getDayYi(): string[];
		getDayJi(): string[];
		getJieQi(): string;
		getNextJieQi(wholeDay?: boolean): JieQi | null;
		getMonthInChinese(): string;
		getDayInChinese(): string;
	}
}
