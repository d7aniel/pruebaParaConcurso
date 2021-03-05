import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import {Mundo} from './Mundo.js';
import { NURBSCurve } from 'https://unpkg.com/three@0.122.0/examples/jsm/curves/NURBSCurve.js';

var mundo;
var formas = [];
var geoGuardadas = [];
var geoDestino = [];
var estadoSiguiente = 0;
var estadoActual = 0;

var material;
var materialCanvas;
var rayo = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var pmouse = new THREE.Vector2();
var nucleo1;
var rojo = 1;
var nucleo2;
var verde = 1;
var nucleo3;
var azul = 1;
var material2;

var nucleo1activo = false;
var nucleo2activo = false;
var nucleo3activo = false;
var contextoAR;
function iniciar(){
    mundo = new Mundo();
    //mundo.implementarControles();
    //mundo.iluminarConFoto('./hdr/fondoRedu.png',false);
    mundo.iluminar();

    var canvas = document.getElementById("textura1");
    var texturaDeCanvasDep5 = new THREE.CanvasTexture( canvas );
    materialCanvas = new THREE.MeshBasicMaterial();
    materialCanvas.map = texturaDeCanvasDep5;
    materialCanvas.side = THREE.DoubleSide;
    var geo = new THREE.PlaneBufferGeometry( 5*0.7, 1*0.7, 1, 1 );
    var modelo = new THREE.Mesh(geo,materialCanvas);
    modelo.position.set(0,3.5,0);

    crearIlustraciones();
    const ilustracion = new THREE.Group();
    for(let i=0;i<formas.length;i++){
        formas[i].position.set(formas[i].position.x+2,formas[i].position.y+3,formas[i].position.z);
        ilustracion.add(formas[i]);
    }
    modelo.position.set(modelo.position.x+2,modelo.position.y+3,modelo.position.z);
    ilustracion.add(modelo);
    ilustracion.scale.set(15,15,15);
    ilustracion.position.set(0,-60,0);
    //mundo.escena.add( ilustracion );

    crearMaquinaria();
    const maquina = new THREE.Group();
    nucleo1.position.set(nucleo1.position.x+3,nucleo1.position.y+3,nucleo1.position.z);
    nucleo2.position.set(nucleo2.position.x+3,nucleo2.position.y+3,nucleo2.position.z);
    nucleo3.position.set(nucleo3.position.x+3,nucleo3.position.y+3,nucleo3.position.z);
    maquina.add(nucleo1);
    maquina.add(nucleo2);
    maquina.add(nucleo3);
    maquina.scale.set(20,20,20);
    maquina.position.set(-70,-60,0);
    //maquina.rotation.set(-Math.PI*0.5,0,0);
    //mundo.escena.add( maquina );

    /*var descriptor = contextoAR.crearDescriptor('descriptor/cara');
    descriptor.add(ilustracion);*/
    /*var descriptor = contextoAR.crearDescriptor('descriptor/maquina');
    descriptor.add(maquina);
    var descriptor = contextoAR.crearDescriptor('descriptor/texto');
    descriptor.add(ilustracion);*/
    crearInveractividad();

    mundo.escena.add(maquina);
    mundo.escena.add(ilustracion);
}

function crearInveractividad(){
    document.addEventListener('click',function(event){
        if(estadoSiguiente==estadoActual){
            estadoSiguiente = estadoActual>=2?0:estadoActual+1;
            if(estadoSiguiente==0){
                for(let i=0;i<formas.length;i++){
                    restaurarForma(geoDestino,i);
                    formas[i].geometry.attributes.position.needsUpdate = true;
                }
            }else if(estadoSiguiente==1){
                for(let i=0;i<formas.length;i++){
                    hacerEspiral(formas[i],geoDestino,i);
                    formas[i].geometry.attributes.position.needsUpdate = true;
                }
            }else{
                for(let i=0;i<formas.length;i++){
                    hacerCuadrado(formas[i],geoDestino,i);
                    formas[i].geometry.attributes.position.needsUpdate = true;
                }
            }
        }

    });

    document.addEventListener('touchmove',function(event){
        pmouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    pmouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        material.color.setRGB(0,0,1);
    });

    document.addEventListener('touchstart',function(event){
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        rayo.setFromCamera( mouse, mundo.camara );
	    var objetos = rayo.intersectObjects( mundo.escena.children, true );
        //var objetos = rayo.intersectObjects( modelos );  esta linea pregunta especifcamente si el rayo se choca con los elementos
        //que estan dentro de la lista de modelos
        if(objetos.length>0){
            if(objetos[0].object === nucleo1){
                material.color.setRGB(0,1,0);
/*                var cant = modelos.length;
                var tono = Math.random();
                for(var i=0;i<cant;i++){
                    modelos[i].material.color.setHSL(tono,Math.random(),Math.random());
                }*/
                nucleo1activo = true;
            }else if(objetos[0].object === nucleo2){
                material.color.setRGB(0,1,1);
                //objetos[0].object.material.color.setRGB(Math.random(),Math.random(),Math.random());
                nucleo2activo = true;
            }else if(objetos[0].object === nucleo3){
                material.color.setRGB(1,1,0);
                //objetos[0].object.material.color.setRGB(Math.random(),Math.random(),Math.random());
                nucleo3activo = true;
            }
        }

    });

    document.addEventListener('touchend',function(event){
        nucleo1activo = false;
        nucleo2activo = false;
        nucleo3activo = false;
        material.color.setRGB(1,0,0);
    });
}

function crearMaquinaria(){
    const geometry = new THREE.CylinderGeometry( 0.5, 0.2, 1, 32 );
    geometry.rotateX(Math.PI*0.5);
    const geometryC = new THREE.ConeGeometry( 0.1, 0.3, 32 );
    geometryC.rotateZ(-Math.PI*0.5);
    geometryC.translate(0.7,0,0);



    material2 = new THREE.MeshStandardMaterial( {color: 0xffffff} );
    material2.color.setRGB(rojo,verde,azul);
    nucleo1 = new THREE.Mesh( geometry, material2 );
    const cone1 = new THREE.Mesh( geometryC, material2 );
    nucleo1.add(cone1);
    nucleo2 = new THREE.Mesh( geometry, material2 );
    const cone2 = new THREE.Mesh( geometryC, material2 );
    nucleo2.add(cone2);
    nucleo2.position.y -= 1.5;
    nucleo2.position.x -= 1;
    nucleo3 = new THREE.Mesh( geometry, material2 );
    const cone3 = new THREE.Mesh( geometryC, material2 );
    nucleo3.add(cone3);
    nucleo3.position.y += 1.5;
    nucleo3.position.x -= 1;
}

function crearIlustraciones(){
    const vertices = [];
	const divisions = 25;
	for ( let i = 0; i <= divisions; i ++ ) {
		const v = ( i / divisions ) * ( Math.PI * 2 );
		const x = Math.cos( v );
		const y = Math.sin( v );
		vertices.push( x, y, 0 );
	}
	const geoCirculo = new THREE.BufferGeometry();
	geoCirculo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    material = new THREE.LineBasicMaterial( {	color: 0xffffff } );
    material.color.setRGB(rojo,verde,azul);
    const verticesElipse = [];
    const ini = -Math.PI*0.1;
    const med = Math.PI * 2-Math.PI*0.1*2;
    const fin = Math.PI * 2-Math.PI*0.1*3;
	for ( let i = 0; i <= divisions; i ++ ) {
		const v = THREE.MathUtils.mapLinear(i,0, divisions,ini,fin  );
		const x = 1.5*Math.cos( v );
		const y = Math.sin( v );
		verticesElipse.push( x, y, 0 );
	}
    verticesElipse.push(1.5*Math.cos( fin ),Math.sin( fin ),0);
    verticesElipse.push(1.5*1.5*Math.cos( med ),1.5*Math.sin( med ),0);
    verticesElipse.push(1.5*Math.cos( ini ),Math.sin( ini ),0);

    const geoConversacion = new THREE.BufferGeometry();
    geoConversacion.setAttribute( 'position', new THREE.Float32BufferAttribute( verticesElipse, 3 ) );

    const cuerpox = [0,0,0.25,0.5,0.75,1.5,2,3   ];
    const cuerpoy = [-2  ,0.5 ,1     ,1.25    ,1.50   ,1.75      ,2      ,2.25   ];
    const anchoIzq = [1,0.5 ,0.4   ,0.25   ,0.25   ,0.6    ,0.7];
    const anchoDer = [1,0.5 ,0.4   ,0.25   ,0.25   ,0.6    ,0.7];

    formasLinealesSimetricas(cuerpox,cuerpoy,anchoIzq,anchoDer,mundo,formas);

    /////////////////// NARIZ
    /*const narizx = [1.2,1.2,1.85,3];
    const narizy = [1.85,1,1.95,2.25];*/

    const points = [];
    points.push( new THREE.Vector3( 1.2, 1.85, Math.random() * 0.5 ) );
    points.push( new THREE.Vector3( 1.17, 0.5, Math.random() * 0.5 ) );
    points.push( new THREE.Vector3( 1.5, 1.95, Math.random() * 0.5 ) );
    points.push( new THREE.Vector3( 2.5, 2.25, Math.random() * 0.5 ) );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    //const materialNariz = new THREE.LineBasicMaterial( { color: 0xffffff } );
    const lineaNariz = new THREE.Line( geometry, material );

    ///////////////////////// OJOS
    const line1 = new THREE.Line( geoCirculo, material );
	line1.scale.setScalar( 0.1 );
    line1.position.set(1.8, 1.7,0.2);
    formas.push(line1);

    const line2 = new THREE.Line( geoCirculo, material );
	line2.scale.setScalar( 0.2 );
    line2.position.set(1.6, 2.2,0.3);
    formas.push(line2);


    const lineConversacion = new THREE.Line( geoConversacion, material );
	lineConversacion.scale.setScalar( 0.5 );
    lineConversacion.position.set(-0.5, 2.5,0);
    formas.push(lineConversacion);

    const garabatox = [];
    const garabatoy = [];
    for(let i=0;i<35;i++){
        garabatox.push(-0.4+Math.random() * 0.8);
        garabatoy.push(-0.4+Math.random() * 0.8);
    }
    formasLineales(garabatox,garabatoy,mundo,-0.5, 2.5,0,formas);
    formas.push(lineaNariz);
}

function formasLinealesSimetricas(puntosx,puntosy,anchoIzq,anchoDer,unMundo,formas){
    const cuerpox_1 = [];
    const cuerpoy_1 = [];
    const cuerpox_2 = [];
    const cuerpoy_2 = [];
    //cuerpox = { -0.5,-0.5,-0.25,-0.25,-0.75,-0.75,0.75,0.75,0.25,0.25,0.5,0.5 };
    //cuerpoy = { 2   ,-1  ,-1.5 ,-1.75,-2   ,-2.5   ,-2.5,-2,-1.75,-1.5,-1,2 };
    for ( let i = 0; i<puntosx.length-1; i ++ ) {
        let a = Math.atan2(puntosy[i+1]-puntosy[i],puntosx[i+1]-puntosx[i])+Math.PI*0.5;
        let dxIzq = anchoIzq[i]*Math.cos(a);
        let dyIzq = anchoIzq[i]*Math.sin(a);
        let dxDer = anchoDer[i]*Math.cos(a+Math.PI);
        let dyDer = anchoDer[i]*Math.sin(a+Math.PI);
        cuerpox_1.push( puntosx[i]+dxIzq );
        cuerpoy_1.push( puntosy[i]+dyIzq );
        cuerpox_2.push( puntosx[i]+dxDer );
        cuerpoy_2.push( puntosy[i]+dyDer );
    }
    ////////////////////////
    const cx = [];
    const cy = [];
    for ( let i = 0; i<cuerpox_1.length; i ++ ) {
        cx.push(cuerpox_1[i]);
        cy.push(cuerpoy_1[i]);
    }
    for ( let i = cuerpox_2.length-1; i>=0; i-- ) {
        cx.push(cuerpox_2[i]);
        cy.push(cuerpoy_2[i]);
    }
    formasLineales(cx,cy,unMundo,0,0,0,formas);

}


function formasLineales(cx,cy,unMundo,x,y,z,formas){
    ///////////////////////
    const nurbsControlPoints = [];
	const nurbsKnots = [];
	const nurbsDegree = 3;
	for ( let i = 0; i <= nurbsDegree; i ++ ) {
		nurbsKnots.push( 0 );
	}

	for ( let i = 0, j = cx.length; i < j; i ++ ) {
        nurbsControlPoints.push(
            new THREE.Vector4(
				cx[i],
				cy[i],
				-0.25+Math.random() * 0.5,
				1 // weight of control point: higher means stronger attraction
			)
		);
		const knot = ( i + 1 ) / ( j - nurbsDegree );
		nurbsKnots.push( THREE.MathUtils.clamp( knot, 0, 1 ) );
	}

	const nurbsCurve = new NURBSCurve( nurbsDegree, nurbsKnots, nurbsControlPoints );
	const nurbsGeometry = new THREE.BufferGeometry();
	nurbsGeometry.setFromPoints( nurbsCurve.getPoints( 100 ) );
	//const nurbsMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
	const nurbsLine = new THREE.Line( nurbsGeometry, material );
	nurbsLine.position.set( x,y,z );
    formas.push(nurbsLine);
}



function animar(){
    requestAnimationFrame(animar);
    materialCanvas.map.needsUpdate = true;
    mundo.dibujar();

    if(estadoSiguiente!=estadoActual){
        let diff = 0;
        for(let i=0;i<formas.length;i++){
            for(let j=0;j<geoDestino[i].length;j++){
                diff += Math.abs(formas[i].geometry.attributes.position.array[j]-geoDestino[i][j]);
                formas[i].geometry.attributes.position.array[j]=THREE.MathUtils.lerp(formas[i].geometry.attributes.position.array[j],
                    geoDestino[i][j],0.05);
                    formas[i].geometry.attributes.position.needsUpdate = true;
            }
        }

        if(diff<=0.1){
            estadoActual = estadoSiguiente;
            for(let i=0;i<formas.length;i++){
                formas[i].geometry.attributes.position.needsUpdate =  false;
            }
        }
    }
/*
    if(nucleo3activo){
        let diff = mouse.y - pmouse.y;
        nucleo3.rotation.z=diff>0?nucleo3.rotation.z+0.01:diff<0?nucleo3.rotation.z-0.01:nucleo3.rotation.z;
        rojo = diff>0?rojo-0.01:diff<0?rojo+0.01:rojo;
        rojo = THREE.MathUtils.clamp(rojo,0,1);
        mouse.y = pmouse.y;
        material2.color.setRGB(rojo,verde,azul);
        material.color.setRGB(rojo,verde,azul);
    }
    if(nucleo1activo){
        let diff = mouse.y - pmouse.y;
        nucleo1.rotation.z=diff>0?nucleo1.rotation.z+0.01:diff<0?nucleo1.rotation.z-0.01:nucleo1.rotation.z;
        verde = diff>0?verde-0.01:diff<0?verde+0.01:verde;
        verde = THREE.MathUtils.clamp(verde,0,1);
        mouse.y = pmouse.y;
        material2.color.setRGB(rojo,verde,azul);
        material.color.setRGB(rojo,verde,azul);
    }
    if(nucleo2activo){
        let diff = mouse.y - pmouse.y;
        nucleo2.rotation.z=diff>0?nucleo2.rotation.z+0.01:diff<0?nucleo2.rotation.z-0.01:nucleo2.rotation.z;
        azul = diff>0?azul-0.01:diff<0?azul+0.01:azul;
        azul = THREE.MathUtils.clamp(azul,0,1);
        mouse.y = pmouse.y;
        material2.color.setRGB(rojo,verde,azul);
        material.color.setRGB(rojo,verde,azul);
    }*/
}

function hacerEspiral(unaForma,geoDestino,queForma){
    var cantidad = unaForma.geometry.attributes.position.array.length/3;
    var p1 = [1000,1000,1000]
    var p2 = [-1000,-1000,-1000]
    for(let i=0;i<cantidad;i++){
        p1[0] = p1[0]<unaForma.geometry.attributes.position.array[i*3]?p1[0]:unaForma.geometry.attributes.position.array[i*3];
        p1[1] = p1[1]<unaForma.geometry.attributes.position.array[i*3+1]?p1[1]:unaForma.geometry.attributes.position.array[i*3+1];
        p1[2] = p1[2]<unaForma.geometry.attributes.position.array[i*3+2]?p1[2]:unaForma.geometry.attributes.position.array[i*3+2];
        p2[0] = p2[0]>unaForma.geometry.attributes.position.array[i*3]?p2[0]:unaForma.geometry.attributes.position.array[i*3];
        p2[1] = p2[1]>unaForma.geometry.attributes.position.array[i*3+1]?p2[1]:unaForma.geometry.attributes.position.array[i*3+1];
        p2[2] = p2[2]>unaForma.geometry.attributes.position.array[i*3+2]?p2[2]:unaForma.geometry.attributes.position.array[i*3+2];
    }
    var radio = Math.max(Math.abs(p1[0]-p2[0])/2,Math.abs(p1[1]-p2[1])/2);
    var geoGuardar = [];
    var geoD = [];
    for(let i=0;i<cantidad;i++){
        geoGuardar[i*3] = unaForma.geometry.attributes.position.array[i*3];
        geoGuardar[i*3+1] = unaForma.geometry.attributes.position.array[i*3+1];
        geoGuardar[i*3+2] = unaForma.geometry.attributes.position.array[i*3+2];
        let mag = THREE.MathUtils.mapLinear(i,0,cantidad,0,radio);
        let angulo = THREE.MathUtils.mapLinear(i,0,cantidad,0,Math.PI*8);
        let x = mag*Math.cos(angulo);
        let y = mag*Math.sin(angulo);
        let z = THREE.MathUtils.mapLinear(i,0,cantidad,p1[2],p2[2]);
        geoD[i*3]=x;
        geoD[i*3+1]=y;
        geoD[i*3+2]=z;
    }
    geoDestino[queForma]=geoD;
    geoGuardadas[queForma]=geoGuardar;
}

function restaurarForma(geoDestino,queForma){
    let geoD = [];
    for(let i=0;i<geoGuardadas[queForma].length;i++){
        geoD[i]=geoGuardadas[queForma][i];
    }
    geoDestino[queForma] = geoD;
}

function hacerCuadrado(unaForma,geoDestino,queGeo){
    var cantidad = unaForma.geometry.attributes.position.array.length/3;
    var cantidadPorLado = parseInt(cantidad/4);
    var total = cantidad/4>cantidadPorLado?cantidadPorLado*3+cantidadPorLado+1:cantidadPorLado*4;
    var p1 = [1000,1000,1000]
    var p2 = [-1000,-1000,-1000]
    for(let i=0;i<cantidad;i++){
        p1[0] = p1[0]<unaForma.geometry.attributes.position.array[i*3]?p1[0]:unaForma.geometry.attributes.position.array[i*3];
        p1[1] = p1[1]<unaForma.geometry.attributes.position.array[i*3+1]?p1[1]:unaForma.geometry.attributes.position.array[i*3+1];
        p1[2] = p1[2]<unaForma.geometry.attributes.position.array[i*3+2]?p1[2]:unaForma.geometry.attributes.position.array[i*3+2];
        p2[0] = p2[0]>unaForma.geometry.attributes.position.array[i*3]?p2[0]:unaForma.geometry.attributes.position.array[i*3];
        p2[1] = p2[1]>unaForma.geometry.attributes.position.array[i*3+1]?p2[1]:unaForma.geometry.attributes.position.array[i*3+1];
        p2[2] = p2[2]>unaForma.geometry.attributes.position.array[i*3+2]?p2[2]:unaForma.geometry.attributes.position.array[i*3+2];
    }

    let geoD = [];
    hacerLinea(geoD
        ,0,cantidadPorLado,p1[0],p1[1],p1[2],p1[0],p2[1],p1[2]);
    hacerLinea(geoD
        ,cantidadPorLado,cantidadPorLado*2,p1[0],p2[1],p1[2],p2[0],p2[1],p2[2]);
    hacerLinea(geoD
        ,cantidadPorLado*2,cantidadPorLado*3,p2[0],p2[1],p2[2],p2[0],p1[1],p1[2]);
    hacerLinea(geoD
        ,cantidadPorLado*3,cantidad,p2[0],p1[1],p1[2],p1[0],p1[1],p2[2]);

    geoDestino[queGeo] = geoD;
}

function hacerLinea(geo,puntoInicial,puntoFinal,xini,yini,zini,xfin,yfin,zfin){
    for(let i=puntoInicial;i<puntoFinal;i++){
        let x = THREE.MathUtils.mapLinear(i,puntoInicial,puntoFinal,xini,xfin);
        let y = THREE.MathUtils.mapLinear(i,puntoInicial,puntoFinal,yini,yfin);
        let z = THREE.MathUtils.mapLinear(i,puntoInicial,puntoFinal,zini,zfin);
        geo[i*3]=x;
        geo[i*3+1]=y;
        geo[i*3+2]=z;
    }
}

function ejecutarThree(){
    iniciar();
    animar();
}

setTimeout(ejecutarThree,2000);
