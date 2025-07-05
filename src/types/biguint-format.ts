declare module 'biguint-format' {
  function biguintFormat(input: Buffer, format: 'dec' | 'hex' | 'base64'): string;

  export = biguintFormat;
}
