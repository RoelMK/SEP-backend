import { getFileDirectory, getFileExtension, getFileName } from '../../../src/services/utils/files';

/**
 * UTP: FILE - 1
 */
test('Get extension from a file path', () => {
    const filePath = 'random/path/to/file.csv';
    const filePath2 = 'file.xlsx';
    expect(getFileExtension(filePath)).toBe('csv');
    expect(getFileExtension(filePath2)).toBe('xlsx');
});

/**
 * UTP: FILE - 2
 */
test('Get extension from a file path, robustness', () => {
    const filePath = 'random/path/to/randomnothin';
    const filePath2 = 'file';
    const filePath3 = 'file.random/otherfile';
    expect(getFileExtension(filePath)).toBe('');
    expect(getFileExtension(filePath2)).toBe('');
    expect(getFileExtension(filePath3)).toBe('');
});

/**
 * UTP: FILE - 3
 */
test('Getting extension from file path with other slashes', () => {
    const filePath = 'random\\path\\to\\file.csv';
    const filePath2 = 'file.xlsx';
    expect(getFileExtension(filePath, false)).toBe('csv');
    expect(getFileExtension(filePath2, false)).toBe('xlsx');
});

/**
 * UTP: FILE - 4
 */
test('Getting directory from file path', () => {
    const filePath = 'random/path/to/file.csv';
    const filePath2 = 'random\\path\\to\\file.csv';
    const filePath3 = 'file.xlsx';

    expect(getFileDirectory(filePath)).toBe('random/path/to');
    expect(getFileDirectory(filePath2, false)).toBe('random\\path\\to');
    expect(getFileDirectory(filePath3)).toBe('');
});

/**
 * UTP: FILE - 5
 */
test('Getting file name from file path', () => {
    const filePath = 'random/path/to/file.csv';
    const filePath2 = 'random\\path\\to\\file.csv';
    const filePath3 = 'file.xlsx';

    expect(getFileName(filePath)).toBe('file.csv');
    expect(getFileName(filePath2, false)).toBe('file.csv');
    expect(getFileName(filePath3)).toBe('file.xlsx');
});
