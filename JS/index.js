function buttonClicked() {
    const button = document.querySelector('.round-button');
    button.classList.add('animate-droplet');

    setTimeout(waterWave, 5);
    afterWave();

    setTimeout(redirect, 1000);


    function waterWave() {
        document.querySelector('.water').style.setProperty('opacity', '1');
        document.querySelector('.water').style.setProperty('animation', 'waterAnim 1s linear forwards');
    }

    function afterWave() {
        document.querySelector('.after-wave').style.setProperty('opacity', '1');
        document.querySelector('.after-wave').style.setProperty('animation', 'waveAnim 1s linear forwards');
    }

    function redirect() {
        location.reload();
        window.location.href = 'collections.html';
    }

    
}

function pageLoaded() {
    document.querySelector('.loaded-wave').style.setProperty('animation', 'loadedWaveAnim 1s linear forwards');
    setTimeout(loadedWater, 175);

    function loadedWater() {
        document.querySelector('.loaded-water').style.setProperty('opacity', '1');
        document.querySelector('.loaded-water').style.setProperty('animation', 'loadedWaterAnim 1s linear forwards');
    }

}

