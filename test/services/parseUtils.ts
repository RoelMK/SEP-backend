import AbbottParser from '../../src/services/dataParsers/abbottParser';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';

/**
 * Helper function to parse an Abbott file through the AbbottParser and get the resulting data
 * @param filePath File to parse
 * @param type Type of data to be retrieved from file
 * @returns Data of type {type}
 */
export async function parseAbbott(filePath: string, type: OutputDataType) {
    const abbottEUParser: AbbottParser = new AbbottParser(filePath);
    await abbottEUParser.process();
    return abbottEUParser.getData(type);
}

/**
 * Helper function to parse a Food diary file through the FoodDiaryParser and get the resulting data
 * @param filePath File to parse
 * @param type Type of data to be retrieved from file
 * @returns Data of type {type}
 */
 export async function parseFoodDiary(filePath: string, type: OutputDataType) {
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(filePath);
    await foodDiaryParser.process();
    return foodDiaryParser.getData(type);
}


export async function parseOneDriveFoodDiary(filePath: string, type: OutputDataType){
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(filePath,
        'EwBwA8l6BAAU6k7+XVQzkGyMv7VHB/h4cHbJYRAAAWajzIlJ3W1pXALQUMOQhRS9CGKZZ4Jz8M5kzqyyqI8oTE9H3lxGBenee7XxHgZ14hp0AKHZm/X2QkdsdW2AlFvjsuMqVCTlTkDVgYp9Z9PFHb8myGK60vrFqs6ANsdnq5lmCGBymBM7xTg6RJHQZkkZ8ZagFTZeQZic+lZJrvyr7HInHVNXl6yygFfSAfouoUZ8JapOe/I2hJkHgmmga1WFeK85av8lANlM4L7e6zt1W+7E5wfcxCeESnPMRjygu7RMFi/wqszbk8cgGxCj0E98MOgFlY2/vvd8Q9ZZ7y2qMMQ+aGTUaInU93DhWEz7tVgOhxALaJAl4BtPRrJlGIUDZgAACAortMfaQMaHQALkEdHcO/vn3yc12GGB7/ygLSpAljeWdtnPb70t1piTUc4PKDrkQ2bxxTX7C2AGVt8HrN3ClLMiWBFUF8RQxnmQFh8iuhoak+xratt1wN0Bm3dh2ThmEiHJgGoIuNl6TX9FCAcT4aj4rqcho6nfYTOtrh2op+7nX+vK3nSYBZcK/JbNshjqyNrGQuMNSpzifP0tcdcW4g1fbW1fJehSh3Z300ZN0i5db2ECvuOOqXUBJvKh/PGgWGVO/+uIULhrEI4yq5TsvobZPaaxZ/8wl8AY6PhjfLqcmN4/yAcIs1QxQWV0FgWZJCSzmC8ewvJ2jzSWbhLceCDlGcu3FzNla4UhBHAS9wyAjBJaytIYJGJc2aKhvEIJQWnMncnDho3RNK9fbSNf2VheLsjhiTbOwEbF+SfXKurjL/UCVgeNevvmsUI1+EkDvhWFox6M5iXEzyv2b8gHcwElWGv95jco2fsgJsFX3Oa4PWuPo7GQ6yUoA54vnkWKfH3GcPHq38jh7kLDVCaN7fsgvC95tpqJGZgGRZcSE8ZACavb+KId5W75lwNlsuwX3mpzhZ/jHn3BCoO5BiI+u3WuGFH00XPQH+RB2pIVTWcygZCFffeyCyffGU6taPUt4rkS1rmGYZ287mjCj8WAvfBNWuykBLSO7TuvEr64hiO+sX6RQ6T0mHAXlM1TlR0ZrX2ntDV1NdibHMbKliic0fwBWWls3yAvGbGpvafysmWHAPOTGC63ayLmQykg3tOFNeq1MEm0b8sfqAKHAg==')
    await foodDiaryParser.process();
    return foodDiaryParser.getData(type);
}