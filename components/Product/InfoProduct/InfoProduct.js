import CarouselScreenshots from "../CarouselScreenshots";

export default function InfoProduct(props) {
    const { product } = props;

    return (
        <div className="info-product">
            
            <CarouselScreenshots title={product.title} photos={product.photos}/>
        </div>
    );
}