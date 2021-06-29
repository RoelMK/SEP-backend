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

Property enum values:
 id  enum_value  value_index  translation_key  property_write_permission
---  ----------  -----------  ---------------  -------------------------
  6  5                     0  Zeer goed                               71
  7  4                     1  Goed                                    71
  8  3                     2  Gaat wel                                71
  9  2                     3  Slecht                                  71
 10  1                     4  Zeer slecht                             71
 11  5                     0  Zeer goed                               72
 12  4                     1  Goed                                    72
 13  3                     2  Gaat wel                                72
 14  2                     3  Slecht                                  72
 15  1                     4  Zeer slecht                             72
 16  5                     0  L5.5                                    82
 17  4                     1  L5.4                                    82
 18  3                     2  L5.3                                    82
 19  2                     3  L5.2                                    82
 20  1                     4  L5.1                                    82
 21  5                     0  L5.5                                    83
 22  4                     1  L5.4                                    83
 23  3                     2  L5.3                                    83
 24  2                     3  L5.2                                    83
 25  1                     4  L5.1                                    83
 26  5                     0  L5.5                                    84
 27  4                     1  L5.4                                    84
 28  3                     2  L5.3                                    84
 29  2                     3  L5.2                                    84
 30  1                     4  L5.1                                    84
 31  5                     0  TIME.5                                  85
 32  4                     1  TIME.4                                  85
 33  3                     2  TIME.3                                  85
 34  2                     3  TIME.2                                  85
 35  1                     4  TIME.1                                  85
 36  5                     0  TIME.5                                  86
 37  4                     1  TIME.4                                  86
 38  3                     2  TIME.3                                  86
 39  2                     3  TIME.2                                  86
 40  1                     4  TIME.1                                  86
 41  5                     0  TIME.5                                  87
 42  4                     1  TIME.4                                  87
 43  3                     2  TIME.3                                  87
 44  2                     3  TIME.2                                  87
 45  1                     4  TIME.1                                  87
 46  5                     0  TIME.5                                  88
 47  4                     1  TIME.4                                  88
 48  3                     2  TIME.3                                  88
 49  2                     3  TIME.2                                  88
 50  1                     4  TIME.1                                  88
 51  5                     0  TIME.5                                  89
 52  4                     1  TIME.4                                  89
 53  3                     2  TIME.3                                  89
 54  2                     3  TIME.2                                  89
 55  1                     4  TIME.1                                  89
 56  5                     0  TIME.5                                  90
 57  4                     1  TIME.4                                  90
 58  3                     2  TIME.3                                  90
 59  2                     3  TIME.2                                  90
 60  1                     4  TIME.1                                  90
 61  5                     0  TIME.5                                  91
 62  4                     1  TIME.4                                  91
 63  3                     2  TIME.3                                  91
 64  2                     3  TIME.2                                  91
 65  1                     4  TIME.1                                  91
 66  5                     0  TIME.5                                  92
 67  4                     1  TIME.4                                  92
 68  3                     2  TIME.3                                  92
 69  2                     3  TIME.2                                  92
 70  1                     4  TIME.1                                  92
 71  5                     0  TIME.5                                  93
 72  4                     1  TIME.4                                  93
 73  3                     2  TIME.3                                  93
 74  2                     3  TIME.2                                  93
 75  1                     4  TIME.1                                  93
 76  5                     0  TIME.5                                  94
 77  4                     1  TIME.4                                  94
 78  3                     2  TIME.3                                  94
 79  2                     3  TIME.2                                  94
 80  1                     4  TIME.1                                  94
273  4                     0  AGM.NO                                 129
274  3                     1  AGM.YES_WEEKS                          129
275  2                     2  AGM.YES_MONTHS                         129
276  1                     3  AGM.YES_YEAR                           129
277  6                     0  AGM.D2.6                               130
278  5                     1  AGM.D2.5                               130
279  4                     2  AGM.D2.4                               130
280  3                     3  AGM.D2.3                               130
281  2                     4  AGM.D2.2                               130
282  1                     5  AGM.D2.1                               130
283  4                     0  AGM.NO                                 131
284  3                     1  AGM.YES_WEEKS                          131
285  2                     2  AGM.YES_MONTHS                         131
286  1                     3  AGM.YES_YEAR                           131
287  4                     0  AGM.NO                                 132
288  3                     1  AGM.YES_WEEKS                          132
289  2                     2  AGM.YES_MONTHS                         132
290  1                     3  AGM.YES_YEAR                           132
291  4                     0  AGM.NO                                 133
292  3                     1  AGM.YES_WEEKS                          133
293  2                     2  AGM.YES_MONTHS                         133
294  1                     3  AGM.YES_YEAR                           133
295  4                     0  AGM.NO                                 134
296  3                     1  AGM.YES_WEEKS                          134
297  2                     2  AGM.YES_MONTHS                         134

-- Version 4 (02/06/2021, PVG)
-- using "LOG_INSULIN" 
-- Also fixing bug w.r.t INSULIN_TYPE/INSULIN_SPEED

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
  
-- enabling drop-down in GameBus base app

-- BEGIN FOR DROPDOWN
SET @propperm_insunlin_type_in_gamebus_provider = (
    SELECT id from `gamebus_api`.`property_permission` where data_provider = @gamebus_provider_id
      AND game_descriptor = @LOG_INSULIN
      AND property = @INSULIN_TYPE
    LIMIT
      1
);
SET @propperm_insunlin_speed_in_gamebus_provider = (
    SELECT id from `gamebus_api`.`property_permission` where data_provider = @gamebus_provider_id
      AND game_descriptor = @LOG_INSULIN
      AND property = @INSULIN_SPEED
    LIMIT
      1
);
INSERT INTO 
`property_enum_value` ( 
  `enum_value`, 
  `value_index`, 
  `translation_key`, 
  `property_write_permission`
) 
(SELECT
    'rapid',0,'INSULIN_TYPE_RAPID',@propperm_insunlin_speed_in_gamebus_provider
WHERE NOT EXISTS (
    SELECT * FROM property_enum_value where 
 	enum_value='rapid' and
	translation_key='INSULIN_TYPE_RAPID' and
	property_write_permission=@propperm_insunlin_speed_in_gamebus_provider
)) UNION
(SELECT
    'long',1,'INSULIN_TYPE_LONG',@propperm_insunlin_speed_in_gamebus_provider
WHERE NOT EXISTS (
    SELECT * FROM property_enum_value where 
 	enum_value='long' and
	translation_key='INSULIN_TYPE_LONG' and
	property_write_permission=@propperm_insunlin_speed_in_gamebus_provider
));
-- END FOR DROPDOWN



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
