// Important: Only files under the src directory in this project need to be analyzed
// (We should not forget to clearly mention this)

import CSVParser from '../../src/services/fileParsers/csvParser';
import {
    MAX_AVG_COMPLEXITY,
    MAX_FUNCTIONS_MODULE,
    MAX_METHODS_CLASS,
    MAX_METHOD_COMPLEXITY,
    MAX_SLOC,
    MIN_COMMENT_RATIO
} from './qualityThresholds';
import {
    initMReport,
    initQReport,
    metric,
    MetricReport,
    mInvolvedIn,
    QualityReport
} from './qualityTypes';

class QualityCheck {
    private qReport: QualityReport = { ...initQReport };
    private mReport: MetricReport = { ...initMReport };

    async analyseUnderstandExports() {
        const csvParser = new CSVParser();

        // parse csv
        const understandExport: UnderstandExport[] = (await csvParser.parse(
            'test/codeQuality/metrics.csv'
        )) as unknown as UnderstandExport[];
        //console.log(understandExport);

        // reduce kind names to basics
        this.simplifyKinds(understandExport);

        // calculate metrics
        this.calculateSLOCRank(understandExport);
        this.calculateCommentRatioRank(understandExport);
        this.calculateAVGCycloRank(understandExport);
        this.calculateMAXCycloRank(understandExport);
        this.calculateMethodsClassRank(understandExport);
        this.calculateFunctionsModuleRank(understandExport);

        console.log(this.mReport);

        this.generateQualityReport();
        console.log(this.qReport);
    }

    private generateQualityReport() {
        //TODO what to do with avg and max cyclomatic
        // loop over all metrics
        Object.keys(this.mReport).forEach((metric) => {
            //check in which att they are involved
            mInvolvedIn[metric].forEach((attribute) => {
                this.qReport[attribute].rank += this.mReport[metric];
                this.qReport[attribute].metricsInvolved++;
            });
        });

        Object.values(this.qReport).forEach((value) => {
            value.rank = value.rank / value.metricsInvolved;
        });
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

    private calculateCommentRatioRank(understandExport: UnderstandExport[]) {
        const fileExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'File'
        );
        const faultyFiles: UnderstandExport[] = [];
        // identify faulty modules that have little comments
        fileExports.forEach((undExport) => {
            if (undExport.ratiocommenttocode <= MIN_COMMENT_RATIO) {
                faultyFiles.push(undExport);
                console.log('Not enough comments in');
                console.log(undExport);
            }
        });

        // Calculate software line of code rank by dividing faulty modules by evaluated modules
        this.mReport[metric.COMMENT_RATIO] = this.ratioToRank(
            faultyFiles.length / fileExports.length
        );
    }

    private calculateAVGCycloRank(understandExport: UnderstandExport[]) {
        const moduleExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'Class' || metric.kind == 'File'
        );
        const faultyModules: UnderstandExport[] = [];
        // identify faulty modules that have too many Software lines of Code
        moduleExports.forEach((undExport) => {
            if (undExport.avgcyclomatic >= MAX_AVG_COMPLEXITY) faultyModules.push(undExport);
        });

        console.log('Too much average complexity in');
        console.log(faultyModules);

        // Calculate software line of code rank by dividing faulty modules by evaluated modules
        this.mReport[metric.AVG_COMPLEXITY] = this.ratioToRank(
            faultyModules.length / moduleExports.length
        );
    }

    private calculateMAXCycloRank(understandExport: UnderstandExport[]) {
        const moduleExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'Class' || metric.kind == 'File'
        );
        const faultyModules: UnderstandExport[] = [];
        // identify faulty modules that have too many Software lines of Code
        moduleExports.forEach((undExport) => {
            if (undExport.maxcyclomatic >= MAX_METHOD_COMPLEXITY) faultyModules.push(undExport);
        });

        console.log('Method with too much complexity in');
        console.log(faultyModules);

        // Calculate software line of code rank by dividing faulty modules by evaluated modules
        this.mReport[metric.METHOD_COMPLEXITY] = this.ratioToRank(
            faultyModules.length / moduleExports.length
        );
    }

    private calculateMethodsClassRank(understandExport: UnderstandExport[]) {
        const moduleExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'Class'
        );
        const faultyModules: UnderstandExport[] = [];
        // identify faulty modules that have too many Software lines of Code
        moduleExports.forEach((undExport) => {
            if (undExport.countdeclmethod >= MAX_METHODS_CLASS) faultyModules.push(undExport);
        });

        console.log('Classes with too many methods');
        console.log(faultyModules);

        // Calculate software line of code rank by dividing faulty modules by evaluated modules
        this.mReport[metric.METHODS_CLASS] = this.ratioToRank(
            faultyModules.length / moduleExports.length
        );
    }

    private calculateFunctionsModuleRank(understandExport: UnderstandExport[]) {
        const moduleExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'File'
        );
        const faultyModules: UnderstandExport[] = [];
        // identify faulty modules that have too many Software lines of Code
        moduleExports.forEach((undExport) => {
            if (undExport.countdeclfunction >= MAX_FUNCTIONS_MODULE) faultyModules.push(undExport);
        });

        console.log('Modules with too many functions');
        console.log(faultyModules);

        // Calculate software line of code rank by dividing faulty modules by evaluated modules
        this.mReport[metric.FUNCTIONS_MODULE] = this.ratioToRank(
            faultyModules.length / moduleExports.length
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
