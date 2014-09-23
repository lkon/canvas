$(function(){
    var $cvs = $('#cvs' ),
        width = 484,
        height = 369,
        ctx = $cvs.get(0 ).getContext('2d' ),
        img = new Image(),
        imageData,
        pixels,
        columns,
        rows,
        temp = document.createElement('canvas' ),
        tempCtx = temp.getContext('2d');

    $cvs.attr({
        'width': width,
        'height': height
    });
    temp.setAttribute('width', width);
    temp.setAttribute('height', height);
    /*
     * 1. загружаем рисунок
     * 2. получаем объект пикселей
     * 3. в цикле от 0 до ширины канвас рисуем один столбец данных со сдвигом на один столбец
     * Красная компонента: ((width * у) + х) * 4.
     * Зеленая компонента: ((width * у) + х) * 4 + 1.
     * Синяя компонента: ((width * у) + х) * 4 + 2.
     * Альфа-компонента: ((width * у) + х) * 4 + 3.
     */
    img.onload = function() {
        //context.drawImage(img, source_x, source_y, source_width, source_height, x, y, width, height);
        tempCtx.drawImage(img, 0, 0, 453, 232);
    };
    img.src = "img/shape20.png";

    imageData = tempCtx.getImageData(0, 0, width, height);
    pixels = imageData.data;
    columns = imageData.width;
    rows = imageData.height;

    /**
     * x - смещение столбца по горизонтали
     * у - номер строки, перебирается высота (row)
     */
    var x = 0,
        y = 0,
        chart = new Uint8ClampedArray(4*rows),
        red,
        green,
        blue,
        alf;


    while(x < columns){
        while(y < rows){

            if ( x % 2 == 0 ) {
                red = ((columns * y) + x) * 4;
                green = ((columns * y) + x) * 4 + 1;
                blue = ((columns * y) + x) * 4 + 2;
                alf = ((columns * y) + x) * 4 + 3;

                chart[x] = pixels[red];
                chart[x+1] = pixels[green];
                chart[x+2] = pixels[blue];
                chart[x+3] = pixels[alf];


            } else {
                chart[x] = 255;
                chart[x+1] = 0;
                chart[x+2] = 0;
                chart[x+3] = 255;
            }
            y++;
        }
        //context.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
        ctx.putImageData({data:chart, width:1, height:rows},0,0);
        x++;
    }


    //ctx.putImageData(pixels, x, y);


})

var img2Canvas = function( img ) {

    var mask = img.getAttribute( "data-alpha-src" ),
        bg = img.getAttribute( "data-fon-src" ),
        dx = img.getAttribute( "data-translate-x" ),
        dy = img.getAttribute( "data-translate-y" );
    if ( !mask )
        return;
    img.style.visiblity = "hidden";

    var imgIn = document.createElement( "img" );// img inside canvas
    imgIn.src = img.src;
    imgIn.onload = function() {

        var maskIn = document.createElement( "img" );// mask inside canvas
        maskIn.src = mask;
        maskIn.onload = function() {

            var bgIn = document.createElement( "img" );// fon inside canvas
            bgIn.src = bg;
            bgIn.onload = function() {

                var canvas = document.createElement( "canvas" );
                canvas.width = (imgIn.width > bgIn.width) ? imgIn.width : bgIn.width;
                canvas.height = (imgIn.height > bgIn.height) ? imgIn.height : bgIn.height;
                canvas.className = img.className + '-canvas';
                img.parentNode.replaceChild( canvas, img );
                var ctx = canvas.getContext( "2d" );
                //сначала контекст холста очищается (на всякий случай)
                ctx.clearRect( 0, 0, canvas.width, canvas.height );
                ctx.translate( dx, dy );
                ctx.drawImage( imgIn, 0, 0, imgIn.width, imgIn.height );
                ctx.globalCompositeOperation = "xor";
                ctx.drawImage( maskIn, 0, 0, maskIn.width, maskIn.height );
                ctx.translate( -dx, -dy );
                ctx.drawImage( bgIn, 0, 0, bgIn.width, bgIn.height );
            }
        }
    }
};




