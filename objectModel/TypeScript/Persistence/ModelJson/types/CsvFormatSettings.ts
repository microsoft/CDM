import { FileFormatSettings } from './FileFormatSettings';

export abstract class CsvFormatSettings extends FileFormatSettings {
    public columnHeaders? : boolean;
    public csvStyle : string;
    public delimiter : string;
    public quoteStyle : string;
    public encoding: string;
}
