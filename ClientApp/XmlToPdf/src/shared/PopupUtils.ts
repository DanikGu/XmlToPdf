import Popup from './Popup';

class PopupUtils {
  public static alert(text: string): void {
    const popup = new Popup(
      text,
      'Alert',
      'alert',
      [
        {
          text: 'OK',
          callback: () => {
            console.log('OK button clicked');
          },
        },
      ]
    );
    popup.show();
  }

  public static error(text: string): void {
    const popup = new Popup(
      text,
      'Error',
      'error',
      [
        {
          text: 'OK',
          callback: () => {
            console.log('OK button clicked');
          },
        },
      ]
    );
    popup.show();
  }
}

export default PopupUtils;