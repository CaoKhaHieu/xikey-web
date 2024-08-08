export interface RadioOptions {
  value: string;
  text: string;
}

export class RadioOptions {
  constructor(data: any) {
    this.value = data.value;
    this.text = data.text;
  }
}
