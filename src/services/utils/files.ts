/**
 * Retrieves file extensions from file paths
 * @param filePath path that leads to a file with a certain extension
 * @returns the extension of the file
 */
 const getFileExtension = (filePath: string): string => {
    const index = filePath.lastIndexOf('.')+1;
    // if no point can be found, return '', else return the extension
    return index == -1 ? '' : filePath.substring(index);
};

/**
 * Retrieves lowest folder path from file paths
 * @param filePath path that leads to a folder of the specified file
 * @returns the folder of the input file (path)
 */
 const getFileDirectory = (filePath: string, forwardSlash?: boolean): string => {
    if(forwardSlash === undefined) forwardSlash = true;
    const indicator = forwardSlash ? "/" : "\\";
    const index = filePath.lastIndexOf(indicator);
    // if no indicator can be found, return '', else return directory path
    return index == -1 ? '' : filePath.substring(0, index);
};

export { getFileExtension, getFileDirectory };