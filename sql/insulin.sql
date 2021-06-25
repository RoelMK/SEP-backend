Executed as third script

select pp.data_provider as DP, gd.id as GD_ID, gd.translation_key, p.id AS P_ID, p.translation_key from game_descriptor gd, property p, property_permission pp 
where gd.translation_key like '%LOG_INSULIN%' and pp.property=p.id and pp.game_descriptor=gd.id order by DP
=> At start:
data_provider    id  translation_key    id  translation_key
-------------  ----  ---------------  ----  ---------------
            1  1075  LOG_INSULIN      1143  INSULIN_TYPE   
            1  1075  LOG_INSULIN      1144  INSULIN_DOSE   
=> After inserts of v4 (pretty much v3 of Rinse):
data_provider    id  translation_key    id  translation_key
-------------  ----  ---------------  ----  ---------------
            1  1075  LOG_INSULIN      1143  INSULIN_TYPE   
            1  1075  LOG_INSULIN      1144  INSULIN_DOSE   
            1  1075  LOG_INSULIN      1185  INSULIN_SPEED  
           18  1075  LOG_INSULIN      1144  INSULIN_DOSE   
           18  1075  LOG_INSULIN      1185  INSULIN_SPEED  

=> Spotting bugs and making updates (see diff), so updating again:

data_provider    id  translation_key    id  translation_key
-------------  ----  ---------------  ----  ---------------
            1  1075  LOG_INSULIN      1143  INSULIN_TYPE   
            1  1075  LOG_INSULIN      1144  INSULIN_DOSE   
            1  1075  LOG_INSULIN      1185  INSULIN_SPEED  
           18  1075  LOG_INSULIN      1143  INSULIN_TYPE   
           18  1075  LOG_INSULIN      1144  INSULIN_DOSE   
           18  1075  LOG_INSULIN      1185  INSULIN_SPEED  

-- Version 4 (02/06/2021, PVG)
-- using "LOG_INSULIN" 

-- Version 3 (02/06/2021)
-- Diabetter insulin model (from TypeScript):
-- timestamp: number; (in milliseconds)
-- insulinAmount: number; (in units)                              - Translation key: "INSULIN_DOSE" in "INSULIN" or "LOG_INSULIN" (TBD)
-- insulinType: InsulinType; (either 0 (rapid) or 1 (long))       - Translation key: "INSULIN_TYPE" in "INSULIN" or "LOG_INSULIN" (TBD)
--
-- Changes since first version (26/05):
-- Also added the new properties to the GameBus data provider for front-end access
--
-- Changes since second version (01/06):
-- While Danilo suggested creating an entirely new game descriptor, I just added a new, separate INSULIN_SPEED property to the existing INSULIN game descriptor for the dropdown
-- Inserted writing permissions for new property to both GameBus and our own provider, also added insulin value permission to own provider
-- TODO: change insulin type into dropdown (see email)
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
  @data_provider_id = (
    SELECT
      id
    FROM
      data_provider
    WHERE
      name = 'Daily_run' -- Temporary name, will probably be different in production
  );
-- Insulin data can also be entered through GameBus front-end, so we add it to the GameBus data provider as well
SET
  @gamebus_provider_id = (
    SELECT
      id
    FROM
      data_provider
    WHERE
      name = 'GameBus'
  );
-- Creating own INSULIN_SPEED property that should have a dropdown
  -- TODO: create dropdown for this one
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
  '[rapid,long]',
  -- Either 'rapid' or 'long' acting
  'STRING',
  'INSULIN_SPEED',
  @string_id
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property`
    WHERE
      translation_key = 'INSULIN_SPEED'
    LIMIT
      1
  );
-- This one supposedly already exists from the e-mail, so we use that one
SET
  @INSULIN_VALUE = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'INSULIN_DOSE'
  );
-- Use insulin speed defined above
SET
  @INSULIN_SPEED = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'INSULIN_SPEED'
  );
SET
  @INSULIN_TYPE = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'INSULIN_TYPE'
  );
-- Game descriptor ID of existing INSULIN game descriptor
SET
  @LOG_INSULIN = (
    SELECT
      id
    FROM
      game_descriptor
    WHERE
      translation_key = 'LOG_INSULIN'
  );
-- Proposal from Danilo was to make own game descriptor for insulin type dropdown
  -- However, adding a new property to the already existing "INSULIN" game descriptor seemed more logical, so we'll do that
  -- Insert into own data provider
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
  @LOG_INSULIN,
  @INSULIN_VALUE,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @LOG_INSULIN
      AND property = @INSULIN_VALUE
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
  @LOG_INSULIN,
  @INSULIN_TYPE,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @LOG_INSULIN
      AND property = @INSULIN_TYPE
    LIMIT
      1
  );
-- I assumed insulin front-end access was already available, so we skip inserting the VALUE
  -- We still have to insert our new INSULIN_SPEED property though that should have a dropdown
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
  @LOG_INSULIN,
  @INSULIN_SPEED,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @gamebus_provider_id
      AND game_descriptor = @LOG_INSULIN
      AND property = @INSULIN_SPEED
    LIMIT
      1
  );
