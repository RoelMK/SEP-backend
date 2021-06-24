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

/**
 * All exercise types as GameBus GameDescriptors
 */
export enum ExerciseGameDescriptorNames {
    WALK = 'WALK', // Steps, distance, duration, kcal
    RUN = 'RUN', // Steps, distance, duration, kcal
    BIKE = 'BIKE', // Distance, duration, kcal
    SOCCER = 'SOCCER', // Duration, group size
    BASKETBALL = 'BASKETBALL', // Duration, kcal
    VOLLEYBALL = 'VOLLEYBALL', // Duration, kcal
    RUGBY = 'RUGBY', // Duration, kcal
    BASEBALL = 'BASEBALL', // Duration, kcal
    HORSE_RIDING = 'HORSE_RIDING', // Duration, kcal
    ATHLETICS = 'ATHLETICS', // Duration, kcal
    SWIMMING = 'SWIMMING', // Distance, duration, kcal
    WATER_POLO = 'WATER_POLO', // Duration, kcal
    SURFING = 'SURFING', // Duration, kcal
    GOLF = 'GOLF', // Duration, kcal
    LACROSSE = 'LACROSSE', // Duration, kcal
    TENNIS = 'TENNIS', // Duration, group size, kcal
    SQUASH = 'SQUASH', // Duration, kcal
    BADMINTON = 'BADMINTON', // Duration, kcal
    TABLE_TENNIS = 'TABLE_TENNIS', // Duration, kcal
    SKIING = 'SKIING', // Distance, duration, kcal
    ICE_HOCKEY = 'ICE_HOCKEY', // Duration, kcal
    FIELD_HOCKEY = 'FIELD_HOCKEY', // Duration, kcal
    ICE_SKATING = 'ICE_SKATING', // Distance, duration, kcal
    ROLLER_SKATING = 'ROLLER_SKATING', // Distance, duration, kcal
    FITNESS = 'FITNESS', // Duration, group size, kcal
    YOGA = 'YOGA', // Duration, group size, kcal
    AEROBICS = 'AEROBICS', // Duration, kcal
    MARTIAL_ARTS = 'MARTIAL_ARTS', // Duration, kcal
    DANCE = 'DANCE', // Duration, group size, kcal
    POOL = 'POOL', // Duration, group size
    DARTS = 'DARTS', // Duration, group size
    AIR_HOCKEY = 'AIR_HOCKEY', // Duration, penalty, score
    BOWLING = 'BOWLING', // Duration, score
    CHESS = 'CHESS', // Duration
    GYMNASTICS = 'GYMNASTICS', // Duration, kcal, reason?
    HIKE = 'HIKE', // Nothing
    MOUNTAINBIKE = 'MOUNTAINBIKE', // Nothing,
    WALK_DETAIL = 'WALK(DETAIL)', // Steps, distance, duration, speed (max, avg), kcal,
    RUN_DETAIL = 'RUN(DETAIL)', // heart rate (max, avg, min), accelerometer, ppg (both of these)
    BIKE_DETAIL = 'BIKE(DETAIL)' // Nothing
}
/**
 *
 *   --------------------------------------------- Mood ---------------------------------------------
 *
 */

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

/**
 *
 *   --------------------------------------------- BMI ---------------------------------------------
 *
 */

/**
 * Information about a user's age, weight and length + other BMI metrics
 */
export enum BMIPropertyKeys {
    weight = 'WEIGHT', // kg
    length = 'LENGTH', // cm
    age = 'AGE', // years
    gender = 'GENDER',
    waistCircumference = 'WAIST_CIRCUMFERENCE',
    bmi = 'BODY_MASS_INDEX'
}

/**
 *
 *   --------------------------------------------- Glucose ---------------------------------------------
 *
 */

/**
 * Relevant properties to map properties of activities to the glucoseModel
 * [key in glucoseModel] = [translationKey in GameBus]
 */
export enum GlucosePropertyKeys {
    glucoseLevel = 'eAG_MMOLL', // in mmol/L
    glucoseLevelMgdl = 'eAG_MGDL' // in mg/dL (we won't use this one)
}

export const GlucoseIDs = Object.freeze({
    glucoseLevel: 88
});

/**
 *
 *   --------------------------------------------- Insulin ---------------------------------------------
 *
 */
/**
 * Data provider names for known insulin data sources
 */
export enum InsulinDataProviderNames {
    GameBuS = 'GameBus',
    Daily_run = 'Daily_run'
}

/**
 * Relevant properties to map properties of insulin to the insulinModel
 */
export enum InsulinPropertyKeys {
    insulinAmount = 'INSULIN_DOSE',
    insulinType = 'INSULIN_SPEED'
}

export const InsulinIDs = Object.freeze({
    //INSULIN_TYPE : 1143,
    insulinAmount: 1144,
    insulinType: 1185
});

/**
 *
 *   --------------------------------------------- Food ---------------------------------------------
 *
 */

export enum FoodPropertyKeys {
    carbohydrates = 'FOOD_CARBOHYDRATES_GRAMS',
    calories = 'KCAL_CARB',
    meal_type = 'FOOD_MEAL_TYPE',
    glycemic_index = 'FOOD_GLYCEMIC_INDEX',
    fat = 'FOOD_FAT_GRAMS',
    saturatedFat = 'FOOD_SATURATED_FAT_GRAMS',
    proteins = 'FOOD_PROTEINS_GRAMS',
    fibers = 'FIBERS_WEIGHT',
    salt = 'FOOD_SALT_GRAMS',
    water = 'FOOD_WATER_GRAMS',
    sugars = 'FOOD_SUGAR_GRAMS',
    description = 'DESCRIPTION'
}

export const FoodIDs = Object.freeze({
    description: 12,
    calories: 77,
    fibers: 79,
    carbohydrates: 1176,
    meal_type: 1177,
    glycemic_index: 1178,
    fat: 1179,
    saturatedFat: 1180,
    proteins: 1181,
    salt: 1182,
    water: 1183,
    sugars: 1184
});

/**
 *
 *   --------------------------------------------- Keys ---------------------------------------------
 *
 */

// To prevent cyclic dependencies, these translation keys and IDs are put here
export abstract class Keys {
    static readonly dataProviderId = 18;

    static readonly foodTranslationKey = 'Nutrition_Diary';
    static readonly foodGameDescriptorID = 58;

    static readonly insulinTranslationKey = 'LOG_INSULIN';
    static readonly insulinGameDescriptorID = 1075;

    static readonly glucoseTranslationKey = 'BLOOD_GLUCOSE_MSMT';
    static readonly glucoseGameDescriptorID = 61;

    static readonly moodTranslationKey = 'LOG_MOOD';
    static readonly moodGameDescriptorID = 1062;

    static readonly bmiTranslationKey = 'BODY_MASS_INDEX';
    static readonly bmiGameDescriptorID = 1078;

    // For posting activities
    static readonly gbDataProviderTK = 'GameBus';
    static readonly gbDataProviderId = 1;
}
