export const makeLogger = (tag: string) =>
	function log(...args: any[]) {
		console.log(`[${tag}]`, ...args);
	};
