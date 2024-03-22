import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Draggable from "gsap/Draggable";
import Scrollbar from "smooth-scrollbar";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger, Draggable);

const container = document.querySelector(".home-page-wrapper");


const scrollbar = Scrollbar.init(container, {
    damping: 0.075,
    renderByPixel: true,
    effects: true,
});


scrollbar.addListener(ScrollTrigger.update);


ScrollTrigger.scrollerProxy(".home-page-wrapper", {
    scrollTop(value) {
        if (arguments.length) {
            scrollbar.scrollTop = value;
        }
        return scrollbar.scrollTop;
    },
});

ScrollTrigger.scrollerProxy(container, {
    scrollTop(value) {
        if (arguments.length) {
            scrollbar.scrollTop = value;
        }
        return scrollbar.scrollTop;
    },
});

const imageUrls = [
    "/assets/imgs/carousel-img-01.jpeg",
    "/assets/imgs/carousel-img-02.jpeg",
    "/assets/imgs/carousel-img-03.jpeg",
    "/assets/imgs/carousel-img-04.jpeg"
];

let currentImageIndex = 0;
const backgroundImg = document.querySelector('.background-img');
const innerImg = document.querySelector('.inner-img');
const progressSides = document.querySelectorAll('.progress-side');
const currentImgElement = document.querySelector('.current-img');
const allImageCountElement = document.querySelector('.all-image-count');

// Preload images to ensure smooth transitions
imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
});

function startSquareAnimation() {
    gsap.set(progressSides, { clearProps: "all" });

    const tl = gsap.timeline();

    tl.to(progressSides[0], { width: '100%', duration: 0.5 })
        .to(progressSides[1], { height: '100%', duration: 0.5 })
        .to(progressSides[2], { width: '100%', duration: 0.5 })
        .to(progressSides[3], { height: '100%', duration: 0.5, onComplete: changeImages });
}

// function changeImages() {

//     currentImageIndex = (currentImageIndex + 1) % imageUrls.length;


//     gsap.set(backgroundImg, {
//         clipPath: "inset(50% 0 50% 0)",
//         opacity: 1
//     });


//     backgroundImg.src = imageUrls[currentImageIndex];

//     // count chnage animation

//     gsap.to(backgroundImg, {
//         clipPath: "inset(0% 0% 0% 0%)", // Expands to reveal the full image
//         duration: 0.5,
//         ease: "power2.out",
//         onComplete: () => {

//             const nextIndex = (currentImageIndex + 1) % imageUrls.length;
//             innerImg.src = imageUrls[nextIndex];

//             gsap.delayedCall(1, startSquareAnimation);

//             gsap.to(currentImgElement, {
//                 opacity: 1,
//                 duration: 0.75,
//                 ease: 'power1.inOut',
//                 stagger: 0.1,
//                 onComplete: () => {
//                     currentImgElement.textContent = (currentImageIndex + 1).toString().padStart(2, '0');

//                     gsap.fromTo(currentImgElement, { opacity: 0 }, {
//                         opacity: 1,
//                         duration: 0.25,
//                         ease: "power1.inOut"
//                     });
//                 }
//             });

//             allImageCountElement.textContent = imageUrls.length.toString().padStart(2, '0');
//         }
//     });


// }

function changeImages() {
    currentImageIndex = (currentImageIndex + 1) % imageUrls.length;

    gsap.set(backgroundImg, {
        clipPath: "inset(50% 0 50% 0)",
        opacity: 1
    });

    gsap.to(backgroundImg, {
        clipPath: "inset(0% 0% 0% 0%)", // Expands to reveal the full image
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
            backgroundImg.src = imageUrls[currentImageIndex];

            const nextIndex = (currentImageIndex + 1) % imageUrls.length;
            innerImg.src = imageUrls[nextIndex];

            gsap.delayedCall(1, startSquareAnimation);

            gsap.to(currentImgElement, {
                opacity: 1,
                duration: 1.5,
                ease: 'power1.inOut',
                stagger: 0.1,
                onComplete: () => {
                    currentImgElement.textContent = (currentImageIndex + 1).toString().padStart(2, '0');

                    gsap.fromTo(currentImgElement, { opacity: 0 }, {
                        opacity: 1,
                        duration: 1,
                        ease: "power1.inOut"
                    });
                }
            });

            allImageCountElement.textContent = imageUrls.length.toString().padStart(2, '0');
        }
    });
}

backgroundImg.src = imageUrls[0];
innerImg.src = imageUrls[1 % imageUrls.length];

startSquareAnimation();

let tl = gsap.timeline({
    scrollTrigger: {
        trigger: '.quality-products-container',
        start: 'top center',
        scroller: ".home-page-wrapper",
    }
});


let qpTitleTypeSplit = new SplitType('.qp-title', {
    types: 'lines, words',
    tagName: 'span'
});


tl.from('.qp-title .word', {
    y: 50,
    opacity: 0,
    rotationZ: -20,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.05
});


let qpParaTypeSplit = new SplitType('.qp-para', {
    types: 'lines, words',
    tagName: 'span'
});


tl.from('.qp-para', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.05
}, "+=0.5");












