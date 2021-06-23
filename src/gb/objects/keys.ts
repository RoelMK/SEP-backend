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
