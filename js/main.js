async function runPython() {
    const pyCode = `print("¡Hola, mundo retro geek!")`;
    const output = document.getElementById('output');
    output.textContent = "Ejecutando...";
    
    if (!window.pyodide) {
        output.textContent = "Cargando Python...";
        window.pyodide = await loadPyodide();
    }
    
    try {
        let result = await window.pyodide.runPythonAsync(pyCode);
        output.textContent = result || "Código ejecutado exitosamente";
    } catch (e) {
        output.textContent = "Error: " + e;
    }
}

// Smooth scroll para navegación
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
