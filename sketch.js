let canva;
let mouse = [];
let tables = new Map();
let selected;
//let font;

let width = 400, height = 640;

/*
function preload() {
    //font = loadFont("./arial.ttf");
}
*/

function setup() {
    createCanvas(width,height);
    canva = lib.getDom('defaultCanvas0');
    l = lib.createDom('label');
    document.body.appendChild(l);
    
    canva.onmousemove = function(e) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        l.innerText = 'X: ' + x + ', Y: ' + y;
        mouse = [x,y]
    }
    
    canva.onmouseup = function(e) {
        for(let x of tables.values()){
            if(x.shown && x.on() && x.click()){
                return;
            }
        }
    }
    textAlign(CENTER, CENTER);
}

function draw() {
    background(255,200,84);
    tables.forEach(x=>x.draw())
}

class Tree{
    constructor(self,left,right){
        this.self = self;
        (this.left = left) && (this.left.parent = this);
        (this.right = right) && (this.right.parent = this)
    }
    
    toString(){
        if(this.self === 'start') return '';
        let p = this.parent.toString();
        return p === '' ? this.self : p+'‧'+this.self;
    }
}
let tree = (a,b,c)=>new Tree(a,b,c)

tree = tree('start'
    ,tree('正餐')
    ,tree('點心'
        ,tree('中式')
        ,tree('日式'
            ,tree('甜的')
            ,tree('鹹的'
                ,tree('熱的'
                    ,tree('烤的')
                    ,tree('炸的'))
                ,tree('冰的')))))

function goTo(str){
    table.toggle();
    if(str === 'IDK') str = 'home';
    table = tables.get(str);
    table.shown = true;
    return true;
}

tables.set('back', table = new Element());
table.addTextButton('Home').position(300,600).size(100,40).noFill().noStroke().onclicked(()=>goTo('home'))

tables.set('home', table = new Element());
table.add(new Title('今天吃什麼')).position(2,-300).size(64);
table.addTextButton('開始').stroke(0).strokeWeight(2).position(0,480).size(200,60).fill(254,172,0).onclicked(()=>goTo('start'));
table.addTextButton('設定').stroke(0).strokeWeight(2).position(200,480).size(200,60).fill(254,172,0).onclicked(b=>console.log(b.text.text())).addText('(未實裝)').position(75,15).size(12).fill(255)

function build(t){
    if(!t) return;
    let table;
    tables.set(t.self,table = new Element());
    table.shown = false;
    table.add(new Title('我想來點...')).position(2,-300).size(64);
    
    table.add(new ColorfulText(t.toString(),i=>i >= t.toString().length-2 ? fill(255) : fill(0))).position(2,-200);
    table.addTextButton(t.left ? t.left.self : 'IDK').stroke(0).strokeWeight(2).position(0,480).size(200,60).fill(254,172,0).onclicked(x=>goTo(x.text.text())&&(selected = t.left))
    table.addTextButton(t.right ? t.right.self : 'IDK').stroke(0).strokeWeight(2).position(200,480).size(200,60).fill(254,172,0).onclicked(x=>goTo(x.text.text())&&(selected = t.right))
    build(t.left);
    build(t.right);
}

build(tree);


table = tables.get('home')