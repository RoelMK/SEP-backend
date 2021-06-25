import { UnderstandExport } from './qualityTypes';

/**
 * Converts fault ratios to rankings for metrics
 * @param ratio fault to total ratio
 * @returns rank between -2 and 2
 */
export function ratioToRank(ratio: number): number {
    if (ratio < 0.04) {
        return 2;
    } else if (ratio < 0.06) {
        return 1;
    } else if (ratio < 0.11) {
        return 0;
    } else if (ratio < 0.21) {
        return -1;
    } else {
        return -2;
    }
}
/**
 * Generates a list of all present kinds in the Understand Export
 * @param understandExport Understand Export array
 * @returns all different kinds in the Understand Export
 */
export function getAllKinds(understandExport: UnderstandExport[]): string[] {
    const kinds: string[] = [];
    understandExport.forEach((element) => {
        if (!kinds.includes(element.kind)) {
            kinds.push(element.kind);
        }
    });
    return kinds;
}

/**
 * Simplifies names as private method to method or unnamed function to function
 * @param understandExport list of Understand exported metrics
 */
export function simplifyKinds(understandExport: UnderstandExport[]): void {
    understandExport.forEach((element) => {
        const words = element.kind.split(' ');
        element.kind = words[words.length - 1];
    });
}
