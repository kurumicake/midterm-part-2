import { Writable as IWritable } from "../interfaces/writable-interface";
import { MenuItem as IMenuItem } from "../interfaces/MenuItem-interface";
import { readFile } from "node:fs/promises";
import { EOL } from "os";

export class CsvMenuParser {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async parseCSV(): Promise<IMenuItem[]> {
    const data = await readFile(this.filePath, "utf-8");
    const lines = data.split(EOL).filter((line) => line.trim());
    return lines.map((line) => {
      const [mealType, mealName, mealQuantity, priceString] = line.split(",");
      const price = priceString.trim().replace("$", "");
      return { mealType, mealName, mealQuantity, price };
    });
  }

  async writeMenu(writer: IWritable): Promise<void> {
    const menuItems = await this.parseCSV();
    const categorizedItems: Record<string, IMenuItem[]> = {};
    menuItems.forEach((item) => {
      const { mealType, mealName, mealQuantity, price } = item;
      const priceFloat = parseFloat(price);
      if (!categorizedItems[mealType]) {
        categorizedItems[mealType] = [];
      }

      categorizedItems[mealType].push({
        mealType,
        mealName,
        mealQuantity,
        price: priceFloat.toFixed(2),
      });
    });

    let content = "";
    Object.entries(categorizedItems).forEach(([mealType, items]) => {
      content += `* ${
        mealType.charAt(0).toUpperCase() + mealType.slice(1)
      } Items * ${EOL}`;
      items.forEach(({ mealName, mealQuantity, price }) => {
        // Ensure price is correctly formatted when building content
        content += `$${price},${mealName},${mealQuantity}${EOL}`;
      });
      content += EOL;
    });

    await writer.writeContent(content.trim());
  }
}
