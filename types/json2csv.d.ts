declare module 'json2csv' {
  export function parse(
    data: any,
    opts?: {
      fields?: string[];
      transforms?: any[];
      delimiter?: string;
      eol?: string;
      quote?: string;
      escape?: string;
      header?: boolean;
      includeEmptyRows?: boolean;
      withBOM?: boolean;
    }
  ): string;
}
