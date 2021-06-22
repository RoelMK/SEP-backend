// object that contains all quality ranks of the ISO 25010 maintainability attributes
export interface QualityReport {
    [qAttributes.MODULARITY]: { rank; metricsInvolved };
    [qAttributes.REUSABILITY]: { rank; metricsInvolved };
    [qAttributes.ANALYZABILITY]: { rank; metricsInvolved };
    [qAttributes.MODIFIABILITY]: { rank; metricsInvolved };
    [qAttributes.TESTABILITY]: { rank; metricsInvolved };
}
export interface MetricReport {
    [metric.SLOC]: number;
    [metric.AVG_COMPLEXITY]: number;
    [metric.METHOD_COMPLEXITY]: number;
    [metric.METHODS_CLASS]: number;
    [metric.FUNCTIONS_MODULE]: number;
    [metric.COMMENT_RATIO]: number;
    [metric.CYCLIC_DEPENDENCIES]: number;
    //[metric.CLASS_COUPLING]: number; Not possible for Typescript
    [metric.FANOUT]: number;
}

// ISO 25010 maintainability attributes
export enum qAttributes {
    MODULARITY = 'MODULARITY',
    REUSABILITY = 'REUSABILITY',
    ANALYZABILITY = 'ANALYZABILITY',
    MODIFIABILITY = 'MODIFIABILITY',
    TESTABILITY = 'TESTABILITY'
}

export enum metric {
    SLOC = 'SLOC',
    AVG_COMPLEXITY = 'AVG_COMPLEXITY',
    METHOD_COMPLEXITY = 'METHOD_COMPLEXITY',
    METHODS_CLASS = 'METHODS_CLASS', //OO
    FUNCTIONS_MODULE = 'FUNCTIONS_MODULE', //non-OO
    //internal duplication is left out for now
    COMMENT_RATIO = 'COMMENT_RATIO',
    CYCLIC_DEPENDENCIES = 'CYCLIC_DEPENDENCIES',
    //CLASS_COUPLING = 'CLASS_COUPLING', Not possible for Typescript
    FANOUT = 'FANOUT'
    //external duplication is left out for now
}
// which (m)etrics are involved in determining the ranks of which attributes
export const mInvolvedIn = {
    [metric.SLOC]: [qAttributes.ANALYZABILITY, qAttributes.MODIFIABILITY, qAttributes.TESTABILITY],
    [metric.AVG_COMPLEXITY]: [qAttributes.MODIFIABILITY, qAttributes.TESTABILITY],
    [metric.METHOD_COMPLEXITY]: [qAttributes.MODIFIABILITY, qAttributes.TESTABILITY],
    [metric.METHODS_CLASS]: [
        qAttributes.MODULARITY,
        qAttributes.REUSABILITY,
        qAttributes.ANALYZABILITY,
        qAttributes.MODIFIABILITY
    ],
    [metric.FUNCTIONS_MODULE]: [
        qAttributes.ANALYZABILITY,
        qAttributes.MODIFIABILITY,
        qAttributes.TESTABILITY
    ],
    [metric.COMMENT_RATIO]: [qAttributes.ANALYZABILITY],
    [metric.CYCLIC_DEPENDENCIES]: [
        qAttributes.MODULARITY,
        qAttributes.REUSABILITY,
        qAttributes.ANALYZABILITY,
        qAttributes.MODIFIABILITY,
        qAttributes.TESTABILITY
    ],
    //[metric.CLASS_COUPLING]: [qAttributes.MODULARITY, qAttributes.REUSABILITY], Not possible for Typescript
    [metric.FANOUT]: [qAttributes.MODULARITY, qAttributes.REUSABILITY]
};

export const initQReport: QualityReport = {
    [qAttributes.MODULARITY]: { rank: 0, metricsInvolved: 0 },
    [qAttributes.REUSABILITY]: { rank: 0, metricsInvolved: 0 },
    [qAttributes.ANALYZABILITY]: { rank: 0, metricsInvolved: 0 },
    [qAttributes.MODIFIABILITY]: { rank: 0, metricsInvolved: 0 },
    [qAttributes.TESTABILITY]: { rank: 0, metricsInvolved: 0 }
};

export const initMReport: MetricReport = {
    [metric.SLOC]: 0,
    [metric.AVG_COMPLEXITY]: 0,
    [metric.METHOD_COMPLEXITY]: 0,
    [metric.METHODS_CLASS]: 0,
    [metric.FUNCTIONS_MODULE]: 0,
    [metric.COMMENT_RATIO]: 0,
    [metric.CYCLIC_DEPENDENCIES]: 0,
    //[metric.CLASS_COUPLING]: 0, Not possible for Typescript
    [metric.FANOUT]: 0
};

export interface UnderstandExport {
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

export interface UnderstandDependencies {
    from_file: string; // the file that is using another file
    to_file: string; // the other file that is used
    references: string;
    from_entities: string;
    to_entities: string;
}

export interface UnderstandDependenciesMatrix {
    Dependent_File: string;
    //keys for every other file + values for the amount of dependencies
}
