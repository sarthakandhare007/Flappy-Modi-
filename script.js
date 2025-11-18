let move_speed = 3, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');

let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// Background Music
let sound_bg = document.getElementById("bg-music");
sound_bg.volume = 0.4;

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// Allow music after 1st keypress
document.addEventListener("keydown", () => {
    sound_bg.volume = 0.4;
}, { once: true });

document.addEventListener('keydown', (e) => {
    
    if(e.key == 'Enter' && game_state != 'Play'){
        
        document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());

        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';

        // START BACKGROUND MUSIC
        sound_bg.currentTime = 0;
        sound_bg.play().catch(err => console.log(err));

        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');

        play();
    }
});

function play(){
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {

            let pipe_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if(pipe_props.right <= 0){
                element.remove();
            } 
            else {
                // COLLISION
                if (
                    bird_props.left < pipe_props.left + pipe_props.width &&
                    bird_props.left + bird_props.width > pipe_props.left &&
                    bird_props.top < pipe_props.top + pipe_props.height &&
                    bird_props.top + bird_props.height > pipe_props.top
                ) {
                    // STOP MUSIC
                    sound_bg.pause();

                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                }

                // SCORE
                if (
                    pipe_props.right < bird_props.left &&
                    pipe_props.right + move_speed >= bird_props.left &&
                    element.increase_score == '1'
                ) {
                    score_val.innerHTML = Number(score_val.innerHTML) + 1;
                    sound_point.play();
                }

                element.style.left = pipe_props.left - move_speed + 'px';
            }
        });

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;

    function apply_gravity(){
        if(game_state != 'Play') return;

        bird_dy = bird_dy + grativy;

        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                bird_dy = -7.6;
            }
        });

        // Touch ground or sky
        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            sound_bg.pause();
            game_state = 'End';
            window.location.reload();
            return;
        }

        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 35;

    function create_pipe(){
        if(game_state != 'Play') return;

        if(pipe_seperation > 115){
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            let top_pipe = document.createElement('div');
            top_pipe.className = 'pipe_sprite';
            top_pipe.style.top = pipe_posi - 70 + 'vh';
            top_pipe.style.left = '100vw';

            let bottom_pipe = document.createElement('div');
            bottom_pipe.className = 'pipe_sprite';
            bottom_pipe.style.top = pipe_posi + pipe_gap + 'vh';
            bottom_pipe.style.left = '100vw';
            bottom_pipe.increase_score = '1';

            document.body.appendChild(top_pipe);
            document.body.appendChild(bottom_pipe);
        }

        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
