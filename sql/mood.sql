Executed as fourth script

select pp.data_provider as DP, gd.id as GD_ID, gd.translation_key, p.id AS P_ID, p.translation_key from game_descriptor gd, property p, property_permission pp 
where gd.translation_key like '%LOG_MOOD%' and pp.property=p.id and pp.game_descriptor=gd.id order by DP
=> Before script:
data_provider    id  translation_key    id  translation_key                      
-------------  ----  ---------------  ----  -------------------------------------
            1  1062  LOG_MOOD         1081  PANAS_AFFECTIVE_EMOTIONAL_STATE_KEY  
            1  1062  LOG_MOOD         1082  PANAS_AFFECTIVE_EMOTIONAL_STATE_VALUE
           11  1062  LOG_MOOD         1081  PANAS_AFFECTIVE_EMOTIONAL_STATE_KEY  
           11  1062  LOG_MOOD         1082  PANAS_AFFECTIVE_EMOTIONAL_STATE_VALUE
           11  1062  LOG_MOOD         1136  EVENT_TIMESTAMP                      
           11  1062  LOG_MOOD         1140  VALENCE_STATE_VALUE                  
           11  1062  LOG_MOOD         1141  AROUSAL_STATE_VALUE                  
           11  1062  LOG_MOOD         1142  PSYCH_COLOR_VALUE                    

=> After script: 
data_provider    id  translation_key    id  translation_key                      
-------------  ----  ---------------  ----  -------------------------------------
            1  1062  LOG_MOOD         1081  PANAS_AFFECTIVE_EMOTIONAL_STATE_KEY  
            1  1062  LOG_MOOD         1082  PANAS_AFFECTIVE_EMOTIONAL_STATE_VALUE
            1  1062  LOG_MOOD         1186  MOOD_AROUSAL                         
            1  1062  LOG_MOOD         1187  MOOD_VALENCE                         
           11  1062  LOG_MOOD         1081  PANAS_AFFECTIVE_EMOTIONAL_STATE_KEY  
           11  1062  LOG_MOOD         1082  PANAS_AFFECTIVE_EMOTIONAL_STATE_VALUE
           11  1062  LOG_MOOD         1136  EVENT_TIMESTAMP                      
           11  1062  LOG_MOOD         1140  VALENCE_STATE_VALUE                  
           11  1062  LOG_MOOD         1141  AROUSAL_STATE_VALUE                  
           11  1062  LOG_MOOD         1142  PSYCH_COLOR_VALUE                    
           18  1062  LOG_MOOD         1186  MOOD_AROUSAL                         
           18  1062  LOG_MOOD         1187  MOOD_VALENCE                         


-- Version 1 (02/06/2021)
-- Diabetter food model (from TypeScript):
-- timestamp: number; (in milliseconds)
-- arousal: number;
-- valence: number;
--
-- Since there's already a LOG_MOOD game descriptor, we'll be extending that one
--
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
  @data_provider_id = (
    SELECT
      id
    FROM
      data_provider
    WHERE
      name = 'Daily_run'
  );
SET
  @gamebus_provider_id = (
    SELECT
      id
    FROM
      data_provider
    WHERE
      name = 'GameBus'
  );
-- Arousal (1...3)
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
  '[1,3]',
  -- Value between 1 and 3
  'INT',
  'MOOD_AROUSAL',
  @int_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'MOOD_AROUSAL'
    LIMIT
      1
  );
-- Valence (1...3)
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
  '[1,3]',
  -- Value between 1 and 3
  'INT',
  'MOOD_VALENCE',
  @int_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'MOOD_VALENCE'
    LIMIT
      1
  );
-- Getting property IDs
SET
  @MOOD_AROUSAL = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'MOOD_AROUSAL'
  );
SET
  @MOOD_VALENCE = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'MOOD_VALENCE'
  );
-- Getting existing game descriptor ID
SET
  @LOG_MOOD = (
    SELECT
      id
    FROM
      game_descriptor
    WHERE
      translation_key = 'LOG_MOOD'
  );
-- Inserting new properties into existing game descriptor for GameBus
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
  @LOG_MOOD,
  @MOOD_AROUSAL,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @LOG_MOOD
      AND property = @MOOD_AROUSAL
    LIMIT
      1
  );
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
  @LOG_MOOD,
  @MOOD_VALENCE,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @LOG_MOOD
      AND property = @MOOD_VALENCE
    LIMIT
      1
  );
-- Inserting LOG_MOOD into our own data provider
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
  @LOG_MOOD,
  @MOOD_AROUSAL,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @LOG_MOOD
      AND property = @MOOD_AROUSAL
    LIMIT
      1
  );
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
  @LOG_MOOD,
  @MOOD_VALENCE,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @LOG_MOOD
      AND property = @MOOD_VALENCE
    LIMIT
      1
  );
-- The existing properties of LOG_MOOD (PANAS_AFFECTIVE_EMOTIONAL_STATE_KEY & PANAS_AFFECTIVE_EMOTIONAL_STATE_VALUE) are not important for us so we skip those