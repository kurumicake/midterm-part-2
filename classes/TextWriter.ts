import { writeFile } from "node:fs/promises";

export class TextWriter {
  private outputPath: string;

  constructor(outputPath: string) {
    this.outputPath = outputPath;
  }

  async writeContent(content: string): Promise<void> {
    await writeFile(this.outputPath, content);
  }
}
