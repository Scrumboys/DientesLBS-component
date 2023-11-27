class DientesLBS extends HTMLElement {
  constructor() {
    super();
    this._dientesLBS;
    this.attachShadow({ mode: "open" });
  }
  async getData() {
    let txt = "";

    //El siguiente codigo es para obtener el archivo html que contiene el componente
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      //El siguiente if es para verificar que el estado de la petición sea satisfactorio
      if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
        txt = xmlhttp.responseText;
        const shadowRoot = this.shadowRoot;
        shadowRoot.innerHTML = txt;
        this.updateStyle();
        this._dientesLBS = shadowRoot.querySelector("#brush-container");

        gsap.registerPlugin(Draggable);

        const dientes = [];
        const manchas = [];

        const brillitos = shadowRoot.querySelector("#brillos");
        const pastaSola = shadowRoot.querySelector("#pasta1");
        const lenguaSucia = shadowRoot.querySelector("#lenguasucia");
        const botonReiniciar = shadowRoot.querySelector("#BOTON");
        const cepilloConPasta = shadowRoot.querySelector("#cepilloconpasta");
        const tuboPasta = shadowRoot.querySelector("#pasta");
        const sonidoLimpieza = shadowRoot.querySelector("#sonidoLimpieza");
        const sonidoLimpiezaTotal = shadowRoot.querySelector("#sonidoLimpiezaTotal");

        function reiniciarTodo() {
          // Reiniciar la opacidad y el estado de los dientes
          dientes.forEach((diente) => {
            diente.element.style.opacity = 1;
            diente.limpio = false;
          });

          // Reiniciar la opacidad y el estado de las manchas
          manchas.forEach((mancha) => {
            mancha.element.style.opacity = 1;
            mancha.limpio = false;
          });

          // Ocultar elementos adicionales si es necesario

          lenguaSucia.style.opacity = 1;
          brillitos.classList.add("hidden");
          gsap.to(brillitos, { opacity: 0 });

          // Ocultar la pasta y restablecer su opacidad
          pastaSola.classList.add("hidden");
          gsap.to(pastaSola, { opacity: 0 });
        }

        // Evento clic para el botón de reinicio
        botonReiniciar.style.cursor = "pointer";
        botonReiniciar.addEventListener("click", reiniciarTodo);

        for (let i = 1; i <= 32; i++) {
          let diente = shadowRoot.querySelector(`#dientesucio${i}`);
          diente.classList.add("dienteTransicion");
          dientes.push({ element: diente, limpio: false });
        }

        for (let i = 1; i <= 5; i++) {
          let mancha = shadowRoot.querySelector(`#mancha${i}`);
          mancha.classList.add("manchaTransicion");
          manchas.push({ element: mancha, limpio: false });
        }

        gsap.to(pastaSola, { opacity: 0 });
        gsap.to(brillitos, { opacity: 0 });

        Draggable.create(cepilloConPasta, {
          bounds: this._dientesLBS,
          edgeResistance: 0.5,
          onDragStart: function () {
            const targetElement = this.target;
            const parent = targetElement.parentNode;
            parent.insertBefore(targetElement, parent.lastChild);
          },
          onDrag: function () {
            // Obtener la posición de la punta del cepillo (pastasola)
            const pastaSolaRect = pastaSola.getBoundingClientRect();
            lenguaSucia.classList.add("lenguaTransicion");
            // Se Itera sobre los dientes del 1 al 32
            if (!pastaSola.classList.contains("hidden")) {
              for (let i = 0; i < 32; i++) {
                let diente = dientes[i].element;
                let dienteRect = diente.getBoundingClientRect();


                // Si el diente está limpio o no está dentro del área de pastasola, no se cambia la opacidad
                if (dientes[i].limpio || !isInArea(dienteRect, pastaSolaRect)) {
                  continue;
                }

                // Marcar el diente como limpio y cambiar su opacidad
                dientes[i].limpio = true;
                diente.style.opacity = 0;
                sonidoLimpieza.play();
              }
              for (let i = 0; i < 5; i++) {
                let mancha = manchas[i].element;
                let manchaRect = mancha.getBoundingClientRect();

                // Si el diente está limpio o no está dentro del área de pastasola, no se cambia la opacidad
                if (manchas[i].limpio || !isInArea(manchaRect, pastaSolaRect)) {
                  continue;
                }

                // Marcar el diente como limpio y cambiar su opacidad
                manchas[i].limpio = true;
                mancha.style.opacity = 0;
                
              }
              let manchasLimpias = manchas.every((mancha) => mancha.limpio);
              let dientesLimpios = dientes.every((diente) => diente.limpio);
              if (manchasLimpias) {
                lenguaSucia.style.opacity = 0;
                if (dientesLimpios) {
                  brillitos.classList.remove("hidden");
                  sonidoLimpiezaTotal.play();
                  gsap.to(brillitos, {
                    opacity: 1,
                    duration: 1,
                    onComplete: function () {
                      gsap.to(brillitos, { opacity: 0, duration: 1 });
                    },
                  });
                }
              }
            }
          },
          onRelease: function () {
            gsap.to(cepilloConPasta, {
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "power4.inOut",
            });
          },
        });
        Draggable.create(tuboPasta, {
          bounds: this._dientesLBS,
          onDrag: function () {
            const pastaSolaBounding = pastaSola.getBoundingClientRect();
            const boquilla = shadowRoot
              .querySelector("#boquilla-pasta")
              .getBoundingClientRect();
            if (isInArea(boquilla, pastaSolaBounding)) {
              pastaSola.classList.remove("hidden");
              gsap.to(pastaSola, { opacity: 1, duration: 1 });
            }
          },
          onRelease: function () {
            gsap.to(tuboPasta, {
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "power4.inOut",
            });
          },
        });

        // Función para verificar si el diente está dentro del área de pastasola
        function isInArea(dienteRect, pastaSolaRect) {
          return (
            dienteRect.left < pastaSolaRect.right &&
            dienteRect.right > pastaSolaRect.left &&
            dienteRect.top < pastaSolaRect.bottom &&
            dienteRect.bottom > pastaSolaRect.top
          );
        }
      }
    };

    //El siguiente codigo es para obtener el archivo html que contiene el componente
    xmlhttp.open("GET", "components/dientes-lbs/dientes-lbs.html", true);
    xmlhttp.send();
  }

  updateStyle() {
    const { shadowRoot } = this;
    const linkCompontCss = document.createElement("link");
    linkCompontCss.setAttribute("rel", "stylesheet");
    linkCompontCss.setAttribute("href", "components/dientes-lbs/dientes-lbs.css");
    // Attach the created element to the shadow DOM
    shadowRoot.insertBefore(linkCompontCss, shadowRoot.firstChild);
  }

  connectedCallback() {
    this.getData();
  }
  disconnectedCallback() {}
}

//El siguiente codigo es para registrar el componente en el DOM
customElements.define("dientes-lbs", DientesLBS);
