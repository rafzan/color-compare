// class colorCompare {
// }

function ColorPicker(element) {

    this.measure = function(a, b){
        return Math.sqrt( Math.pow((a.r - b.r), 2) + Math.pow((a.g - b.g), 2) + Math.pow((a.b - b.b), 2) );
    }//,
    //convert: 
    this.convert = function(hexColor) {
        const hexTest = RegExp(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (hexTest.test(hexColor)) { 
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
            return {  
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            }
        }
        return false;
    }//,
    //compare:
    this.compare = function(colorsArray, colorInput) {
        let smallestDistance;
        let smallestDistanceColor;

        colorsArray.map(hex => { 
            const calc = this.measure( this.convert(hex), this.convert(colorInput) );
            if (smallestDistance === undefined) {
                smallestDistance = calc
                smallestDistanceColor = hex
            } else {
                if (smallestDistance >= calc) {
                    smallestDistance = calc;
                    smallestDistanceColor = hex;
                }
            }
        }); 
        return {smallestDistance, smallestDistanceColor};
    }


    this.element = element;

    this.init = function() {
        var diameter = 400;//this.element.offsetWidth;

        var canvas = document.createElement('canvas');
        canvas.height = diameter;
        canvas.width = diameter,
        this.canvas = canvas;

        this.renderColorMap();

        element.appendChild(canvas);

        this.setupBindings();
    };

    this.renderColorMap = function() {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');

        var radius = canvas.width / 2;
        var toRad = (2 * Math.PI) / 360;
        var step = 1 / radius;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var cx = cy = radius;
        for(var i = 0; i < 360; i += step) {
            var rad = i * toRad;
            var x = radius * Math.cos(rad),
                y = radius * Math.sin(rad);
            
            ctx.strokeStyle = 'hsl(' + i + ', 100%, 50%)';
           
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.lineTo(cx + x, cy + y);
            ctx.stroke();
        }

				// draw saturation gradient
        var grd = ctx.createRadialGradient(cx,cy,0,cx,cx,radius);
        grd.addColorStop(0,"white");
			  grd.addColorStop(1,'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grd;
        //ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        
        // render the rainbow box here ----------
    };

    this.renderMouseCircle = function(x, y, color) {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');

        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.fillStyle = color;//'rgba(0, 0, 0, 0.5)'
        ctx.lineWidth = '3';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    this.setupBindings = function() {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var self = this;

        // canvas.addEventListener('click', function(e) {
        //     this.draw();
        //     // var x = e.offsetX || e.clientX - this.offsetLeft;
        //     // var y = e.offsetY || e.clientY - this.offsetTop;

        //     // var imgData = ctx.getImageData(x, y, 1, 1).data;
        //     // //var selectedColor = new Color(imgData[0], imgData[1], imgData[2]);
        //     // // do something with this

        //     // self.renderMouseCircle(x, y, `rgba(${imgData[0]}, ${imgData[1]}, ${imgData[2]}, 1)`);
        // }, false);
    };

    function hexToRgb(hexColor){
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
        return rgb = {  
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
    }

    function rgbToHsv(r, g, b){
        r = r/255, g = g/255, b = b/255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if(max == min){
            h = 0; // achromatic
        }else{
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {h: h, s: s, v: v};
    }
    
    this.plotRgb = function(r, g, b) {

    	var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        
        var hsv = rgbToHsv(r, g, b);

        var theta = hsv.h * 2 * Math.PI;
        var maxRadius = canvas.width / 2;
        var radius = hsv.s * maxRadius;
        var x = radius * Math.cos(theta) + maxRadius,
            y = radius * Math.sin(theta) + maxRadius;
        this.renderMouseCircle(x, y, `rgba(${r},${g},${b}, 1)`);        
    }

    this.plotHex = function(hexColor) {
        const rgb = hexToRgb(hexColor);
        this.plotRgb(rgb.r, rgb.g, rgb.b);
    }

    this.plotLine = function(a, b) {
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');

        aRgb = hexToRgb(a);
        bRgb = hexToRgb(b);

        var aHsv = rgbToHsv(aRgb.r, aRgb.g, aRgb.b);
        var bHsv = rgbToHsv(bRgb.r, bRgb.g, bRgb.b);

        var Atheta = aHsv.h * 2 * Math.PI;
        var Btheta = bHsv.h * 2 * Math.PI;

        var maxRadius = canvas.width / 2;

        var Aradius = aHsv.s * maxRadius;
        var Bradius = bHsv.s * maxRadius;

        console.log(aHsv.h, Aradius);

        var aCoord = { x: Aradius * Math.cos(Atheta) + maxRadius, y: Aradius * Math.sin(Atheta) + maxRadius }
        var bCoord = { x: Bradius * Math.cos(Btheta) + maxRadius, y: Bradius * Math.sin(Btheta) + maxRadius }

        ctx.beginPath();
        ctx.moveTo(aCoord.x, aCoord.y);
        ctx.lineTo(bCoord.x, bCoord.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
    this.draw = function (hexList, dominantColor, distance){
        ctx.clearRect(0, 0, diameter, diameter);
        this.init();
        HEXList.forEach(function (color) {plotHex(color);})
        pick.plotLine(distance, dominantColor)
    }

    this.init();
}

var pick = new ColorPicker(document.querySelector('.color-space'));

var RGBList = [
    {'r':255,'g':0,'b':0},
    {'r':0,'g':255,'b':0},
    {'r':0,'g':0,'b':255}, 
    {'r':255,'g':255,'b':0},
    {'r':0,'g':255,'b':255},
    {'r':255,'g':0,'b':255}
];

const HEXList = [ "#ff0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF" ];
let dominantColor = "#ffffaa";
let mappedColor = pick.compare(HEXList, dominantColor);

HEXList.forEach(function (color) {
    pick.plotHex(color);
})

pick.plotHex(dominantColor);
pick.plotLine(mappedColor.smallestDistanceColor, dominantColor)

var canvas = this.canvas;
var ctx = canvas.getContext('2d');
var self = this;
