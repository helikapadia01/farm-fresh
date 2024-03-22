import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Draggable from "gsap/Draggable";
import Scrollbar from "smooth-scrollbar";
import SplitType from "split-type";
import MouseFollower from "mouse-follower";

MouseFollower.registerGSAP(gsap);
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

Draggable.create(".carousel", {
    type: "rotation",
    inertia: true,
    minimumMovement: 0,
    snap: function (endValue) {
        var step = 10;
        return Math.round(endValue / step) * step;
    },
    onDrag: function () {
        // Calculate rotation
        var rotation = this.rotation % 360;
        if (rotation < 0) {
            rotation += 360;
        }

        // Calculate index of the image in the center
        var numImages = 6; // Update with the total number of images in your carousel
        var centerIndex = Math.floor(rotation / (180 / numImages));

        // Hide all titles first
        document.querySelectorAll('.centered-title').forEach(function (title) {
            title.style.display = 'none';
        });

        // Show title of the image in the center
        document.querySelector('.carousel .wrapper:nth-child(' + (centerIndex + 1) + ') .centered-title').style.display = 'block';
    }
});

// Function to update title visibility based on currently centered image
function updateCenteredTitle() {
    // Get all the wrappers and titles
    const wrappers = document.querySelectorAll('.carousel .wrapper');
    const titles = document.querySelectorAll('.carousel .centered-title');

    // Find the wrapper that is currently in the center
    let centerWrapper;
    wrappers.forEach(wrapper => {
        const rect = wrapper.getBoundingClientRect();
        if (rect.left <= window.innerWidth / 2 && rect.right >= window.innerWidth / 2) {
            centerWrapper = wrapper;
        }
    });

    // Hide all titles first
    titles.forEach(title => {
        title.style.display = 'none';
    });

    // Show the title of the currently centered wrapper
    if (centerWrapper) {
        const title = centerWrapper.querySelector('.centered-title');
        if (title) {
            title.style.display = 'block';
        }
    }
}

// Call the function when the page loads and when the window is resized
window.addEventListener('load', updateCenteredTitle);
window.addEventListener('resize', updateCenteredTitle);



const cursor = new MouseFollower();
const el = document.querySelector('.wrapper');

el.addEventListener('mouseenter', () => {
    cursor.setText('Drag');
});

el.addEventListener('mouseleave', () => {
    cursor.removeText();
});