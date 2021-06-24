//   --------------------------------------------- Exercise ---------------------------------------------
/**
 * Relevant properties to map properties of activities to the exerciseModel
 * [key in exerciseModel] = [translationKey in GameBus]
 */
export enum ExercisePropertyKeys {
    duration = 'DURATION', // in seconds as string
    steps = 'STEPS', // in amount as string
    distance = 'DISTANCE', // in meters as string
    calories = 'KCALORIES', // in kcal as string
    groupSize = 'GROUP_SIZE', // in amount as string
    penalty = 'PENALTY', // in amount [0 - 100] as string
    score = 'SCORE', // in amount [-inf, inf] as string
    maxSpeed = 'SPEED.MAX', // maximum speed reached in m/s
    avgSpeed = 'SPEED.AVG', // average speed reached in m/s
    maxHeartrate = 'MAX_HEART_RATE', // maximum heart rate reached (in bpm)
    avgHeartrate = 'AVG_HEART_RATE', // average heart rate reached (in bpm)
    minHeartrate = 'MIN_HEART_RATE', // minimum heart rate reached (in bpm)
    heartrate = '' // heart rate (in bpm), add if required
}
//   --------------------------------------------- Mood ---------------------------------------------

/**
 * Relevant properties to map properties of activities to the mood model
 */
export enum MoodPropertyKeys {
    arousal = 'MOOD_AROUSAL', // number in range [1,3]
    valence = 'MOOD_VALENCE' // number in range [1,3]
}

export const MoodIDs = Object.freeze({
    arousal: 1186,
    valence: 1187
});

/**
 * Data provider names for known mood data sources
 */
export enum MoodDataProviderNames {
    DAILY_RUN = 'Daily_run'
}

/**
 * Data property names for known mood data properties
 */
export enum MoodGameDescriptorNames {
    logMood = 'LOG_MOOD' // Mood descriptor
}
