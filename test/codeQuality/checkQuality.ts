// Important: Only files under the src directory in this project need to be analyzed
// (We should not forget to clearly mention this)

import CSVParser from '../../src/services/fileParsers/csvParser';
import { ratioToRank, simplifyKinds } from './qualityHelpers';
import {
    MAX_AVG_COMPLEXITY,
    MAX_FANOUT,
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
    QualityReport,
    UnderstandDependencies,
    UnderstandDependenciesMatrix,
    UnderstandExport
} from './qualityTypes';

class QualityCheck {
    private qReport: QualityReport = { ...initQReport };
    private mReport: MetricReport = { ...initMReport };

    async analyseUnderstandExports() {
        const csvParser = new CSVParser();

        // parse metricscsv
        const understandExport: UnderstandExport[] = (await csvParser.parse(
            'test/codeQuality/metrics.csv'
        )) as unknown as UnderstandExport[];
        //console.log(understandExport);

        // reduce kind names to basics
        simplifyKinds(understandExport);

        // calculate metrics
        this.calculateSLOCRank(understandExport);
        this.calculateCommentRatioRank(understandExport);
        this.calculateAVGCycloRank(understandExport);
        this.calculateMAXCycloRank(understandExport);
        this.calculateMethodsClassRank(understandExport);
        this.calculateFunctionsModuleRank(understandExport);

        // parse csv for dependenciess
        const fileDependencies: UnderstandDependencies[] = (await csvParser.parse(
            'test/codeQuality/fileDependencies.csv'
        )) as unknown as UnderstandDependencies[];
        this.calculateFanout(fileDependencies);

        // parse csv for dependenciess
        const fileDependenciesMatrix: UnderstandDependenciesMatrix[] = (await csvParser.parse(
            'test/codeQuality/fileDependencyMatrix.csv'
        )) as unknown as UnderstandDependenciesMatrix[];
        this.calculateCyclicDependencies(fileDependenciesMatrix);

        // show metrics report
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

        // Calculate rank by dividing sum of metrics by the amount of involved metrics
        Object.values(this.qReport).forEach((value) => {
            value.rank = value.rank / value.metricsInvolved;
        });
    }

    /**
     * Calculates the metric rank for the SLOC metric
     * @param understandExport Understand Export array
     */
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
        this.mReport[metric.SLOC] = ratioToRank(faultyModules.length / moduleExports.length);
    }

    /**
     * Calculates the metric rank for the comment ratio metric
     * @param understandExport Understand Export array
     */
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
        this.mReport[metric.COMMENT_RATIO] = ratioToRank(faultyFiles.length / fileExports.length);
    }

    /**
     * Calculates the metric rank for the average cylcomatic complexity in a fle or class metric
     * @param understandExport Understand Export array
     */
    private calculateAVGCycloRank(understandExport: UnderstandExport[]) {
        const moduleExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'Class' || metric.kind == 'File'
        );
        const faultyModules: UnderstandExport[] = [];
        // identify faulty classes that have too much avg cyclomatic complexity
        moduleExports.forEach((undExport) => {
            if (undExport.avgcyclomatic >= MAX_AVG_COMPLEXITY) faultyModules.push(undExport);
        });

        console.log('Too much average complexity in');
        console.log(faultyModules);

        // Calculate avg cyclomatic complexity rank by dividing faulty modules by evaluated modules
        this.mReport[metric.AVG_COMPLEXITY] = ratioToRank(
            faultyModules.length / moduleExports.length
        );
    }

    /**
     * Calculates the metric rank for the metric that measures
     * maximum cyclomatic complexity of a method in a file of class
     * @param understandExport Understand Export array
     */
    private calculateMAXCycloRank(understandExport: UnderstandExport[]) {
        const moduleExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'Class' || metric.kind == 'File'
        );
        const faultyModules: UnderstandExport[] = [];
        // identify faulty classes that have a method with too large cyclomatic complexity
        moduleExports.forEach((undExport) => {
            if (undExport.maxcyclomatic >= MAX_METHOD_COMPLEXITY) faultyModules.push(undExport);
        });

        console.log('Method with too much complexity in');
        console.log(faultyModules);

        // Calculate max method cyclomatic complexity rank by dividing faulty modules by evaluated modules
        this.mReport[metric.METHOD_COMPLEXITY] = ratioToRank(
            faultyModules.length / moduleExports.length
        );
    }

    /**
     * Calculates the metric rank for the metric that measures
     * the amount of methods in a class
     * @param understandExport Understand Export array
     */
    private calculateMethodsClassRank(understandExport: UnderstandExport[]) {
        const moduleExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'Class'
        );
        const faultyModules: UnderstandExport[] = [];
        // identify faulty classes that have too many methods
        moduleExports.forEach((undExport) => {
            if (undExport.countdeclmethod >= MAX_METHODS_CLASS) faultyModules.push(undExport);
        });

        console.log('Classes with too many methods');
        console.log(faultyModules);

        // Calculate methods per class rank by dividing faulty modules by evaluated modules
        this.mReport[metric.METHODS_CLASS] = ratioToRank(
            faultyModules.length / moduleExports.length
        );
    }

    /**
     * Calculates the metric rank for the metric that measures
     * the amount of functions in a module
     * @param understandExport Understand Export array
     */
    private calculateFunctionsModuleRank(understandExport: UnderstandExport[]) {
        const moduleExports: UnderstandExport[] = understandExport.filter(
            (metric) => metric.kind == 'File'
        );
        const faultyModules: UnderstandExport[] = [];
        // identify faulty files that have too many functions
        moduleExports.forEach((undExport) => {
            if (undExport.countdeclfunction >= MAX_FUNCTIONS_MODULE) faultyModules.push(undExport);
        });

        console.log('Modules with too many functions');
        console.log(faultyModules);

        // Calculate functions per file rank by dividing faulty modules by evaluated modules
        this.mReport[metric.FUNCTIONS_MODULE] = ratioToRank(
            faultyModules.length / moduleExports.length
        );
    }

    private calculateFanout(fDependencies: UnderstandDependencies[]) {
        const fanout: Record<string, number> = {};
        fDependencies.forEach((dep) => {
            if (fanout[dep.from_file] === undefined) fanout[dep.from_file] = 0;
            fanout[dep.from_file] += parseInt(dep.references);
        });

        const faultyFiles: string[] = [];
        const evaluatedFiles = Object.keys(fanout);
        evaluatedFiles.forEach((key) => {
            if (fanout[key] >= MAX_FANOUT) {
                console.log(
                    `File: ${key} uses to many items of other files, namely ${fanout[key]}`
                );
                faultyFiles.push(key);
            }
        });
        // Calculate fanout rank by dividing faulty files by evaluated files
        this.mReport[metric.FANOUT] = ratioToRank(faultyFiles.length / evaluatedFiles.length);
    }

    private calculateCyclicDependencies(fileDependenciesMatrix: UnderstandDependenciesMatrix[]) {
        console.log('Dependency matrix to be implemented (how tho)');
        console.log(fileDependenciesMatrix[0]);
    }
}

new QualityCheck().analyseUnderstandExports();
