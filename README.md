# Diabetter Back-end

## General info

This repo contains the back-end server for the Diabetter dashboard. It is written in TypeScript and can be run using Node.js.

### Installation:

1. Install [Node.js](https://nodejs.org/en/)
2. Install [Visual Studio Code](https://code.visualstudio.com/) (or any other IDE)
3. Clone this git
4. Run `yarn install` or `npm install` to install the relevant packages
5. Execute `yarn dev` (needs install of yarn) or `npm run dev` to see if everything is working
6. Navigate to http://localhost:8080/ to see your local server

### Build:

1. Install [Node.js](https://nodejs.org/en/)
2. Install [Visual Studio Code](https://code.visualstudio.com/) (or any other IDE)
3. Clone this git
4. Run `yarn install` or `npm install` to install the relevant packages
5. Execute `yarn build` or `npm run build` to build the TypeScript code so it gets compiled to JavaScript code
6. Execute `yarn start` or `npm run start` to start the compiled server
7. Navigate to http://localhost:8080/ to see your local server

## Improvements to be made

### Performance

Currently, the back-end relies on the GameBus infrastructure to store and retrieve data. While this works fine for small amounts of data (a few activities a day), insulin and especially glucose data can have a lot of occurences throughout a day, which GameBus is not prepared for. One way to mitigate this through our end is to have our own (SQL) database in which we can store the user's activities. This way, we can retrieve all user activities once on login and then query on our own database instead of querying on the GameBus API.

GameBus' API can also be improved to make the retrieving of activities faster. Currently, a single activity response is around 140 lines of JSON, if the API were to have options to only get certain fields of the response (leave out the permissions for example), getting many activities at once could be a lot faster. Furthermore, currently the GameBus API only allows one to query on start- and end-dates as well as game descriptor IDs, if the API were to allow more query types (i.e. property values, actual times [not just dates]), the back-end could be sped up dramastically since this would allow us to more closely narrow down the activities we need to display.

### Aggregation

During the project, it was brought up that aggregations of data would be nice to show as well. We wanted to use GameBus' aggregate system to make daily or hourly aggregates of glucose values so we can more easily retrieve aggregate glucose data. In the end, we did not use this route, but this route can still be used to get daily aggregates and to visualize them (eventually). Currently, aggregates would only be possible through the front-end since you would have to calculate the aggregates from the data you receive there.

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
