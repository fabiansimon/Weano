export default class PremiumController {
  static modalRef;

  static setModalRef = ref => {
    this.modalRef = ref;
  };

  static showModal = isMax => {
    this.modalRef.current?.show(isMax);
  };

  static hideModal = () => {
    this.modalRef.current?.hide();
  };
}
