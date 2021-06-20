import { Children } from "react";
import { Modal,Icon } from  "semantic-ui-react";

export default function BasicModal(props) {
    const {show,setShow,title,children,...rest } = props; 
    /*show: permitira saber si el modal se tiene que ver o no
      setShow: permitira ocultar el modal
      title: titulo del modal
      children: contenido que tiene que mostrar el modal
      ...rest: otros props que el usuario quiera darle, props que no son controlados
               cualquier props no controlado que llege, se añadira automaticamente
    */

    //funcion encargada de cerrar el modal
    const onClose = () => {
        setShow(false); 
    }



    return(
        <Modal className="basic-modal" open={show} onClose={onClose}  {...rest}>
            <Modal.Header>
                <span>{title}</span> <Icon name="close" onClick={onClose} />
            </Modal.Header>
            <Modal.Content>
                {children}
            </Modal.Content>
        </Modal>
    );
}