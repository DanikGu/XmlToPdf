type DialogType = 'warning' | 'error' | 'alert' | 'dialog';

type ButtonType = {
  text: string;
  callback: (inputValues?: Record<string, string>) => void;
  submit?: boolean;
};

type InputType = {
  inputType: string;
  inputLabel: string;
  dataLabel: string;
};

class PopupDialog {
  private message: string;
  private title: string;
  private dialogType: DialogType;
  private buttons: ButtonType[];
  private inputs?: InputType[];

  constructor(
    message: string,
    title: string,
    dialogType: DialogType,
    buttons: ButtonType[],
    inputs?: InputType[]
  ) {
    this.message = message;
    this.title = title || 'Confirm';
    this.dialogType = dialogType;
    this.buttons = buttons;
    this.inputs = inputs;
  }

  public show(): void {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const dialog = document.createElement('div');
    dialog.classList.add('dialog', this.dialogType);

    const dialogTitle = document.createElement('h5');
    dialogTitle.innerText = this.title;
    dialog.appendChild(dialogTitle);

    const dialogMessage = document.createElement('p');
    dialogMessage.innerText = this.message;
    dialog.appendChild(dialogMessage);

    if (this.inputs) {
      const inputContainer = document.createElement('div');
      inputContainer.classList.add('input-container');

      this.inputs.forEach(({ inputType, inputLabel, dataLabel }) => {
        const label = document.createElement('label');
        label.innerText = inputLabel;
        inputContainer.appendChild(label);

        const input = document.createElement('input');
        input.type = inputType;
        input.classList.add('default-input');
        input.setAttribute('data-label', dataLabel);
        inputContainer.appendChild(input);
      });

      dialog.appendChild(inputContainer);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    this.buttons.forEach(({ text, callback, submit }) => {
      const button = document.createElement('button');
      button.classList.add('default-button');
      button.innerText = text;
      button.onclick = () => {
        if (submit) {
          const inputValues: Record<string, string> = {};
          const inputs = dialog.querySelectorAll<HTMLInputElement>('.default-input');
          inputs.forEach((input) => {
            inputValues[input.getAttribute('data-label')!] = input.value;
          });
          callback(inputValues);
        } else {
          callback();
        }
        this.close(overlay);
      };
      buttonContainer.appendChild(button);
    });

    dialog.appendChild(buttonContainer);
    overlay.appendChild(dialog);

    document.body.appendChild(overlay);
  }

  private close(overlay: HTMLElement): void {
    document.body.removeChild(overlay);
  }
}

export default PopupDialog;
