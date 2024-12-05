function initPage13() {
    const codingFortunes = [
        "You will contribute to an open-source project that becomes wildly popular!",
        "You will gain lots of contributions.",
        "You'll end in the top 50 rank for a contest, which is April Fools Day.",
        "Your code will become cleaner than it has ever been.",
        "A random typo in your code will accidentally solve a complex algorithm problem.",
        "You'll debug a critical issue moments before a major presentation, becoming the office hero.",
        "Your side project will go viral, leading to exciting new career opportunities.",
        "You will find a girlfriend.",
        "Your rubber duck will gain sentience and start offering genuinely helpful coding advice.",
        "You will not find a girlfriend."
    ];

    const revealButton = document.getElementById('reveal-button');
    const luckResult = document.getElementById('luck-result');
    const luckContainer = document.querySelector('.luck-container');
    const luckTitle = document.querySelector('.luck-title');
    const codeBlock = document.querySelector('.code-block');

    // Slow reveal effect
    setTimeout(() => {
        luckContainer.style.opacity = '1';
        luckContainer.style.transform = 'translateY(0)';
    }, 500);

    setTimeout(() => {
        luckTitle.style.opacity = '1';
        luckTitle.style.transform = 'translateY(0)';
    }, 1000);

    setTimeout(() => {
        codeBlock.style.opacity = '1';
        codeBlock.style.transform = 'translateY(0)';
    }, 1500);

    setTimeout(() => {
        revealButton.style.opacity = '1';
        revealButton.style.transform = 'translateY(0)';
    }, 2000);

    revealButton.addEventListener('click', () => {
        revealButton.disabled = true;
        luckResult.style.opacity = '0';
        
        setTimeout(() => {
            const fortune = codingFortunes[Math.floor(Math.random() * codingFortunes.length)];
            luckResult.textContent = fortune;
            luckResult.style.opacity = '1';
            
            setTimeout(() => {
                revealButton.disabled = false;
            }, 1000);
        }, 500);
    });

    // Typing effect for the code block
    const codeElement = document.querySelector('.typing-effect');
    codeElement.style.width = '0';
    setTimeout(() => {
        codeElement.style.width = '100%';
    }, 2500);

    // Add floating code elements
    const floatingCodeSnippets = [
        'if (coder.caffeine < 100) { coder.drink(coffee); }',
        'while (!succeed) { try(); }',
        'function solveAllProblems() { /* TODO */ }',
        'git commit -m "Fixed bug, hope this works"',
        '// This code works, don\'t touch it!',
        'for (let i = 0; i < Infinity; i++) { code(); }',
        'catch (error) { blame(coworker); }',
        'if (code.works) { dont.touch(); }',
        'function sleep() { return new Promise(resolve => setTimeout(resolve, 0)); }',
        '// Here be dragons',
        'const answer = 42; // The meaning of life, the universe, and everything',
        'try { code(); } catch (bug) { ignore(bug); }',
        '/* Note to self: refactor this later */',
        'if (coder.isStuck()) { coder.googleIt(); }',
        'while (deadlines.approach()) { panic(); }',
        'function optimizeCode() { /* Magic happens here */ }',
        '// I have no idea why this works, but it does',
        'if (project.isOnFire) { developer.panic(); }',
        'console.log("Why isn\'t this working?");',
        'debugger; // Left here for future debugging'
    ];

    function createFloatingCode() {
        const floatingCode = document.createElement('div');
        floatingCode.className = 'floating-code';
        floatingCode.textContent = floatingCodeSnippets[Math.floor(Math.random() * floatingCodeSnippets.length)];
        
        // Randomize starting position, including from the sides
        const startSide = Math.random() < 0.5 ? 'left' : 'right';
        floatingCode.style[startSide] = `${Math.random() * 100}vw`;
        floatingCode.style.top = `${Math.random() * 100}vh`;
        
        document.querySelector('.luck-reveal-page').appendChild(floatingCode);

        const duration = 15000 + Math.random() * 10000; // Increased duration for slower movement
        const direction = Math.random() < 0.5 ? 1 : -1; // Randomize direction

        floatingCode.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { transform: `translate(${direction * 50}vw, -50vh)`, opacity: 1, offset: 0.1 },
            { transform: `translate(${direction * 100}vw, -100vh)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => {
            floatingCode.remove();
            createFloatingCode();
        };
    }

    // Create more initial floating code elements
    for (let i = 0; i < 15; i++) {
        setTimeout(createFloatingCode, i * 500);
    }

    // Continuously add new floating code elements
    setInterval(createFloatingCode, 2000);
}

document.addEventListener('DOMContentLoaded', initPage13);
