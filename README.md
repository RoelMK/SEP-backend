# Diabetter Back-end

## General info

This repo contains the back-end server for the Diabetter dashboard. It is written in TypeScript and can be run using Node.js.

## Installation:

1. Install [Node.js](https://nodejs.org/en/)
2. Install [Visual Studio Code](https://code.visualstudio.com/) (or any other IDE)
3. Clone this git
4. Run `yarn install` (needs install of yarn) or `npm install` to install the relevant packages
5. Execute `yarn start` or `npm run start` to see if everything is working
6. Navigate to http://localhost:8080/ to see your local server

### Other scripts

There are a few other script available to run:

-   `npm run prep` will, when possible, prepare some GameBus accounts with some mock data to demonstrate the capabilities of the dashboard, while this command will probably stop working, the files can still be seen on how to do this
-   `npm run test` will run the tests defined in the `test` directory
-   `npm run build` will compile the the TypeScript files to Javascript and output them in the `dist` directory
-   `npm run lint` will run the linter on all code

## Code quality check

For checking code quality, we recommend you only include the `src` folder. Our test files (located in the `test` folder) should be excluded as well as any third party modules (located in `node_modules`). Furthermore, if there is a `dist` folder present, this folder should also be excluded since this folder contains the compiled JavaScript files.

### Fan-out

Since TypeScript is not strictly an Object-Oriented language, the "Fan-out" metric will be used to assess coupling. However, in our opinion, this metric is flawed, especially in the way Understand calculates the metric. While the metric is supposed to count the amount of external files used by a module, the Understand metric instead (roughly) counts the amount of entities imported. This, in and of itself, already increases the fan-out a lot since we are of course importing several entities from the same file.

Furthermore, Understand does not distinguish between importing classes, types or functions. Since the code is evaulated on the "number of functions of other modules this module calls", classes and especially types (in the case of TypeScript) shouldn't be counted, yet they are in Understand.

Lastly, the entire premise of npm (the Node package manager) is that you can just import a lot of modules so you don't have to reinvent the wheel for every little thing. The fan-out metric goes directly against that by limiting the amount of functions / files a module is allowed to import. This is why we think the fan-out metric is unfair, especially when using TypeScript.
For checking yourself, we recommend you only include the `src` folder. Our test files (located in the `test` folder) should be excluded as well as any third party modules (located in `node_modules`).

## Changing GameBus configuration

Right now, the back-end will be using our own data provider with the pre-defined game descriptors for retrieving and posting data on the test API (api3). The back-end is currently using the following data provider(s) and game descriptors:

### Data providers

| Data provider ID | Data provider name |
| ---------------- | ------------------ |
| 1                | GameBus            |
| 18               | Daily_run          |

These values are defined in `src/gb/objects/activity` for our own data provider ID & name. The GameBus data provider ID & name are defined in `src/gb/objects/keys`.

### Game descriptors

| Data type | Game descriptor ID(s) | Game descriptor translation key(s) |
| --------- | --------------------- | ---------------------------------- |
| Food      | 58                    | Nutrition_Diary                    |
| Insulin   | 1075                  | LOG_INSULIN                        |
| Glucose   | 61                    | BLOOD_GLUCOSE_MSMT                 |
| Mood      | 1062                  | LOG_MOOD                           |
| Exercise  | -                     | Most exercise game descriptors     |
| BMI       | 1078                  | BODY_MASS_INDEX                    |

These values are (mostly) defined in `src/gb/objects/keys`. The translation keys are used for retrieving and sending SINGLE activities, for sending multiple activities, the game descriptor IDs are used. The translation keys for the exercise activities are also defined in `src/gb/objects/keys`, but separately since there are lots of different exercise game descriptors.

### Properties

| Game descriptor translation key(s) | Game descriptor properties | Notes                                            |
| ---------------------------------- | -------------------------- | ------------------------------------------------ |
| Nutrition_Diary                    | FOOD_CARBOHYDRATES_GRAMS   |                                                  |
|                                    | KCAL_CARB                  |                                                  |
|                                    | FOOD_MEAL_TYPE             |                                                  |
|                                    | FOOD_GLYCEMIC_INDEX        |                                                  |
|                                    | FOOD_FAT_GRAMS             |                                                  |
|                                    | FOOD_SATURATED_FAT_GRAMS   |                                                  |
|                                    | FOOD_PROTEINS_GRAMS        |                                                  |
|                                    | FIBERS_WEIGHT              |                                                  |
|                                    | FOOD_SALT_GRAMS            |                                                  |
|                                    | FOOD_WATER_GRAMS           |                                                  |
|                                    | FOOD_SUGAR_GRAMS           |                                                  |
|                                    | DESCRIPTION                |                                                  |
| LOG_INSULIN                        | INSULIN_DOSE               |                                                  |
|                                    | INSULIN_SPEED              |                                                  |
| BLOOD_GLUCOSE_MSMT                 | eAG_MMOLL                  |                                                  |
|                                    | eAG_MGDL                   | Converted to mmol/L on our end                   |
| LOG_MOOD                           | MOOD_AROUSAL               |                                                  |
|                                    | MOOD_VALENCE               |                                                  |
| Most exercise game descriptors     | DURATION                   |                                                  |
|                                    | STEPS                      |                                                  |
|                                    | DISTANCE                   |                                                  |
|                                    | KCALORIES                  |                                                  |
|                                    | GROUP_SIZE                 |                                                  |
|                                    | PENALTY                    |                                                  |
|                                    | SCORE                      |                                                  |
|                                    | SPEED.MAX                  |                                                  |
|                                    | SPEED.AVG                  |                                                  |
|                                    | MAX_HEART_RATE             |                                                  |
|                                    | AVG_HEART_RATE             |                                                  |
|                                    | MIN_HEART_RATE             |                                                  |
|                                    | -                          | This is for heartrate, but was never implemented |
| BODY_MASS_INDEX                    | WEIGHT                     |                                                  |
|                                    | LENGTH                     |                                                  |
|                                    | AGE                        |                                                  |
|                                    | GENDER                     | Unused                                           |
|                                    | WAIST_CIRCUMFERENCE        | Unused                                           |
|                                    | BODY_MASS_INDEX            | Unused                                           |

These property translation keys are defined in each object at the bottom of the files, the `enum` for these translation keys will automatically map the translation key of the property to the key of the property in our models (for an example of this, see `convertResponseToFoodModel()` in `src/gb/objects/food.ts`). These models can be found in `src/gb/models`.

All of the .sql scripts used to insert these game descriptors and properties into the API can be found in the `sql` folder. A more detailed list of all the game descriptors can also be found in `src/gb/models/descriptors.md`.

If you want the back-end to interact with the production API of GameBus, the endpoint for the GameBus Client is defined in `src/gb/gbClient.ts` at the top of the file. Keep in mind that you will most likely have to change the game descriptor IDs as well as add the missing game descriptors and properties to the production API before things will work as expected.

## Improvements to be made (by others)

### Performance

Currently, the back-end relies on the GameBus infrastructure to store and retrieve data. While this works fine for small amounts of data (a few activities a day), insulin and especially glucose data can have a lot of occurences throughout a day, which GameBus is not prepared for (for explanation, see next paragraph). One way to mitigate this through our end is to have our own (SQL) database in which we can store the user's activities. This way, we can retrieve all user activities once on login and then query on our own database instead of querying on the GameBus API. While this makes the initial load a lot slower, this will speed up queries by a significant amount since we will be able to query on all property types with minimal response sizes using SQL instead of relying on (huge) HTTP responses.

GameBus' API can also be improved to make the retrieving of activities faster. Currently, a single activity response is around 140 lines of JSON, if the API were to have options to only get certain fields of the response (leave out the permissions for example), getting many activities at once could be a lot faster. Furthermore, currently the GameBus API only allows one to query on start- and end-dates as well as game descriptor IDs, if the API were to allow more query types (i.e. property values, actual times [not just dates]), the back-end could be sped up dramatically since this would allow us to more closely narrow down the activities we need to display.

### Aggregation

During the project, it was brought up that aggregations of data would be nice to show as well. We wanted to use GameBus' aggregate system to make daily or hourly aggregates of glucose values so we can more easily retrieve aggregate glucose data. In the end, we did not use this route, but this route can still be used to get daily aggregates and to visualize them (eventually). Currently, aggregates would only be possible through the front-end since you would have to calculate the aggregates from the data you receive there. The reason why we decided not to use GameBus' aggregates is because, without any modification, the aggregates could only be used for daily averages which is not always what we were looking for. Furthermore, we are now handling the average calculations (of a specified timeframe) through the front-end since we are showing the statistics for a specified timeframe, not an entire day (which is what you would get if you were to use the current GameBus aggregate system). GameBus daily aggregates could still have been used for calculating the A1C levels for example (average glucose levels of past 3 months), but in the end, because of time constraints, we did not implement this.

### Adding more properties

Currently, the back-end supports the following data types with mentioned sources:
| Data type | Data source | Posted to GameBus? |
|-----------|----------------------------------------------------|--------------------|
| Glucose | Abbott, Nightscout, GameBus | Yes |
| Insulin | Abbott, Nightscout, Food diary, Front-end, GameBus | Yes |
| Food | Abbott, Eetmeter, Food diary, GameBus | Yes |
| Exercise | GameBus | No |
| Mood | Front-end, GameBus | Yes |

For all data sources that are not GameBus, the data is first POSTed to GameBus and then retrieved again. A distinction is made between getting a property type from an external source, POSTing it to GameBus and retrieving it and simply retrieving the property from GameBus:

#### External source -> GameBus -> Back-end -> Front-end

If the goal is to get data from an external source and visualize it, the data must first be parsed and POSTed to GameBus, the way the back-end is setup, this is possible in a few steps:

1. Create a `DataParser` for the external source (see `src/services/dataParsers`)
2. (Optional) Create a `FileParser` for the external source if needed (see `src/services/fileParsers`)
3. Create new parsers and mappers for the new property (see `src/services/food`, `glucose`, `insulin` and `mood`)
4. Create new POST functions in the GameBusClient to POST the new properties (see `src/gb/objects/food`, `glucose`, `insulin` and `mood`)
5. Adjust the `/upload` endpoint to allow for the new file upload or add a new endpoint to connect with the API (see `src/routes/nightscout`)
6. Create new GET functions in the GameBusClient to GET the new properties
7. Add the new properties to the `dataEndpoint` (in `src/dataEndpoint`)

#### GameBus -> Back-end

If the new data is already on GameBus, there are only a few steps needed:

1. Create new GET functions in the GameBusClient to GET the new properties
2. Add the new properties to the `dataEndpoint` (in `src/dataEndpoint`)

There's also the option of extending the current property types with more external sources, this can be done as follows:

1. Create a `DataParser` for the external source (see `src/services/dataParsers`)
2. (Optional) Create a `FileParser` for the external source if needed (see `src/services/fileParsers`)
3. Add a new mapping function to the relevant data mapper (see `src/services/food/foodMapper` for food)
4. Adjust the `/upload` endpoint to allow for the new file upload or add a new endpoint to connect with the API (see `src/routes/nightscout`)
