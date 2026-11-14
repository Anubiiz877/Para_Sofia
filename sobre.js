document.addEventListener('DOMContentLoaded', function() {
    const envelope = document.getElementById('envelope');
    const letter = envelope.querySelector('.envelope__letter');
    const scene = document.querySelector('.scene');
    
    envelope.addEventListener('click', function() {
        if (envelope.classList.contains('open')) return;
        
        // Paso 1: se abre la solapa
        envelope.classList.add('open');
        
        // Paso 2: la carta sale del sobre y se despliega
        setTimeout(() => {
            // Sacar la carta del sobre para que el desvanecimiento del sobre no la afecte
            scene.appendChild(letter);
            letter.classList.add('reveal');
            scene.classList.add('revealed');
        }, 700);
    });
});