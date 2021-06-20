import { Image,Modal } from "semantic-ui-react";
import Slider from "react-slick";
import { map } from "lodash";
import { useState } from "react";

const settings = {
    className:"carousel-screenshots",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    swipeToSlider: true,
};

export default function CarouselScreenshots(props) {
    const {title,photos} = props;
    const [showModal,setShowModal] = useState(false);
    const [urlImage,setUrlImage] = useState(null);

    const openImage = (url) => {
        setUrlImage(url);
        setShowModal(true);
    }


    return (
        <>
            <Slider {...settings}>
                {map(photos, (photos) => (
                    <Image src={photos.url} key={photos.id} alt={photos.name} onClick={() => openImage(photos.url)}/>
                ))}
            </Slider>
            <Modal open={showModal} onClose={() => setShowModal(false)} size="tiny">
                <Image src={urlImage} alt={title} />
            </Modal>
        </>
    );
}