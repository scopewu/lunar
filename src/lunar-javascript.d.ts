declare module 'lunar-javascript' {
	export class Solar {
		static fromDate(date: Date): Solar;
		getLunar(): Lunar;
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
	}
}
