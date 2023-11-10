export default class InfoController {
  static modalRef;

  static setModalRef = ref => {
    this.modalRef = ref;
  };

  static showModal = (title, description) => {
    this.modalRef.current?.show(title, description);
  };

  static hideModal = () => {
    this.modalRef.current?.hide();
  };
}
