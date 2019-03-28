function measure(a, b){
	return Math.sqrt( Math.pow((a.r - b.r), 2) + Math.pow((a.g - b.g), 2) + Math.pow((a.b - b.b), 2) );
}	
function convert(hexColor) {
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
}
function compare(colorsArray, colorInput) {
	let smallestDistance;
	let smallestDistanceColor;

	colorsArray.map(hex => { 
		const calc = measure( convert(hex), convert(colorInput) );
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
	return obj = {smallestDistance, smallestDistanceColor};
}

//for test purposes:
const themeColors = [ "#ffffff", "#000000", "#ff0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF" ]
console.log(compare(themeColors, "#FF7755"));