import { writeFile} from "node:fs/promises";

import { Writable as IWritable } from "../interfaces/writable-interface";

export class HtmlWriter implements IWritable {
  private outputPath: string;

  constructor(outputPath: string) {
    this.outputPath = outputPath;
  }

  async writeContent(content: string): Promise<void> {
    const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Menu</title>
      <style>
      body {
          background-color: #333;
          color: #f0e6d2;
          font-family: 'Georgia', serif;
          text-align: center;
          padding: 20px;
      }
      
      .menu-item {
          font-size: 20px;
          line-height: 1.6;
      }
      </style>
  </head>
 
  <body>
      <table>
          ${content
            .split("\n")
            .map(
              (line) => `<tr class="menu-item"><td>${line}</td></tr>`
            )
            .join("")}
      </table>
  </body>
  </html>
      `;
    await writeFile(this.outputPath, htmlContent);
  }
}
