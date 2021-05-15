/**
 * Retrieves file extensions from file paths
 * @param filePath path that leads to a file with a certain extension
 * @returns the extension of the file
 */
 const getFileExtension = (filePath: string): string => {
    return filePath.substring(filePath.lastIndexOf('.')+1);
};

export { getFileExtension };