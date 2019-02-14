class Fire {
    constructor(ratioWidth, ratioHeight, time) {
        this.firePixelsArray = [];
        this.time = time;
        this.ratioWidth = ratioWidth;
        this.ratioHeight = ratioHeight;
        this.fireWidth = Math.round(window.innerWidth / this.ratioWidth);
        this.fireHeight = Math.round(window.innerHeight / this.ratioHeight);

        this.fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        this.canvas.width = this.fireWidth;
        this.canvas.height = this.fireHeight;
        this.image = this.ctx.createImageData(this.fireWidth, this.fireHeight);

        this.calculateFirePropagation = this.calculateFirePropagation.bind(this);
        this.update = this.renderFire.bind(this);
        requestAnimationFrame(this.update);

        this.start();
    }

    start() {
        this.createFireDataStructure();
        this.createFireSource();

        setInterval(this.calculateFirePropagation, this.time);
    }

    createFireDataStructure() {
        const numberOfPixels = this.fireWidth * this.fireHeight

        for (let i = 0; i < numberOfPixels; i++) {
            this.firePixelsArray[i] = 0;
        }
    }

    calculateFirePropagation() {
        for (let column = 0; column < this.fireWidth; column++) {
            for (let row = 0; row < this.fireHeight; row++) {
                const pixelIndex = column + ( this.fireWidth * row );

                this.updateFireIntensityPerPixel(pixelIndex);
            }
        }

        this.renderFire();
    }

    updateFireIntensityPerPixel(currentPixelIndex) {
        const belowPixelIndex = currentPixelIndex + this.fireWidth

        if (belowPixelIndex >= this.fireWidth * this.fireHeight) return;

        const decay = Math.floor(Math.random() * 3);
        const belowPixelFireIntensity = this.firePixelsArray[belowPixelIndex];
        const newFireIntensity = belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;

        this.firePixelsArray[currentPixelIndex - decay] = newFireIntensity;
    }

    renderFire() {
        for (let pixelIndex = 0; pixelIndex < this.firePixelsArray.length; pixelIndex++) {
            const fireIntensity = this.firePixelsArray[pixelIndex]
            const color = this.fireColorsPalette[fireIntensity]

            this.image.data[pixelIndex * 4] = color.r;
            this.image.data[pixelIndex * 4 + 1] = color.g;
            this.image.data[pixelIndex * 4 + 2] = color.b;
            this.image.data[pixelIndex * 4 + 3] = 255;
        }

        this.ctx.putImageData(this.image, 0, 0);
    }

    createFireSource() {
        for (let column = 0; column <= this.fireWidth; column++) {
            const overflowPixelIndex = this.fireWidth * this.fireHeight;
            const pixelIndex = (overflowPixelIndex - this.fireWidth) + column;

            this.firePixelsArray[pixelIndex] = this.fireColorsPalette.length - 1;
        }
    }

    destroyFireSource() {
        for (let column = 0; column <= this.fireWidth; column++) {
            const overflowPixelIndex = this.fireWidth * this.fireHeight;
            const pixelIndex = (overflowPixelIndex - this.fireWidth) + column;

            this.firePixelsArray[pixelIndex] = 0;
        }
    }

    increaseFireSource() {
        for (let column = 0; column <= this.fireWidth; column++) {
            const overflowPixelIndex = this.fireWidth * this.fireHeight;
            const pixelIndex = (overflowPixelIndex - this.fireWidth) + column;
            const currentFireIntensity = this.firePixelsArray[pixelIndex];

            if (currentFireIntensity < this.fireColorsPalette.length - 1) {
                const increase = Math.floor(Math.random() * 14);
                const newFireIntensity = currentFireIntensity + increase >= this.fireColorsPalette.length - 1 ? this.fireColorsPalette.length - 1 : currentFireIntensity + increase;
                this.firePixelsArray[pixelIndex] = newFireIntensity;
            }
        }
    }

    decreaseFireSource() {
        for (let column = 0; column <= this.fireWidth; column++) {
            const overflowPixelIndex = this.fireWidth * this.fireHeight;
            const pixelIndex = (overflowPixelIndex - this.fireWidth) + column;
            const currentFireIntensity = this.firePixelsArray[pixelIndex];

            if (currentFireIntensity > 0) {
                const decay = Math.floor(Math.random() * 14);
                const newFireIntensity = currentFireIntensity - decay >= 0 ? currentFireIntensity - decay : 0;
                this.firePixelsArray[pixelIndex] = newFireIntensity;
            }
        }
    }

}

new Fire(4, 20, 20);
