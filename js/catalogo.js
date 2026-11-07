/* Precios de la lista en soles (PEN).
   price: null  -> se cotiza por WhatsApp
   minOrder     -> cantidad mínima que acepta el carrito
*/
const WHATSAPP_NUMBER = "51998364163";

const COLORS = [
  { id: "celeste", name: "Celeste", hex: "#5EC8E6" },
  { id: "negro", name: "Negro", hex: "#1A1C1F" },
  { id: "gris", name: "Gris", hex: "#8D939A" },
];

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "porta-lapiceros", label: "Porta lapiceros" },
  { id: "porta-celulares", label: "Porta celulares" },
  { id: "tarjeteros", label: "Tarjeteros" },
  { id: "llaveros", label: "Llaveros" },
  { id: "decoraciones", label: "Decoraciones" },
  { id: "personajes", label: "Personajes" },
  { id: "maquetas", label: "Maquetas" },
  { id: "modelados", label: "Modelados" },
];

const PRODUCTS = [
  {
    id: "porta-lapicero",
    name: "Porta lapicero",
    category: "porta-lapiceros",
    categoryLabel: "Porta lapiceros",
    price: 19,
    minOrder: 1,
    size: "14 cm de alto",
    cardNote: false,
    image: "img/porta-lapicero.jpg",
    imageAlt: "Porta lapicero impreso en 3D con forma de torso, sobre una mesa de madera",
    summary: "Tamaño 14 cm de alto",
    description:
      "Organizador de escritorio impreso en plástico PLA. Tamaño 14 cm de alto. El modelo de la foto es una muestra: se puede adaptar la forma y el logo.",
  },
  {
    id: "porta-celular",
    name: "Porta celular",
    category: "porta-celulares",
    categoryLabel: "Porta celulares",
    price: 5,
    minOrder: 1,
    size: "9 cm de alto",
    cardNote: false,
    image: "img/porta-celular.png",
    imageAlt: "Dos porta celulares impresos, uno blanco y uno azul, con logo en relieve",
    summary: "9 cm de alto.",
    description:
      "Soporte de escritorio de 9 cm de alto, con canal para el celular y logo en relieve. La marca de la foto es un ejemplo de personalización.",
  },
  {
    id: "tarjetero",
    name: "Porta tarjetas",
    category: "tarjeteros",
    categoryLabel: "Tarjeteros",
    price: 6,
    minOrder: 1,
    size: "12 cm de ancho",
    cardNote: false,
    image: "img/porta-tarjetas.png",
    imageAlt: "Tarjetero negro impreso en 3D con escudo y nombre de marca",
    summary: "12 cm de ancho.",
    description:
      "Porta tarjetas de 12 cm de ancho, impreso en PLA, con frente para escudo o logo. La lista lo publica a S/ 6.00 la unidad. La marca de la foto es una muestra.",
  },
  {
    id: "llavero",
    name: "Llavero Tomatodo",
    category: "llaveros",
    categoryLabel: "Llaveros publicitarios",
    price: 6,
    minOrder: 1,
    size: "10 cm de alto",
    cardNote: false,
    image: "img/hero-tomatodo.jpg",
    imageAlt: "Tomatodo publicitario de 10 cm con asa, tapa y argolla",
    summary: "10 cm de alto.",
    description:
      "Llavero publicitario en forma de tomatodo, de 10 cm de alto, con asa y argolla. Es una pieza promocional en PLA: no es un vaso para bebidas.",
  },
  {
    id: "decoracion",
    name: "Adorno Coliseo",
    category: "decoraciones",
    categoryLabel: "Adornos decorativos",
    price: 9,
    minOrder: 1,
    size: "10 cm de ancho",
    cardNote: false,
    image: "img/hero-coliseo.png",
    imageAlt: "Réplica decorativa del Coliseo impresa en negro sobre una mesa",
    summary: "10 cm de ancho.",
    description:
      "Adorno decorativo del Coliseo, de 10 cm de ancho, impreso en plástico PLA.",
  },
  {
    id: "personaje",
    name: "Personaje de colección",
    category: "personajes",
    categoryLabel: "Muñecos de colección",
    price: 25,
    minOrder: 1,
    size: "17 cm de alto",
    cardNote: false,
    image: "img/hero-personaje.jpg",
    imageAlt: "Figura de colección con capucha, armadura y espada, impresa en negro",
    summary: "17 cm de alto.",
    description:
      "Muñeco de colección impreso en PLA, de 17 cm de alto, con detalle de vestuario y accesorios. La lista lo publica a S/ 25.00 la unidad.",
  },
  {
    id: "maqueta",
    name: "Maqueta arquitectónica",
    category: "maquetas",
    categoryLabel: "Maquetas",
    price: 60,
    minOrder: 1,
    size: "14 cm",
    cardNote: false,
    image: "img/maqueta.png",
    imageAlt: "Maqueta blanca de un conjunto de edificios impresa en 3D",
    summary: "Tamaño 14 cm",
    description:
      "Maqueta a escala para arquitectura y presentaciones. Tamaño 14 cm.",
  },
  {
    id: "modelado",
    name: "Modelado 3D a medida",
    category: "modelados",
    categoryLabel: "Modelados",
    price: null,
    minOrder: 1,
    size: "A medida",
    image: "img/modelado.png",
    imageAlt: "Modelo 3D de una pieza sobre la cama de impresión en el programa de modelado",
    summary: "Tu idea pasa a un archivo listo para imprimir. Se cotiza por WhatsApp.",
    description:
      "Si todavía no tienes el archivo, modelamos la pieza y después la imprimimos en PLA. El servicio se cotiza según la complejidad y se confirma por WhatsApp.",
  },
];
