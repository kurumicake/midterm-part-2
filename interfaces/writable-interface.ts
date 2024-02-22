export interface Writable {
    writeContent(content:string): Promise<void>;
}