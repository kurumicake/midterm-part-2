import {CsvMenuParser} from "./classes/CsvMenuParser";
import {TextWriter} from "./classes/TextWriter";
import {HtmlWriter} from "./classes/HtmlWriter";

const parser = new CsvMenuParser("./data/menu.csv");
const textWriter = new TextWriter("./data/menu.txt");
const htmlWriter = new HtmlWriter("./data/menu.html");

// For text output
parser.writeMenu(textWriter);

// For HTML output
parser.writeMenu(htmlWriter);
