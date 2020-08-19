import $ from "jquery";

const cron = require('node-cron');
let height = 0;
let width = 320;

$(document).ready(function () {
    initialisation();
    $('#formOptions').submit(function (e) {
        form();
        e.preventDefault();
    });

});

let initialisation = function () {
    let streaming = false,
        video = $('#video').get(0),
        cover = $('#cover'),
        screenshot = $('#screenshot'),
        canvas = $('#canvas').get(0);

    navigator.getMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getMedia(
        {
            video: true,
            audio: false
        },
        function (stream) {
            console.log(stream);
            if (navigator.mozGetUserMedia) {
                video.mozSrcObject = stream;

            } else {
                const mediaStream = new MediaStream(stream);
                video.srcObject = mediaStream;
                console.log(video)

            }
            video.play();
        },
        function (err) {
            console.log("erreur " + err);
        }
    );

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

};
let form = function () {
    let interval = $('#interval'),
        duree = $('#duree'),
        heureDebut = $('#heure'),
        chemin = $('#chemin');
    if (interval.val().length <= 0){
        return;
    }
    if (duree.val().length <= 0){
        return;
    }
    if (heureDebut.val().length <= 0){
        return;
    }
    if (chemin.val().length <= 0){
        return;
    }

    formSubmited();

    function formSubmited() {
        let heureDebutVal = heureDebut.val().split(':');
        let heure = heureDebutVal[0];
        let minutes = heureDebutVal[1];

        //  console.log(heureDebutVal, "-", heure, "-", minutes)
        cron.schedule(`${minutes} ${heure} * * *`, () => {
            console.log('Tâche en cours');


            setTimeout(function () {
                clearInterval(intervalFunction);
            }, duree.val() * 1000);
        });


    }

    function screen(chemin) {
        let canvas = $('#canvas').get(0),
            photo = $('#photo').get(0);

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(video, 0, 0, width, height);
        let data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
        let formData = new FormData();
        let date = new Date();
        let heure = date.toLocaleTimeString("fr-FR");
        date = date.toLocaleDateString("fr-FR");
        heure = heure.split(":");
        heure = heure.join('-');
        date = date.split("/");
        date = date.join('-');

        let base64 = data.replace('data:image/png;base64,', '');
        formData.append('fichier', base64);
        formData.append('chemin', chemin);
        formData.append('nomFichier', `${date}.${heure}`);

        $.post({
            url: '/upload',
            data: formData,
            processData: false,
            contentType: false,
            error: function () {
                console.log("fail");
            },
            success: function (data) {
                console.log(data)
            }
        });


    }
};




