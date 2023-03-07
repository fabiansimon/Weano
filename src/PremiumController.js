export default class PremiumController {
  static modalRef;

  static setModalRef = (ref) => {
    this.modalRef = ref;
  };

  static showModal = () => {
    this.modalRef.current?.show();
  };

  static hideModal = () => {
    this.modalRef.current?.hide();
  };
}
