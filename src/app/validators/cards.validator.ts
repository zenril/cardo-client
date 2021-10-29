import { AbstractControl } from '@angular/forms';

export function CardValidator(key: string) {
  return (control: AbstractControl) => {
    let cards = control.value as string;

    let tokenCards = cards
      .split(/[,\n\s]+/)
      .filter((item) => !!item)
      .map((card) => card.trim());

    for (const card of tokenCards) {
      if (!card || !/^(1[0-3]|[1-9]|[a-z]|[A-Z])$/.test(card)) {
        return {
          [key]: true,
        };
      }
    }

    return null;
  };
}
