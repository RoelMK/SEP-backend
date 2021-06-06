/**
 * Retrieves file extensions from file paths
 * @param filePath path that leads to a file with a certain extension
 * @returns the extension of the file
 */
const getFileExtension = (filePath: string, forwardSlash?: boolean): string => {
    if (forwardSlash === undefined) forwardSlash = true;
    const indicator = forwardSlash ? '/' : '\\';
    const indexIndicator = filePath.lastIndexOf(indicator);
    const index = filePath.lastIndexOf('.');
    if (indexIndicator > index) return '';
    // if no point can be found, return '', else return the extension
    return index == -1 ? '' : filePath.substring(index + 1);
};

/**
 * Retrieves lowest folder path from file paths
 * @param filePath path that leads to a specific file
 * @returns the folder of the input file (path)
 */
const getFileDirectory = (filePath: string, forwardSlash?: boolean): string => {
    if (forwardSlash === undefined) forwardSlash = true;
    const indicator = forwardSlash ? '/' : '\\';
    const index = filePath.lastIndexOf(indicator);
    // if no indicator can be found, return '', else return directory path
    return index == -1 ? '' : filePath.substring(0, index);
};

/**
 * Retrieves file name from a filePath
 * @param filePath path that leads to a specific file
 * @returns the file name of that path
 */
const getFileName = (filePath: string, forwardSlash?: boolean): string => {
    if (forwardSlash === undefined) forwardSlash = true;
    const indicator = forwardSlash ? '/' : '\\';
    const index = filePath.lastIndexOf(indicator);
    // if no indicator can be found there is no folder path, return the whole path name
    // else return file name without path
    return index == -1 ? filePath : filePath.substring(index + 1);
};

export { getFileExtension, getFileDirectory, getFileName };
