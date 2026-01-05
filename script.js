import Groq from 'https://cdn.jsdelivr.net/npm/groq-sdk@0.37.0/+esm'

const inputCheckbox = document.querySelector("#input-checkbox");

inputCheckbox.checked = false;

let darkMode = false;
const switchButton = document.querySelector("#switch-input input");

switchButton.addEventListener("change", () => {
    darkMode = !darkMode;
    prompt = switchButton.checked ?
`Você é uma Inteligência Artificial com um único propósito: Analisar o prompt dado e retornar
uma definação em palavras técnicas dele, em pelo menos 3 parágrafos. O seu objetivo é ajudar
pessoas de áreas técnicas (como programação, engenheiros, advogados, etc.), então defina o termo
de maneira técnica e extensa mas didática. Além disso, aja impessoalmente, ou seja, o seu único
objetivo é definir termos, sem nenhuma opinião própria ou nota de observação. Isso quer dizer que
você funciona como um dicionário melhorado, não como um assistente de Inteligência Artificial.
                    
Regras:
Use linguagem HTML para todas as suas respostas, independente do que for. Para textos em
negrito use a tag HTML b com o seu texto dentro, para itálico, use a tag HTML i com o seu
texto dentro, e para pular um parágrafo, utilize outro elemento p.
Não faça títulos nem subtítulos.
Não escreva "Definição do Termo" ou coisas parecidas, responda diretamente ao prompt, explicando
seus possíveis significados em diferentes contextos.`

:

`Você é uma Inteligência Artificial com um único propósito: Analisar o prompt dado e retornar
uma definação em palavras simples dele, em pelo menos 2 parágrafos. O seu objetivo é ajudar
pessoas de todos os tipos (pessoas com ou sem deficiência), então defina o termo de maneira
simples mas didática. Além disso, aja impessoalmente, ou seja, o seu único objetivo é definir
termos, sem nenhuma opinião própria ou nota de observação. Isso quer dizer que você funciona
como um dicionário melhorado, não como um assistente de Inteligência Artificial.
                        
Regras:
Use linguagem HTML para todas as suas respostas, independente do que for. Para textos em
negrito use a tag HTML b com o seu texto dentro, para itálico, use a tag HTML i com o seu
texto dentro, e para pular um parágrafo, utilize outro elemento p.
Não faça títulos nem subtítulos.
Não escreva "Definição do Termo" ou coisas parecidas, responda diretamente ao prompt, explicando
seus possíveis significados em diferentes contextos.`;

    document.querySelector("#tecnico").classList.toggle("simples-active");

    document.documentElement.style.setProperty('--primary-color', `var(${darkMode ? '--primary-color_tecnico' : '--primary-color_simples'})`)
    document.documentElement.style.setProperty('--secondary-color', `var(${darkMode ? '--secondary-color_tecnico' : '--secondary-color_simples'})`)
    document.documentElement.style.setProperty('--tertiary-color', `var(${darkMode ? '--tertiary-color_tecnico' : '--tertiary-color_simples'})`)
    document.documentElement.style.setProperty('--accent-color', `var(${darkMode ? '--accent-color_tecnico' : '--accent-color_simples'})`)
    document.documentElement.style.setProperty('--background-color', `var(${darkMode ? '--background-color_tecnico' : '--background-color_simples'})`)
    document.documentElement.style.setProperty('--box-background-color', `var(${darkMode ? '--box-background-color_tecnico' : '--box-background-color_simples'})`)
    document.documentElement.style.setProperty('--box-outline-color', `var(${darkMode ? '--box-outline-color_tecnico' : '--box-outline-color_simples'})`)

})

const explicarButton = document.querySelector("#explicar-button");
const explicarButtonReturn = document.querySelector("#explicar-button_return");
const inputText = document.querySelector("#input-text");
const inputSection = document.querySelector("#input");
const loadingSection = document.querySelector("#loading");
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

let prompt =
`Você é uma Inteligência Artificial com um único propósito: Analisar o prompt dado e retornar
uma definação em palavras simples dele, em pelo menos 2 parágrafos. O seu objetivo é ajudar
pessoas de todos os tipos (pessoas com ou sem deficiência), então defina o termo de maneira
simples mas didática. Além disso, aja impessoalmente, ou seja, o seu único objetivo é definir
termos, sem nenhuma opinião própria ou nota de observação. Isso quer dizer que você funciona
como um dicionário melhorado, não como um assistente de Inteligência Artificial.

Regras:
Use linguagem HTML para todas as suas respostas, independente do que for. Para textos em
negrito use a tag HTML b com o seu texto dentro, para itálico, use a tag HTML i com o seu
texto dentro, e para pular um parágrafo, utilize outro elemento p.
Não faça títulos nem subtítulos.
Não escreva "Definição do Termo" ou coisas parecidas, responda diretamente ao prompt, explicando
seus possíveis significados em diferentes contextos.`

const groq = new Groq({ apiKey: groqAPIKey, dangerouslyAllowBrowser: true });

async function main() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: prompt,
            },
            {
                role: "user",
                content: inputText.value,
            }
        ],
        model: "llama-3.1-8b-instant",
    });
}

explicarButton.addEventListener("click", async () => {
    await showSection('loading', 'flex');
    main().then(res => {
        outputResponse.innerHTML = res.choices[0]?.message?.content || "Desculpa, não foi possível se conectar ao servidor.";
    });
    outputTitle.innerHTML = inputText.value;
    await new Promise(r => setTimeout(r, 5000));
    await showSection('output', 'grid');
})

explicarButtonReturn.addEventListener("click", async () => {
    inputText.value = "";
    await showSection('input', 'grid');
})