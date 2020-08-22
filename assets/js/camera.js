import $ from "jquery";

const cron = require('node-cron');

let height = 239;
let width = 320;
let fichiers = [];

$(document).ready(function () {
    initialisation();
    $('#formOptions').submit(function (e) {
        form();
        e.preventDefault();
    });
    // let selecteur = $('#fileselector');
    //
    // $('#btn-file').click(function () {
    //     selecteur.trigger('click');
    // });
    //
    // selecteur.change(function (e) {
    //     let directory = $(this).val();
    //     let lastindexof = directory.lastIndexOf("\\");
    //     directory = directory.slice(0, lastindexof +1);
    //     console.log(directory);
    //     $('#chemin').val(directory);
    // });


    $('#interval').keydown(function (e) {
        if (/^([A-z]|[@&"()!_$*€£`+=\/;?#.])$/.test(e.key)) {
            e.preventDefault();
        } else {

        }
    });

    $('#duree').keydown(function (e) {
        if (/^([A-z]|[@&"()!_$*€£`+=\/;?#.])$/.test(e.key)) {
            e.preventDefault();
        } else {

        }
    });

});

let initialisation = function () {
    let streaming = false,
        video = $('#video').get(0),
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
    if (interval.val().length <= 0) {
        return;
    }
    if (duree.val().length <= 0) {
        return;
    }
    if (heureDebut.val().length <= 0) {
        return;
    }
    if (chemin.val().length <= 0) {
        return;
    }

    formSubmited();

    function formSubmited() {


        let heureDebutVal = heureDebut.val().split(':');
        let heure = heureDebutVal[0];
        let minutes = heureDebutVal[1];

        //  console.log(heureDebutVal, "-", heure, "-", minutes)
        cron.schedule(`${minutes} ${heure} * * *`, () => {
            $('#alert-content').empty().append("Capture en cours ...");
            $('#alert').slideDown('slow');
            console.log('Tâche en cours');
            let intervalFunction = setInterval(function () {
                screen(chemin.val())
            }, interval.val() * 1000);

            setTimeout(function () {
                clearInterval(intervalFunction);
                $('#alert').slideUp('slow').addClass("alert-success").removeClass('alert-primary');
                $('#alert-content').empty().append("Succès: Capture terminée");
                $('#alert').slideDown('slow');
                setTimeout(function () {
                    $('#alert').slideUp('slow').removeClass("alert-success").addClass('alert-primary');
                    $('#alert-content').empty();
                }, 3500)
            }, duree.val() * 1000);
        });


    }

    function screen(chemin) {
        let canvas = $('#canvas').get(0),
            photo = $('#photo').get(0),
            video = $('#video').get(0);

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
                console.log(data);
                fichiers.push(data);
                afficherImageUpload(data)
            }
        });


    }

    function afficherImageUpload(image) {
        let card = $('<div>', {class: 'card mx-2 p-2', text: `${image[1]}${image[0]}`});
        $('#lesImages').append(card)
    }
};




