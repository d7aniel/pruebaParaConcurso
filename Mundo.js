import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';
export class Mundo{
    constructor(){
        this.camara = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camara.position.set(0,0,100);
        this.camara.rotation.set(0,0,0);
        this.escena = new THREE.Scene();
        this.escena.background = new THREE.Color(0x191919);
        this.renderizador = new THREE.WebGLRenderer( { antialias: true } );
        this.renderizador.setPixelRatio( window.devicePixelRatio );
        this.renderizador.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderizador.domElement );
    }

    dibujar(){
        this.renderizador.render(this.escena,this.camara);
    }

    iluminar(){

        const luz1 = new THREE.PointLight( 0xffffff, 2, 100 );
        luz1.position.set(20,20,40);
        this.escena.add( luz1 );

        const luz2 = new THREE.PointLight( 0xffffff, 1, 100 );
        luz2.position.set(20,20,-40);
        this.escena.add( luz2 );

        const ambiental = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.escena.add( ambiental );
    }

    implementarControles(){
        this.controls = new OrbitControls( this.camara, this.renderizador.domElement );
    }
}
