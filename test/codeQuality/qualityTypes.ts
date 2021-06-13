// object that contains all quality ranks of the ISO 25010 maintainability attributes
export interface QualityReport {
    [qAttributes.MODULARITY]: number;
    [qAttributes.REUSABILITY]: number;
    [qAttributes.ANALYZABILITY]: number;
    [qAttributes.MODIFIABILITY]: number;
    [qAttributes.TESTABILITY]: number;
}
export interface MetricReport {
    [metric.SLOC]: number;
    [metric.AVG_COMPLEXITY]: number;
    [metric.METHOD_COMPLEXITY]: number;
    [metric.METHODS_CLASS]: number;
    [metric.FUNCTIONS_MODULE]: number;
    [metric.COMMENT_RATIO]: number;
    [metric.CYCLIC_DEPENDENCIES]: number;
    [metric.CLASS_COUPLING]: number;
    [metric.FANOUT]: number;
}

// ISO 25010 maintainability attributes
export enum qAttributes {
    MODULARITY,
    REUSABILITY,
    ANALYZABILITY,
    MODIFIABILITY,
    TESTABILITY
}

export enum metric {
    SLOC,
    AVG_COMPLEXITY,
    METHOD_COMPLEXITY,
    METHODS_CLASS, //OO
    FUNCTIONS_MODULE, //non-OO
    //internal duplication is left out for now
    COMMENT_RATIO,
    CYCLIC_DEPENDENCIES,
    CLASS_COUPLING,
    FANOUT
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
    [metric.CLASS_COUPLING]: [qAttributes.MODULARITY, qAttributes.REUSABILITY],
    [metric.FANOUT]: [qAttributes.MODULARITY, qAttributes.REUSABILITY]
};

export const initQReport: QualityReport = {
    [qAttributes.MODULARITY]: 0,
    [qAttributes.REUSABILITY]: 0,
    [qAttributes.ANALYZABILITY]: 0,
    [qAttributes.MODIFIABILITY]: 0,
    [qAttributes.TESTABILITY]: 0
};

export const initMReport: MetricReport = {
    [metric.SLOC]: 0,
    [metric.AVG_COMPLEXITY]: 0,
    [metric.METHOD_COMPLEXITY]: 0,
    [metric.METHODS_CLASS]: 0,
    [metric.FUNCTIONS_MODULE]: 0,
    [metric.COMMENT_RATIO]: 0,
    [metric.CYCLIC_DEPENDENCIES]: 0,
    [metric.CLASS_COUPLING]: 0,
    [metric.FANOUT]: 0
};
