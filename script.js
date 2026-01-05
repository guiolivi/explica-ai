const inputCheckbox = document.querySelector("#input-checkbox");

inputCheckbox.checked = false;

let darkMode = false;
const switchButton = document.querySelector("#switch-input input");
const simplesLogo = document.querySelector('img[alt="Logo Explica aí (Simples)"]');
const tecnicoLogo = document.querySelector('img[alt="Logo Explica aí (Técnico)"]');

switchButton.addEventListener("change", () => {
    darkMode = !darkMode;

    document.querySelector("#simples").classList.toggle("simples-active");
    document.querySelector("#tecnico").classList.toggle("tecnico-active");

    document.querySelector("#explicar-button_arrow").classList.toggle("arrow-filter");
    document.querySelector("#explicar-button_return__arrow").classList.toggle("arrow-filter");

    document.querySelector("#loading-logo").classList.toggle("inverse-filter");

    if (switchButton.checked) {
        // Técnico ON
        simplesLogo.classList.remove("logo-active");
        simplesLogo.classList.add("logo-hidden");

        tecnicoLogo.classList.add("logo-active");
        tecnicoLogo.classList.remove("logo-hidden");
    } else {
        // Simples ON
        tecnicoLogo.classList.remove("logo-active");
        tecnicoLogo.classList.add("logo-hidden");

        simplesLogo.classList.add("logo-active");
        simplesLogo.classList.remove("logo-hidden");
    }

    document.documentElement.style.setProperty('--primary-color', `var(${darkMode ? '--primary-color_tecnico' : '--primary-color_simples'})`)
    document.documentElement.style.setProperty('--secondary-color', `var(${darkMode ? '--secondary-color_tecnico' : '--secondary-color_simples'})`)
    document.documentElement.style.setProperty('--tertiary-color', `var(${darkMode ? '--tertiary-color_tecnico' : '--tertiary-color_simples'})`)
    document.documentElement.style.setProperty('--extra-color', `var(${darkMode ? '--extra-color_tecnico' : '--extra-color_simples'})`)
    document.documentElement.style.setProperty('--accent-color', `var(${darkMode ? '--accent-color_tecnico' : '--accent-color_simples'})`)
    document.documentElement.style.setProperty('--background-color', `var(${darkMode ? '--background-color_tecnico' : '--background-color_simples'})`)
    document.documentElement.style.setProperty('--box-background-color', `var(${darkMode ? '--box-background-color_tecnico' : '--box-background-color_simples'})`)
    document.documentElement.style.setProperty('--box-outline-color', `var(${darkMode ? '--box-outline-color_tecnico' : '--box-outline-color_simples'})`)
    document.querySelector("")
})

const explicarButton = document.querySelector("#explicar-button");
const explicarButtonReturn = document.querySelector("#explicar-button_return");
const inputText = document.querySelector("#input-text");
const inputSection = document.querySelector("#input");
const loadingSection = document.querySelector("#loading");
const loadingText = document.querySelector("#loading-text");
const outputSection = document.querySelector("#return-output");
const outputTitle = document.querySelector("#output-title");
const outputResponse = document.querySelector("#output-response");

const sections = {
    input: inputSection,
    loading: loadingSection,
    output: outputSection
};

function waitTransitionEnd(el, timeout = 600) {
    return new Promise(resolve => {
        let done = false;
        function onEnd(e) {
            if (e.target !== el) return;
            if (done) return;
            done = true;
            el.removeEventListener('transitionend', onEnd);
            clearTimeout(timer);
            resolve();
        }
        el.addEventListener('transitionend', onEnd);
        const timer = setTimeout(() => {
            if (done) return;
            done = true;
            el.removeEventListener('transitionend', onEnd);
            resolve();
        }, timeout);
    });
}

const phrases = [
    "Compilando a explicação… por favor, não desligue o cérebro",
    "Convertendo confusão em conhecimento estruturado",
    "Analisando o problema em nível quântico de simplicidade",
    "Desmontando o conceito em átomos compreensíveis",
    "Aplicando algoritmo de “explicação para humanos”",
    "Carregando analogias inteligentes…",
    "Transformando “não entendi nada” em “ahhh, agora faz sentido”",
    "Otimizando a explicação para máxima clareza e mínimo esforço mental",
    "Executando função: explicar(como_se_você_tivesse_5_anos)",
    "Sincronizando dados entre caos mental e entendimento absoluto"
]

function randomText() {
    const index = Math.floor(Math.random() * phrases.length)
    return phrases[index]
}

async function showSection(name, display = 'block') {
    const target = sections[name];

    for (const key in sections) {
        const s = sections[key];
        if (s === target) continue;

        if (getComputedStyle(s).display !== 'none') {
            s.classList.add('hidden');
            await waitTransitionEnd(s);
            s.style.display = 'none';
        }
    }

    target.style.display = display;
    target.getBoundingClientRect();
    target.classList.remove('hidden');
    await waitTransitionEnd(target);
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        document.getElementById("explicar-button_return").click();
    }
};

async function explicar(text, mode) {
    const res = await fetch("/api/explicar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text,
            mode
        })
    });

    const data = await res.json();
    return data.result;
}

explicarButton.addEventListener("click", async () => {
    await showSection('loading', 'flex');
    loadingText.innerText = randomText();
    loadingText.style.opacity = 1;

    const mode = switchButton.checked ? "tecnico" : "simples"
    try {
        const result = await explicar(inputText.value, mode);
        outputResponse.innerHTML =
            result || "Desculpa, não foi possível se conectar ao servidor.";
    } catch {
        outputResponse.innerHTML = "Erro ao conectar ao servidor.";
    }
    outputTitle.innerHTML = inputText.value;
    await new Promise(r => setTimeout(r, 5000));
    await showSection('output', 'grid');
})

explicarButtonReturn.addEventListener("click", async () => {
    inputText.value = "";
    loadingText.style.opacity = 0;
    await showSection('input', 'grid');
})