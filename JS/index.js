const button = document.querySelector('.animated-button');

        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('click', () => {
            gsap.to(button, {
                scale: 0.9,
                duration: 0.1,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
            });

            gsap.to(button, {
                rotationY: 360,
                duration: 0.5,
                ease: 'power2.inOut'
            });
        });