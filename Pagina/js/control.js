let min = 0;
let max = 1;

let primera_generacion = true;
let archivo_subido = false;
let varios_generado = false;
let pix2pix_generado = false;

let val_casillas = [
	$("#number_1"),
	$("#number_2"),
	$("#number_3"),
	$("#number_4"),
	$("#number_5"),
	$("#number_6")
];

let opciones_generacion = [
	$("#pusshen_option"),
	$("#bugcat_option"),
	$("#anime_option"),
	$("#kitty_option"),
	$("#kawaii_option")
]

const archivo_input = $("#input_pix2pix");
const imagen_salida = $("#output_pix2pix");

let model_varios;
let model_pix2pix;
let reader;
let tensor_input_pix2pix;
let vector_input_varios;

$(document).ready(function(){
	
	$("#cargar_bugcat").on("click", function(){
		cargar_modelo_bugcat();
	});

	$("#cargar_pix2pix").on("click", function(){
		cargar_modelo_pix2pix();
	});

	$("#palanca").on("click", function(){
		asyncCall();
		vector_input_varios = generar_aleatorios();
		console.log(vector_input_varios);
	});

	$("#generar_varios").on("click",function(){
		if (typeof vector_input_varios === 'undefined') {
			vector_input_varios = generar_aleatorios();
		}
		//let vector_input_varios_ = one_hot().concat(vector_input_varios, axis=1);
		predecir_varios(vector_input_varios);
	});

	$("#guardar_varios").on("click",function(){
		if(varios_generado){
			alert("Guardando gatito varios");
		}else{
			alert("No se ha generado un gatito :c")
		}
	});

	archivo_input.change(obtener_imagen);

	$("#generar_pix2pix").on("click",function(){
		if (archivo_subido) {
			predecir_pix2pix(tensor_input_pix2pix);
		}else{
			alert("No has subido tu dibujo!");
		}
	});

	$("#guardar_pix2pix").on("click",function(){
		if(pix2pix_generado){
			alert("Guardando gatito pix2pix");
		}else{
			alert("No se ha generado un gatito :c")
		}
	});
})

// Genera el vector de ruido aleatorio
function generar_aleatorios(){
	let vector_aleatorio;

	// Si es la primera generación, cambia la bandera y 
	// crea el vector de 100, mostrando los primeros 6 números
	if (primera_generacion==true){
		primera_generacion = false;
		vector_aleatorio = tf.randomUniform([1, 100], min, max);
		mostrar_numeros(vector_aleatorio);
	// Si no es la primera generación, obtiene los números que puso 
	// el usuario y lo concatena con un vector de 94 aletorio
	}else{
		let primeros = obtener_numeros();
		vector_aleatorio = primeros.concat(tf.randomUniform([1, 94], min, max), axis=1);
	}

	// Regresa el vector
	return vector_aleatorio;
}

// Función que obtiene los números de las casillas en tensor
function obtener_numeros(){
	let numeros = []
	
	val_casillas.forEach(function(elemento){
		numeros.push(parseFloat(elemento.val()));
	});
	
	return tf.tensor([numeros]);	
}

// Función para obtener una imágen
function obtener_imagen() {
	if (!archivo_input.prop('files')[0]) {
		throw new Error("No se encontró la imágen :c");
	}
	const archivo_url = archivo_input.prop('files')[0];

	reader = new FileReader();

	reader.onload = function(event) {
		imagen_salida.attr("src", event.target.result);
		tensor_input = tf.browser.fromPixels(imagen_salida[0]);
		archivo_subido = true;
	};
	
	reader.readAsDataURL(archivo_url);
}

// Función que toma el tensor aleatorio y muestra los elementos
// en las casillas
function mostrar_numeros(vector){
	let numeros_vector = vector.arraySync();
	val_casillas.forEach(function(elemento, indice){
		elemento.val(numeros_vector[0][indice]);
	});
}

// Función para generar el vector one_hot
function one_hot(){
	let vector_one_hot = [];
	opciones_generacion.forEach(function(checkbox){
		if(checkbox.is(":checked")){
			vector_one_hot.push(1);
		}else{
			vector_one_hot.push(0);
		}
	})

	return tf.tensor([vector_one_hot]);
}

// Función para predecir
function predecir_varios(vector_input){
	varios_generado = true;
	alert("generando gatito");
	
	let resultado = model_varios.predict(vector_input);
	resultado = resultado.reshape([128,128,3]);
	resultado = tf.add(resultado,1);
	resultado = resultado.div(2);

	const myCanvas = $("#canva_varios");
	tf.browser.toPixels(resultado, myCanvas[0]).then(() => {
		resultado.dispose();
	});
}

function predecir_pix2pix(vector_input){
	pix2pix_generado = true;
	alert("generando gatito pix2pix");

	let resultado = model_pix2pix.predict(vector_input);
	resultado = resultado.reshape([128,128,3]);
	resultado = tf.add(resultado,1);
	resultado = resultado.div(2);

	const myCanvas = $("#canva_pix2pix");
	tf.browser.toPixels(resultado, myCanvas[0]).then(() => {
		resultado.dispose();
	});
	return resultado;
}

// Función para cargar el modelo
async function cargar_modelo_bugcat(){
	const uploadJSONInput = $('#json_bugcat');
	const uploadWeightsInput = $('#h5_bugcat');

	let lista_archivos = []
	uploadWeightsInput.prop('files').forEach(function(element){
		lista_archivos.push(element)
	});

	model_varios = await tf.loadLayersModel(
		tf.io.browserFiles(
			[uploadJSONInput.prop('files')[0]].concat(lista_archivos)
			)
		);
	model_varios.summary();
}
async function cargar_modelo_pix2pix(){
	const uploadJSONInput = $('#json_pix2pix');
	const uploadWeightsInput = $('#h5_pix2pix');

	let lista_archivos = []
	uploadWeightsInput.prop('files').forEach(function(element){
		lista_archivos.push(element)
	});

	model_pix2pix = await tf.loadLayersModel(
		tf.io.browserFiles(
			[uploadJSONInput.prop('files')[0]].concat(lista_archivos)
			)
		);
	model_pix2pix.summary();
}

// Espera 1 segundo
function esperar_segundo() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 1000);
  });
}

// Animación de la palanquita uwu
async function asyncCall() {
	$("#palanca").attr("src","img/Palanca2.png");
  const result = await esperar_segundo();
  $("#palanca").attr("src","img/Palanca1.png");
}
