/* Module size */
// the maximum lines of code a module can have
// Software Lines of Code, that is, effective lines excluding blank lines and comments.
export const MAX_SLOC = 400;

/* Class complexity */
// Max average complexity per class
export const MAX_AVG_COMPLEXITY = 10;
// Maximum method complexity within class
export const MAX_METHOD_COMPLEXITY = 20;

/* Class design - Only OO*/
// Maximum number of methods in the class
export const MAX_METHODS_CLASS = 20;

/* Module design - Only non OO */
// Maximum number of functions per module/file.
export const MAX_FUNCTIONS_MODULE = 20;

/* Module internal duplication */
// Percentage of duplicated clones (in SLOC) inside a module\
// Nothing stated

/* Code commenting */
// Percentage of lines of comments (% LOCM).
// Threshold: LOCM (lines of comments in module (?)) / SLOC (software line of code) > 0.15
export const MIN_COMMENT_RATIO = 0.15;

/* Cyclic dependencies */
// Max number of cyclic dependencies
export const MAX_CYCLIC_DEPENDENCIES = 0;

/* Class coupling */
//cannot be measured in Understand for TS/JS in the basic Export metrics menu

/* Fan-out */
// Module Fan-out is number of functions of other modules this module calls
export const MAX_FANOUT = 16;

/* Module external duplication */
// Percentage of duplicated of duplicated lines of code/SLOC between different modules
