import React from 'react'
import { Carousel } from 'react-bootstrap'

function ImageSlider() {
    return (
        <div className='slider'>
            <Carousel>
                <Carousel.Item interval={1000}>
                    <img
                        className="d-block w-100"
                        src="https://media.istockphoto.com/id/2168846855/photo/historic-mayors-office-in-french-town-hall-of-ambronay-village-with-library-and-wooden.webp?a=1&b=1&s=612x612&w=0&k=20&c=X0BBJ_vZ63ajsxRewTvO8IkGEpUuUHJbceICC6LHRR4="
                        alt="First slide"
                        style={{ height: '500px' }}
                    />
                    <Carousel.Caption>
                        {/*<h3>First slide label</h3>*/}
                        {/*<p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>*/}
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={500}>
                    <img
                        className="d-block w-100"
                        src="https://media.istockphoto.com/id/1498878143/photo/book-stack-and-open-book-on-the-desk-in-modern-public-library.webp?a=1&b=1&s=612x612&w=0&k=20&c=sVkVRw7LMHXr5lJLanrub-oGCompIQPeWbElq4E89G8="
                        alt="Second slide"
                        style={{ height: '500px' }}

                    />
                    <Carousel.Caption>
                        {/*<h3>Second slide label</h3>*/}
                        {/*<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>*/}
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1522407183863-c0bf2256188c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxpYnJhcmF5JTIwYm9va3MlMjBwaG90b3N8ZW58MHx8MHx8fDA%3D"
                        alt="Third slide"
                        style={{ height: '500px' }}

                    />
                    <Carousel.Caption>
                        {/*<h3>Third slide label</h3>*/}
                        {/*<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>*/}
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default ImageSlider