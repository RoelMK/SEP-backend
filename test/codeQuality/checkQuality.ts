// Important: Only files under the src directory in this project need to be analyzed
// (We should not forget to clearly mention this)

import CSVParser from '../../src/services/fileParsers/csvParser';
import { MAX_SLOC, MIN_COMMENT_RATIO } from './qualityThresholds';
import { initMReport, initQReport, metric, MetricReport, QualityReport } from './qualityTypes';

class QualityCheck {
    private qReport: QualityReport = { ...initQReport };
    private mReport: MetricReport = { ...initMReport };

    async analyseUnderstandExports() {
        const csvParser = new CSVParser();

        // parse csv
        const understandExport: UnderstandExport[] = (await csvParser.parse(
            'test/codeQuality/metrics.csv'
        )) as unknown as UnderstandExport[];
        console.log(understandExport);

        // reduce kind names to basics
        this.simplifyKinds(understandExport);

        this.calculateSLOCRank(understandExport);
        this.calculateCommentRatio(understandExport);

        console.log(this.mReport);
    }

    private calculateSLOCRank(understandExport: UnderstandExport[]) {
        const moduleExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'Class' || metric.kind == 'File'
        );
        const faultyModules: UnderstandExport[] = [];
        // identify faulty modules that have too many Software lines of Code
        moduleExports.forEach((undExport) => {
            if (undExport.countlinecode >= MAX_SLOC) faultyModules.push(undExport);
        });

        console.log('Too many lines in');
        console.log(faultyModules);

        // Calculate software line of code rank by dividing faulty modules by evaluated modules
        this.mReport[metric.SLOC] = this.ratioToRank(faultyModules.length / moduleExports.length);
    }

    private calculateCommentRatio(understandExport: UnderstandExport[]) {
        const fileExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'File'
        );
        const faultyFiles: UnderstandExport[] = [];
        // identify faulty modules that have little comments
        fileExports.forEach((undExport) => {
            if (undExport.ratiocommenttocode <= MIN_COMMENT_RATIO) faultyFiles.push(undExport);
        });

        console.log('Little comments in');
        console.log(faultyFiles);
        // Calculate software line of code rank by dividing faulty modules by evaluated modules
        this.mReport[metric.COMMENT_RATIO] = this.ratioToRank(
            faultyFiles.length / fileExports.length
        );
    }

    /**
     * Converts fault ratios to rankings for metrics
     * @param ratio fault to total ratio
     * @returns rank between -2 and 2
     */
    private ratioToRank(ratio: number) {
        //TODO check thresholds
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
    private getAllKinds(understandExport: UnderstandExport[]): string[] {
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
    private simplifyKinds(understandExport: UnderstandExport[]) {
        understandExport.forEach((element) => {
            const words = element.kind.split(' ');
            element.kind = words[words.length - 1];
        });
    }
}

new QualityCheck().analyseUnderstandExports();

interface UnderstandExport {
    kind: string;
    name: string;
    file: string;
    avgcyclomatic: number;
    countlinecode: number;
    maxcyclomatic: number;
    ratiocommenttocode: number;
    countdeclmethod: number;
    countdeclfunction: number;
}
