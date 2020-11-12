

class Element {
    constructor(){
        this.shown = true;
        this.children = [];
        this.position(0,0);
        this.size(width,height)
    }
    
    toggle(){
        return this.shown = !this.shown;
    }
    
    position(x, y){
        this.x = x;
        this.y = y;
        return this;
    }
    
    size(w,h){
        this.width = w;
        this.height = h;
        return this;
    }
    
    draw(){
        if(this.shown) this.children.forEach(x=>x.draw())
    }

    on(){
        return true;
    }
    
    click(){
        if(this.children.some(x=>x.shown && x.on() && x.click())) return true;
        return false;
    }
    
    add(e){
        e.parent = this;
        this.children.push(e);
        return e;
    }
    
    addText(text){
        return this.add(new Text(text));
    }
    
    addButton(){
        return this.add(new Button());
    }
    
    addTextButton(text){
        return this.add(new TextButton(text));
    }
}

class Text extends Element{
    constructor(text){
        super();
        this.text = typeof(text) === 'function' ? text : ()=>text;
        this.sw = ()=>{};
        this.s = ()=>noStroke();
        this.f = ()=>fill(255);
        this.w = ()=>textWidth(this.text());
        this.ts = ()=>{
            if(!parent) return;
            let w = this.getWidth();
            if(w > this.parent.width * 0.8){
                textSize(textSize() * this.parent.width * 0.8 / w)
            }
        };
    }
    
    getWidth(){
        return this.w();
    }
    
    strokeWeight(w){
        this.sw = ()=>strokeWeight(w);
        return this;
    }
    
    stroke(...args){
        this.s = ()=>stroke(...args);
        return this;
    }
    
    noStroke(){
        this.s = ()=>noStroke();
    }
    
    fill(...args){
        this.f = ()=>fill(...args);
        return this;
    }
    
    noFill(){
        this.f = ()=>noFill();
        return this;
    }
    
    draw(){
        if(!this.shown) return;
        this.sw()
        this.s()
        this.f()
        this.ts()
        text(this.text(), this.parent.x+this.x+this.parent.width/2
            , this.parent.y+this.y + this.parent.height/1.7)
    }
    
    size(x){
        this.ts = typeof(x) === 'function' ? x : ()=>textSize(x)
        return this;
    }
}

class ColorfulText extends Text{
    constructor(text,renderer){
        super(text);
        
        this.renderer = renderer || (()=>{});
        this.w = ()=>this.text().slice(1).split('').map((t,i)=>{
            this.renderer(i);
            return textWidth(t);
        }).reduce((a,b)=>a+b);
    }
    
    draw(){
        if(!this.shown || this.text().length === 0) return;
        this.sw()
        this.s()
        this.f()
        this.ts()
        textAlign(LEFT, CENTER);
        let width = this.text().split('').map((t,i)=>{
            this.renderer(i);
            return textWidth(t);
        }).reduce((a,b)=>a+b);
        let x = this.parent.x+this.x+(this.parent.width/2)-(width/2);
        let y = this.parent.y+this.y + this.parent.height/1.7;
        this.text().split('').forEach((t,i)=>{
            this.renderer(i);
            text(t,x,y);
            x += textWidth(t);
        })
        textAlign(CENTER, CENTER);
    }
}

class Title extends Text {
    constructor(text){
        super(text);
    }
    
    draw(){
        if(!this.shown) return;
        this.sw()
        this.s()
        this.ts()
        fill(127);
        text(this.text(), this.parent.x+this.x+this.parent.width/2+2
            , this.parent.y+this.y + this.parent.height/1.7+2)
        this.f()
        text(this.text(), this.parent.x+this.x+this.parent.width/2
            , this.parent.y+this.y + this.parent.height/1.7)
    }
}

class Button extends Element{
    constructor(){
        super();
        this.sw = ()=>{};
        this.s = ()=>{};
        this.f = ()=>{};
        this.clicked = ()=>{};
    }
    
    strokeWeight(w){
        this.sw = ()=>strokeWeight(w);
        return this;
    }
    
    stroke(...args){
        this.s = ()=>stroke(...args);
        return this;
    }
    
    noStroke(){
        this.s = ()=>noStroke()
        return this;
    }
    
    fill(...args){
        this.f = ()=>fill(...args);
        return this;
    }
    
    noFill(){
        this.f = ()=>noFill();
        return this;
    }
    
    on(){
        return mouse[0] > this.x && mouse[0] < this.x+this.width 
            && mouse[1] > this.y && mouse[1] < this.y+this.height;
    }
    
    onclicked(f){
        this.clicked = f;
        return this;
    }
    
    click(){
        if(!super.click()) this.clicked(this);
        return true;
    }
    
    draw(){
        if(!this.shown) return;
        this.sw()
        this.s()
        this.f()
        rect(this.x,this.y,this.width,this.height);
        super.draw()
    }
}

class TextButton extends Button{
    constructor(text){
        super();
        this.text = this.addText(text).size(this.height * 0.9);
    }
    
    fillText(...args){
        this.text.fill(...args);
    }
    
    size(w,h){
        if(this.text){
            this.text && this.text.size(h * 0.9)
        }
        
        
        return super.size(w,h);
    }
}