var texto = [];
function setup(){
    var c = createCanvas(500,100);
    texto[0] = "Habia una vez....";
    texto[1] = "..y luego pasaron cosas....";
    texto[2] = ".... y todo termina cuando... fin";
    c.canvas.id = "textura1";
    c.canvas.style.display = 'none';
    textAlign(CENTER,CENTER);

}

function draw(){
    background(50);
    fill(255);
    textSize(30);
    text(texto[0],width/2,height/2);
}
