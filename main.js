const fs = require("fs")
let file = process.argv[2]
if(file==null||!fs.existsSync(file)){
	console.log("please provide a file (idiot)")
	process.exit(-8008)
}
function shuffle(array) {
	//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
function css_parse(content){
	let split = [];
	let head = "";
	let current = "";
	let open = 0;
	for(let c of content){
		if(c=='{'){
			open++;
		}
		if(open==0){
			head+=c;
		}
		if(open>0){
			current+=c;
		}
		if(c=='}'){
			open--;
			if(open==0){
				current = current.slice(1).slice(0,-1)
				split.push({head:head,content:current})
				current="";
				head="";
			}
		}

	}
	return split;
}
function r_sizing(css){
	let units = ["cm","mm","Q","in","pc","pt","px","em",
		"ex","ch","rem","lh","rlh","vw","vh","vmin","vmax",
		"vb","vi","svw","svh","lvw","lvh","dvw","dvh","%"]	
	for(let c in css){
		let split = (css[c].content.replace(/\n/g,'').split(';')).filter(function (e) {return e !== "";})
		for(let s in split){
			for(let u of units){
				let reg = new RegExp("\\d+(\\.\\d+)?"+u,"g")
				while(match = reg.exec(split[s])){
					split[s] = split[s].substring(0,match.index+match[0].length-u.length) + 
						units[Math.floor(Math.random()*units.length)] + split[s].substring(match.index+match[0].length,split[s].length)
				}
				
			}	
		}
		css[c].content = shuffle(split).join(';')+';'
	}
	return css;
}
function r_const(css){
	let out = "";
	for(let c of css){
		out+=c.head+"{"+c.content+"}"
	}
	return out;
}

console.log(r_const(shuffle(r_sizing(css_parse(fs.readFileSync(file).toString())))))
