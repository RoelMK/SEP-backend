import { getFileDirectory, getFileExtension } from "../../../src/services/utils/files";

test('Get extension from a file path', () => {
    const filePath = 'random/path/to/file.csv';
    const filePath2 = 'file.xlsx';
    expect(getFileExtension(filePath)).toBe('csv');
    expect(getFileExtension(filePath2)).toBe('xlsx');
});

test('Getting directory from file path', () => {
    const filePath = 'random/path/to/file.csv';
    const filePath2 = 'random\\path\\to\\file.csv';
    const filePath3 = 'file.xlsx';

    expect(getFileDirectory(filePath)).toBe('random/path/to');
    expect(getFileDirectory(filePath2, false)).toBe('random\\path\\to');
    expect(getFileDirectory(filePath3)).toBe('');

});