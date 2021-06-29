Executed as second script

State at start:
select pp.data_provider as DP, gd.id as GD_ID, gd.translation_key, p.id AS P_ID, p.translation_key from game_descriptor gd, property p, property_permission pp 
where gd.translation_key like '%BLOOD_GLUCOSE_MSMT%' and pp.property=p.id and pp.game_descriptor=gd.id 
=>
data_provider  id  translation_key     id  translation_key
-------------  --  ------------------  --  ---------------
            1  61  BLOOD_GLUCOSE_MSMT  87  WHEN           
            7  61  BLOOD_GLUCOSE_MSMT  87  WHEN           
            1  61  BLOOD_GLUCOSE_MSMT  88  eAG_MMOLL      
            7  61  BLOOD_GLUCOSE_MSMT  88  eAG_MMOLL      
            1  61  BLOOD_GLUCOSE_MSMT  89  eAG_MGDL       
            7  61  BLOOD_GLUCOSE_MSMT  89  eAG_MGDL       

State after inserts:

data_provider  id  translation_key     id  translation_key
-------------  --  ------------------  --  ---------------
            1  61  BLOOD_GLUCOSE_MSMT  87  WHEN           
            7  61  BLOOD_GLUCOSE_MSMT  87  WHEN           
            1  61  BLOOD_GLUCOSE_MSMT  88  eAG_MMOLL      
            7  61  BLOOD_GLUCOSE_MSMT  88  eAG_MMOLL      
           18  61  BLOOD_GLUCOSE_MSMT  88  eAG_MMOLL      
            1  61  BLOOD_GLUCOSE_MSMT  89  eAG_MGDL       
            7  61  BLOOD_GLUCOSE_MSMT  89  eAG_MGDL       

-- select max(id) as maxPropID, count(*) as numProps from property
--   BEFORE: 1184, 232
--   AFTER: 1184, 232
-- select max(id) as maxGdID, count(*) as numGDs from game_descriptor 
--   BEFORE: 1077, 96
--   AFTER: 1077, 96
-- select max(id) as maxPpID, count(*) as numPPs from property_permission 
--   BEFORE: 1364, 547
--   AFTER: 1365, 548



-- Version 3 (02/06/2021)
-- Diabetter glucose model (from TypeScript):
-- timestamp: number; (in milliseconds)               - As 'date' in activity
-- glucoseLevel: number; (in mmol/L)                  - Translation key: "eAG_MMOLL" in "BLOOD_GLUCOSE_MSMT"
--
-- Changes since first version (26/05):
-- Removed everything since the "BLOOD_GLUCOSE_MSMT" game descriptor already has our desired properties
--
-- Changes since second version (01/06):
-- Inserted eAG_MMOLL writing permissions into our own data provider
--
SET
  @data_provider_id = (
    SELECT
      id
    FROM
      data_provider
    WHERE
      name = 'Daily_run'
  );
-- Get properties
SET
  @GLUCOSE_LEVEL = (
    SELECT
      id
    FROM
      property
    WHERE
      translation_key = 'eAG_MMOLL'
  );
-- Game descriptor
SET
  @GLUCOSE_LOG = (
    SELECT
      id
    FROM
      game_descriptor
    WHERE
      translation_key = 'BLOOD_GLUCOSE_MSMT'
  );
-- Inserting property writing permissions from glucose level into our data provider
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
  @GLUCOSE_LOG,
  @GLUCOSE_LEVEL,
  'PUBLIC_APPROVED'
WHERE
  NOT EXISTS (
    SELECT
      *
    FROM
      `gamebus_api`.`property_permission`
    WHERE
      data_provider = @data_provider_id
      AND game_descriptor = @GLUCOSE_LOG
      AND property = @GLUCOSE_LEVEL
    LIMIT
      1
  );