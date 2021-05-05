import AbbottParser from '../../src/services/abbottParser';
import { runFoodTests } from './testFood';
import { runGlucoseTests } from './testGlucose';
import { runInsulinTests } from './testInsulin';

const abbottEUParser: AbbottParser = new AbbottParser('test/services/data/abbott_eu.csv');
const abbottUSParser: AbbottParser = new AbbottParser('test/services/data/abbott_us.csv');

export async function runServicesTests(): Promise<void> {
    await abbottEUParser.process();
    await abbottUSParser.process();
    // Food pass
    runFoodTests(abbottEUParser, abbottUSParser);
    // Glucose does not pass on EU
    runGlucoseTests(abbottEUParser, abbottUSParser);
    // Insulin pass
    runInsulinTests(abbottEUParser, abbottUSParser);
}

// TODO: should probably use a testing framework/library
runServicesTests();
