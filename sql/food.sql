-- injected as first script:

select pp.data_provider as DP, gd.id as GD_ID, gd.translation_key, p.id AS P_ID, p.translation_key from game_descriptor gd, property p, property_permission pp 
where gd.translation_key like '%Nutrition_Diary%' and pp.property=p.id and pp.game_descriptor=gd.id and pp.data_provider=18

==>

data_provider  id  translation_key    id  translation_key         
-------------  --  ---------------  ----  ------------------------
           18  58  Nutrition_Diary  1176  FOOD_CARBOHYDRATES_GRAMS
           18  58  Nutrition_Diary    77  KCAL_CARB               
           18  58  Nutrition_Diary  1177  FOOD_MEAL_TYPE          
           18  58  Nutrition_Diary  1178  FOOD_GLYCEMIC_INDEX     
           18  58  Nutrition_Diary  1179  FOOD_FAT_GRAMS          
           18  58  Nutrition_Diary  1180  FOOD_SATURATED_FAT_GRAMS
           18  58  Nutrition_Diary  1181  FOOD_PROTEINS_GRAMS     
           18  58  Nutrition_Diary    79  FIBERS_WEIGHT           
           18  58  Nutrition_Diary  1182  FOOD_SALT_GRAMS         
           18  58  Nutrition_Diary  1183  FOOD_WATER_GRAMS        
           18  58  Nutrition_Diary  1184  FOOD_SUGAR_GRAMS        
           18  58  Nutrition_Diary    12  DESCRIPTION      


-- Version 4 (02/06/2021, PVG)

-- select max(id) as maxPropID, count(*) as numProps from property
--   BEFORE: 1175, 223
--   AFTER: 1184, 232
-- select max(id) as maxGdID, count(*) as numGDs from game_descriptor 
--   BEFORE: 1077, 96
--   AFTER: 1077, 96
-- select max(id) as maxPpID, count(*) as numPPs from property_permission 
--   BEFORE: 1341, 526
--   AFTER: 1364, 547

-- CHANGELOG

-- SET
--   @FOOD_DESCRIPTION = (
--     SELECT
--       id
--     FROM
--       game_descriptor => property!
--     WHERE
--       translation_key = 'DESCRIPTION'
--   );

-- Version 3 (02/06/2021)
-- Diabetter food model (from TypeScript):
-- timestamp: number; (in milliseconds)                                             - As 'date' in activity
-- carbohydrates: number; (in grams)                                                - Translation key "FOOD_CARBOHYDRATES_GRAMS" in "Nutrition_Diary" (new)
-- calories?: number; (in kcal)                                                     - Translation key "KCAL_CARB" in "Nutrition_Diary"
-- meal_type?: MEAL_TYPE; (limited to 'Breakfast', 'Lunch', 'Dinner', 'Snack')      - Translation key "FOOD_MEAL_TYPE" in "Nutrition_Diary" (new)
-- glycemic_index?: number; (between 1 and 100)                                     - Translation key "FOOD_GLYCEMIC_INDEX" in "Nutrition_Diary" (new)
-- fat?: number; (in grams)                                                         - Translation key: "FOOD_FAT_GRAMS" in "Nutrition_Diary" (new)
-- saturatedFat?: number; (in grams)                                                - Translation key: "FOOD_SATURATED_FAT_GRAMS" in "Nutrition_Diary" (new)
-- proteins?: number; (in grams)                                                    - Translation key: "FOOD_PROTEINS_GRAMS" in "Nutrition_Diary" (new)
-- fibers?: number; (in grams)                                                      - Translation key: "FIBERS_WEIGHT" in "Nutrition_Diary"
-- salt?: number; (in grams)                                                        - Translation key: "FOOD_SALT_GRAMS" in "Nutrition_Diary" (new)
-- water?: number; (in grams)                                                       - Translation key: "FOOD_WATER_GRAMS" in "Nutrition_Diary" (new)
-- sugars?: number; (in grams)                                                      - Translation key: "FOOD_SUGAR_GRAMS" in "Nutrition_Diary" (new)
-- description?: string;                                                            - Translation key: "DESCRIPTION" in "Nutrition_Diary"
--
-- Changes since first version (26/05):
-- Exchanged translation keys if they already existed in "Nutrition_Diary" (see above for "(new)" tag)
-- Added new properties to "Nutrition_Diary" instead of own game descriptor
-- Removed own data provider since GameBus already has "Nutrition_Diary"
--
-- Changes since second version (01/06):
-- Injected property permissions for nutrition diary properties into our own data provider
-- TODO: change food type input to dropdown (see email)
--
SET
  @string_id = (
    SELECT
      id
    FROM
      property_type
    WHERE
      type = 'STRING'
  );
SET
  @int_id = (
    SELECT
      id
    FROM
      property_type
    WHERE
      type = 'INT'
  );
SET
  @double_id = (
    SELECT
      id
    FROM
      property_type
    WHERE
      type = 'DOUBLE'
  );
-- Since we'll be adding the properties to the GameBus Nutrition_Diary game descriptor, we only need the GameBus provider ID
SET
  @gamebus_provider_id = (
    SELECT
      id
    FROM
      data_provider
    WHERE
      name = 'GameBus'
  );
SET
  @data_provider_id = (
    SELECT
      id
    FROM
      data_provider
    WHERE
      name = 'Daily_run'
  );
-- Carbohydrates in grams
  -- This one does not exist yet from the Google Spreadsheet, so we create it
INSERT INTO
  `gamebus_api`.`property` (
    `aggregation_strategy`,
    `base_unit`,
    `input_type`,
    `translation_key`,
    `property_type_id`
  )
SELECT
  'AVERAGE',
  'grams',
  -- Unlimited range but in grams
  'DOUBLE',
  'FOOD_CARBOHYDRATES_GRAMS',
  @double_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'FOOD_CARBOHYDRATES_GRAMS'
    LIMIT
      1
  );
-- Calories in kcal (optional)
  -- This one exists in "Nutrition_Diary" so we use that one
SET
  @FOOD_CALORIES = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'KCAL_CARB'
  );
-- Meal type in select options (optional)
  -- This one does not exist and is not the same as "Description", so we create it
INSERT INTO
  `gamebus_api`.`property` (
    `aggregation_strategy`,
    `base_unit`,
    `input_type`,
    `translation_key`,
    `property_type_id`
  )
SELECT
  'AVERAGE',
  '[Breakfast,Lunch,Dinner,Snack]',
  -- TODO: a few more might be added
  'STRING',
  'FOOD_MEAL_TYPE',
  @string_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'FOOD_MEAL_TYPE'
    LIMIT
      1
  );
-- Glycemic index in number (optional)
  -- This one does not exist yet, so we create it
INSERT INTO
  `gamebus_api`.`property` (
    `aggregation_strategy`,
    `base_unit`,
    `input_type`,
    `translation_key`,
    `property_type_id`
  )
SELECT
  'AVERAGE',
  '[1,100]',
  -- there's no real unit, it's just a value
  'INT',
  'FOOD_GLYCEMIC_INDEX',
  @int_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'FOOD_GLYCEMIC_INDEX'
    LIMIT
      1
  );
-- Fat in grams (optional)
  -- This one only exists as a percentage, but we need have the fats in grams
INSERT INTO
  `gamebus_api`.`property` (
    `aggregation_strategy`,
    `base_unit`,
    `input_type`,
    `translation_key`,
    `property_type_id`
  )
SELECT
  'AVERAGE',
  'grams',
  'DOUBLE',
  'FOOD_FAT_GRAMS',
  @double_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'FOOD_FAT_GRAMS'
    LIMIT
      1
  );
-- Saturated fat in grams (optional)
  -- This one does not exist yet, so we create it
INSERT INTO
  `gamebus_api`.`property` (
    `aggregation_strategy`,
    `base_unit`,
    `input_type`,
    `translation_key`,
    `property_type_id`
  )
SELECT
  'AVERAGE',
  'grams',
  'DOUBLE',
  'FOOD_SATURATED_FAT_GRAMS',
  @double_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'FOOD_SATURATED_FAT_GRAMS'
    LIMIT
      1
  );
-- Proteins in grams (optional)
  -- This one only exists as a percentage or kcal amount, but we have grams
INSERT INTO
  `gamebus_api`.`property` (
    `aggregation_strategy`,
    `base_unit`,
    `input_type`,
    `translation_key`,
    `property_type_id`
  )
SELECT
  'AVERAGE',
  'grams',
  'DOUBLE',
  'FOOD_PROTEINS_GRAMS',
  @double_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'FOOD_PROTEINS_GRAMS'
    LIMIT
      1
  );
-- Fibers in grams (optional)
  -- This one already exists in "Nutrition_Diary", so we use that one instead
  -- Salt in grams (optional)
  -- This one does not exist yet
INSERT INTO
  `gamebus_api`.`property` (
    `aggregation_strategy`,
    `base_unit`,
    `input_type`,
    `translation_key`,
    `property_type_id`
  )
SELECT
  'AVERAGE',
  'grams',
  'DOUBLE',
  'FOOD_SALT_GRAMS',
  @double_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'FOOD_SALT_GRAMS'
    LIMIT
      1
  );
-- Water in grams (optional)
  -- This one does not exist yet
INSERT INTO
  `gamebus_api`.`property` (
    `aggregation_strategy`,
    `base_unit`,
    `input_type`,
    `translation_key`,
    `property_type_id`
  )
SELECT
  'AVERAGE',
  'grams',
  'DOUBLE',
  'FOOD_WATER_GRAMS',
  @double_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'FOOD_WATER_GRAMS'
    LIMIT
      1
  );
-- Sugars in grams (optional)
  -- This one does not exist yet
INSERT INTO
  `gamebus_api`.`property` (
    `aggregation_strategy`,
    `base_unit`,
    `input_type`,
    `translation_key`,
    `property_type_id`
  )
SELECT
  'AVERAGE',
  'grams',
  'DOUBLE',
  'FOOD_SUGAR_GRAMS',
  @double_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'FOOD_SUGAR_GRAMS'
    LIMIT
      1
  );
-- Description (optional)
  -- This one already exists in "Nutrition Diary", so we use that one
SET
  @FOOD_CARBOHYDRATES_GRAMS = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'FOOD_CARBOHYDRATES_GRAMS'
  );
SET
  @FOOD_TYPE = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'FOOD_MEAL_TYPE'
  );
SET
  @FOOD_GLYCEMICINDEX = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'FOOD_GLYCEMIC_INDEX'
  );
SET
  @FOOD_FAT = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'FOOD_FAT_GRAMS'
  );
SET
  @FOOD_SATURATEDFAT = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'FOOD_SATURATED_FAT_GRAMS'
  );
SET
  @FOOD_PROTEINS = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'FOOD_PROTEINS_GRAMS'
  );
SET
  @FOOD_FIBERS = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'FIBERS_WEIGHT'
  );
SET
  @FOOD_SALT = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'FOOD_SALT_GRAMS'
  );
SET
  @FOOD_WATER = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'FOOD_WATER_GRAMS'
  );
SET
  @FOOD_SUGAR = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'FOOD_SUGAR_GRAMS'
  );
SET
  @FOOD_DESCRIPTION = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'DESCRIPTION'
  );
-- We'll be adding the missing food properties to the "Nutrition_Diary" game descriptor as proposed
SET
  @NUTRITION_DIARY = (
    SELECT
      id
    FROM
      game_descriptor
    WHERE
      translation_key = 'Nutrition_Diary'
  );
-- Adding carbohydrates (in grams), currently only exists in "kcal" and "percentage"
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @gamebus_provider_id,
  @NUTRITION_DIARY,
  @FOOD_CARBOHYDRATES_GRAMS,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_CARBOHYDRATES_GRAMS
    LIMIT
      1
  );
-- Calories aren't added since they are already present in Nutrition_Diary
  -- Adding meal type, currently only "description" is present but we have a set selection of meal types (i.e. breakfast, lunch, dinner)
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @gamebus_provider_id,
  @NUTRITION_DIARY,
  @FOOD_TYPE,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_TYPE
    LIMIT
      1
  );
-- Adding glycemic index (currently not in Nutrition_Diary)
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @gamebus_provider_id,
  @NUTRITION_DIARY,
  @FOOD_GLYCEMIC_INDEX,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_GLYCEMIC_INDEX
    LIMIT
      1
  );
-- Adding fat
  -- Currently only exists as percentage or kcal, but we need grams
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @gamebus_provider_id,
  @NUTRITION_DIARY,
  @FOOD_FAT,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_FAT
    LIMIT
      1
  );
-- Adding saturated fat
  -- Currently does not exist at all
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @gamebus_provider_id,
  @NUTRITION_DIARY,
  @FOOD_SATURATEDFAT,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_SATURATEDFAT
    LIMIT
      1
  );
-- Adding proteins
  -- Currently only exists as percentage or kcal, but we need grams
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @gamebus_provider_id,
  @NUTRITION_DIARY,
  @FOOD_PROTEINS,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_PROTEINS
    LIMIT
      1
  );
-- Fibers are already present in Nutrition_Diary, so we skip that one
  -- Adding salt
  -- Currently not present, so we add it
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @gamebus_provider_id,
  @NUTRITION_DIARY,
  @FOOD_SALT,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_SALT
    LIMIT
      1
  );
-- Adding water
  -- Currently not present so we add it
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @gamebus_provider_id,
  @NUTRITION_DIARY,
  @FOOD_WATER,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_WATER
    LIMIT
      1
  );
-- Adding sugar
  -- Currently not present so we add it
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @gamebus_provider_id,
  @NUTRITION_DIARY,
  @FOOD_SUGAR,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_SUGAR
    LIMIT
      1
  );
-- Description already exists so we don't add it
  --
  -- We still have to insert the Nutrition_Diary descriptor into our own data provider
  -- TODO: for all properties
  -- Inserting carbohydrates into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_CARBOHYDRATES_GRAMS,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_CARBOHYDRATES_GRAMS
    LIMIT
      1
  );
-- Inserting calories into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_CALORIES,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_CALORIES
    LIMIT
      1
  );
-- Inserting meal type into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_TYPE,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_TYPE
    LIMIT
      1
  );
-- Inserting glycemic index into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_GLYCEMICINDEX,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_GLYCEMICINDEX
    LIMIT
      1
  );
-- Inserting fat into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_FAT,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_FAT
    LIMIT
      1
  );
-- Inserting saturated fat into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_SATURATEDFAT,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_SATURATEDFAT
    LIMIT
      1
  );
-- Inserting proteins into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_PROTEINS,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_PROTEINS
    LIMIT
      1
  );
-- Inserting fibers into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_FIBERS,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_FIBERS
    LIMIT
      1
  );
-- Inserting salt into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_SALT,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_SALT
    LIMIT
      1
  );
-- Inserting water into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_WATER,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_WATER
    LIMIT
      1
  );
-- Inserting sugars into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_SUGAR,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_SUGAR
    LIMIT
      1
  );
-- Inserting description into our provider
INSERT INTO
  `gamebus_api`.`property_permission` (
    `permission_type`,
    `property_index`,
    `data_provider`,
    `game_descriptor`,
    `property`,
    `state`
  )
SELECT
  'WRITE',
  '0',
  @data_provider_id,
  @NUTRITION_DIARY,
  @FOOD_DESCRIPTION,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @NUTRITION_DIARY
      AND property = @FOOD_DESCRIPTION
    LIMIT
      1
  );