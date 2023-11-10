import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import PopUpModal from './PopUpModal';
import InfoController from '../controllers/InfoController';

const InfoModal = () => {
  // STATE && MISC
  const [isVisible, setIsVisible] = useState(false);
  const [info, setInfo] = useState({
    title: null,
    description: null,
  });
  const modalRef = useRef();

  useLayoutEffect(() => {
    InfoController.setModalRef(modalRef);
  }, []);

  useImperativeHandle(
    modalRef,
    () => ({
      show: (title, description) => {
        setIsVisible(true);
        setInfo({
          title,
          description,
        });
      },
      hide: () => {
        setIsVisible(false);
        setInfo({
          title: '',
          description: '',
        });
      },
    }),
    [],
  );

  return (
    <PopUpModal
      onRequestClose={() => setIsVisible(false)}
      isVisible={isVisible}
      title={info?.title}
      subtitle={info?.description}
    />
  );
};

export default forwardRef(InfoModal);
