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
    const lines = data.split(EOL).filter(line => line.trim());
    return lines.map(line => {
      const [mealType, mealName, mealQuantity, priceString] = line.split(",");
      const price = priceString.trim().replace("$", "");
      return { mealType, mealName, mealQuantity, price };
    });
  }

  async writeMenu(writer: IWritable): Promise<void> {
    const menuItems = await this.parseCSV();
    const categorizedItems: Record<string, IMenuItem[]> = {};

    menuItems.forEach(item => {
      if (!categorizedItems[item.mealType]) {
        categorizedItems[item.mealType] = [];
      }
      categorizedItems[item.mealType].push(item);
    });

    let content = "";
    Object.keys(categorizedItems).forEach(mealType => {
      content += `<tr><th colspan="4">${mealType.toUpperCase()}</th></tr>`;
      categorizedItems[mealType].forEach(({ mealName, mealQuantity, price }) => {
        content += `<tr>
        <td>$${parseFloat(price).toFixed(2)}</td>
                      <td>${mealName}</td>
                      <td>${mealQuantity}</td>
                    </tr>`;
      });
    });

    await writer.writeContent(content);
  }
}
